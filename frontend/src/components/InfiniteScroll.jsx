import { useEffect, useRef } from "react";

export default function InfiniteScrollList({
  fetchPage,
  renderItem,
  items,
  onLoadMore,
  threshold = 200,
  containerStyle = { height: "100%", overflowY: "auto" },
}) {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop - container.clientHeight <
        threshold
      ) {
        onLoadMore?.();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [threshold, onLoadMore]);

  return (
    <div ref={containerRef} style={containerStyle}>
      {items?.map?.(renderItem)}
    </div>
  );
}
