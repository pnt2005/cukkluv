import { useEffect, useRef, useState, useCallback } from "react";

export default function InfiniteScrollList({
  fetchPage,       // async function(page) => { results, next }
  renderItem,      // function(item, index) => ReactNode
  initialPage = 1,
  threshold = 200, // px từ bottom để trigger load
  containerStyle = { height: "100%", overflowY: "auto" },
}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const containerRef = useRef();

  const loadNext = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const data = await fetchPage(page);
      setItems((prev) => [...prev, ...data.results]);
      setHasNext(Boolean(data.next));
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [page, loading, hasNext, fetchPage]);

  useEffect(() => {
    loadNext();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold
      ) {
        loadNext();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadNext, threshold]);

  return (
    <div ref={containerRef} style={containerStyle}>
      {items.map(renderItem)}
      {loading && <div className="text-center my-2">Loading...</div>}
      {!hasNext && !loading && <div className="text-center my-2">No more items</div>}
    </div>
  );
}
