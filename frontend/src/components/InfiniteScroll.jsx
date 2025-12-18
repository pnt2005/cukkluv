import { useEffect, useRef, useState } from "react";

export default function InfiniteScroll({
  items = [],
  renderItem,
  onLoadMore,
  hasNext = true,
  rootMargin = "200px",
  minLoadingTime = 200,
}) {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const startTimeRef = useRef(0);
  const ignoreFirstIntersectRef = useRef(true);

  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // 🚫 bỏ qua lần intersect đầu tiên (khi mới mount)
        if (ignoreFirstIntersectRef.current) {
          ignoreFirstIntersectRef.current = false;
          return;
        }

        if (entry.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          startTimeRef.current = Date.now();
          forceRender((n) => n + 1);
          onLoadMore?.();
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNext, onLoadMore, rootMargin]);

  useEffect(() => {
    if (!loadingRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remain = minLoadingTime - elapsed;

    const timer = setTimeout(() => {
      loadingRef.current = false;
      forceRender((n) => n + 1);
    }, Math.max(0, remain));

    return () => clearTimeout(timer);
  }, [items.length, minLoadingTime]);

  return (
    <>
      {items.map(renderItem)}

      {hasNext && (
        <div className="d-flex justify-content-center my-3">
          {loadingRef.current && (
            <div className="spinner-border text-secondary" role="status" />
          )}
          <div ref={sentinelRef} style={{ height: 1 }} />
        </div>
      )}
    </>
  );
}
