import React, { useState, useEffect, useRef, useCallback } from "react";

import { highlightMatches } from "../helpers";

const baseClass = "command-palette";
const BATCH_SIZE = 10;
const DEBOUNCE_MS = 200;

interface IHighlightedLabelProps {
  text: string;
  query: string;
}

/**
 * Wraps matched ranges of `query` within `text` in <mark> elements so the
 * user can see which part of a result matched their search. Renders a
 * Fragment — callers control the surrounding element/class.
 *
 * Segments are batched in groups of BATCH_SIZE to keep the initial render
 * fast. Remaining segments are loaded lazily via a debounce timer (input
 * pause) and an IntersectionObserver (scroll-into-view).
 */
const HighlightedLabel = ({
  text,
  query,
}: IHighlightedLabelProps): JSX.Element => {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const segments = highlightMatches(text, query);
  const hasMore = segments.length > visibleCount;

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [text, query]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, segments.length));
  }, [segments.length]);

  // Debounce timer: load the next batch after a pause in input.
  useEffect(() => {
    if (!hasMore) return;
    const timer = setTimeout(loadMore, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [hasMore, loadMore]);

  // IntersectionObserver: load the next batch when the sentinel element
  // scrolls into (or near) the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "50px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const visible = segments.slice(0, visibleCount);

  return (
    <>
      {visible.map((seg, i) =>
        seg.matched ? (
          // Index keys are safe — segments are derived synchronously from
          // the same text + query each render, so order is stable.
          <mark key={i} className={`${baseClass}__item-label-match`}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      {hasMore && (
        <span ref={sentinelRef} className={`${baseClass}__sentinel`}>
          {"\u200B"}
        </span>
      )}
    </>
  );
};

export default HighlightedLabel;