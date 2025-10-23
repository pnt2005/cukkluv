import { useState } from "react";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import InfiniteScroll from "../../components/InfiniteScroll.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostPage() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Hàm fetch page cho InfiniteScrollList
  const fetchPostsPage = async (page) => {
    const res = await fetch(`${API_BASE_URL}/posts/?page=${page}`);
    return res.json(); // DRF trả { results, next, previous, count }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column align-items-center">
        <InfiniteScroll
          fetchPage={fetchPostsPage}
          renderItem={(post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => setSelectedPostId(post.id)}
            />
          )}
          containerStyle={{ width: "100%" }}
        />
      </div>

      {selectedPostId && (
        <PostModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
}
