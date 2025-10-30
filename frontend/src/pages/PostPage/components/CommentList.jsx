import InfiniteScrollList from "../../../components/InfiniteScroll.jsx";
import CommentItem from "./CommentItem.jsx";

export default function CommentList({ postId, items, onLoadMore }) {
  return (
    <InfiniteScrollList
      items={items}
      renderItem={(c) => <CommentItem key={c.id} comment={c} postId={postId} />}
      onLoadMore={onLoadMore}
      containerStyle={{
        height: "100%",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "5px",
        backgroundColor: "#f8f9fa",
      }}
    />
  );
}