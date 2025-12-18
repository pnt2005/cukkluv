import { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore.js";
import PostCard from "./PostCard";
import PostModal from "./PostModal";
import InfiniteScroll from "../../components/InfiniteScroll.jsx";

export default function PostPage() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { posts, fetchPosts, hasNext, page } = usePostStore();

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (hasNext) {
      fetchPosts(page + 1);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <InfiniteScroll
            items={posts}
            hasNext={hasNext}
            onLoadMore={handleLoadMore}
            renderItem={(post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPostId(post.id)}
              />
            )}
          />
        </div>
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
