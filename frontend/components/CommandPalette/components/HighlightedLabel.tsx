import React, { useState, useEffect, useRef } from "react";

import { highlightMatches, IHighlightSegment } from "../helpers";

const baseClass = "command-palette";
const INITIAL_MATCHES = 10;

interface IHighlightedLabelProps {
  text: string;
  query: string;
}

/**
 * Wraps matched ranges of `query` in `text` in <mark> elements so the
 * user can see which part of a result matched their search. Renders a
 * Fragment — callers control the surrounding element/class.
 * 
 * Implements lazy loading: initially shows only the first 10 matches,
 * loads remaining matches when user stops typing for 500ms or scrolls.
 */
const HighlightedLabel = ({
  text,
  query,
}: IHighlightedLabelProps): JSX.Element => {
  const [maxMatches, setMaxMatches] = useState(INITIAL_MATCHES);
  const [segments, setSegments] = useState<IHighlightSegment[]>([]);
  const hasMoreMatches = useRef(false);
  const debounceTimer = useRef<number | null>(null);

  // Check if there are more matches beyond INITIAL_MATCHES
  useEffect(() => {
    const fullSegments = highlightMatches(text, query);
    const initialSegments = highlightMatches(text, query, INITIAL_MATCHES);
    hasMoreMatches.current = fullSegments.length > initialSegments.length;
    setSegments(initialSegments);
    setMaxMatches(INITIAL_MATCHES);
  }, [text, query]);

  // Load all matches after a 500ms pause in typing
  useEffect(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    if (hasMoreMatches.current) {
      debounceTimer.current = window.setTimeout(() => {
        const fullSegments = highlightMatches(text, query);
        setSegments(fullSegments);
        hasMoreMatches.current = false;
      }, 500);
    }
    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [text, query]);

  // Load all matches if the component becomes visible (scroll into view)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMoreMatches.current) {
            const fullSegments = highlightMatches(text, query);
            setSegments(fullSegments);
            hasMoreMatches.current = false;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`.${baseClass}__item-label`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [text, query]);

  return (
    <>
      {segments.map((seg, i) =>
        seg.matched ? (
          // Index keys are safe — segments are derived synchronously from
          // the same text + query each render, so order is stable.
          // eslint-disable-next-line react/no-array-index-key
          <mark key={i} className={`${baseClass}__item-label-match`}>
            {seg.text}
          </mark>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
    </>
  );
};

export default HighlightedLabel;
