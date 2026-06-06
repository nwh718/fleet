import { useState, useEffect, useRef, useCallback } from "react";

const INITIAL_COUNT = 10;
const BATCH_SIZE = 10;
const DEBOUNCE_MS = 300;

interface IUseLazyItemsOptions<T> {
  items: T[];
  initialCount?: number;
  batchSize?: number;
  debounceMs?: number;
}

interface IUseLazyItemsResult<T> {
  visibleItems: T[];
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLSpanElement>;
  loadMore: () => void;
}

const useLazyItems = <T>({
  items,
  initialCount = INITIAL_COUNT,
  batchSize = BATCH_SIZE,
  debounceMs = DEBOUNCE_MS,
}: IUseLazyItemsOptions<T>): IUseLazyItemsResult<T> => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [items, initialCount]);

  const hasMore = items.length > visibleCount;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
  }, [batchSize, items.length]);

  useEffect(() => {
    if (!hasMore) return;
    const timer = setTimeout(loadMore, debounceMs);
    return () => clearTimeout(timer);
  }, [hasMore, loadMore, debounceMs]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return {
    visibleItems: items.slice(0, visibleCount),
    hasMore,
    sentinelRef,
    loadMore,
  };
};

export default useLazyItems;
