import React, { useState, useEffect, useRef, useCallback } from "react";

import { highlightMatchesLazy } from "../helpers";

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
  const { segments, hasMore: hasMoreRanges } = highlightMatchesLazy(
    text,
    query,
    BATCH_SIZE
  );
  const hasMore = segments.length > visibleCount || hasMoreRanges;

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [text, query]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, segments.length));
  }, [segments.length]);

  useEffect(() => {
    if (!hasMore) return;
    const timer = setTimeout(loadMore, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [hasMore, loadMore]);

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
          <mark key={i} className={`${baseClass}__item-label-match`}>
            {seg.text}
          </mark>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        )
      )}
      {hasMore && (
        <span ref={sentinelRef} className={`${baseClass}__highlight-sentinel`}>
          {"\u200B"}
        </span>
      )}
    </>
  );
};

export default HighlightedLabel;
