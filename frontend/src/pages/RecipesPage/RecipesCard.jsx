import { Eye, Clock, Bookmark, User, Heart, MessageCircle } from "lucide-react";
import { timeAgo } from "../../utils/time.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecipeCard = ({ recipe, showAuthor, layout = "vertical" }) => {
  if (layout === "vertical") {
    return (
      <div
        className="flex-shrink-0 bg-white rounded-3 overflow-hidden shadow-sm hover:shadow-md transition-all"
        style={{
          width: "260px",
          height: "260px",
          cursor: "pointer",
        }}
      >
        {/* Phần ảnh */}
        <div
          className="position-relative"
          style={{ height: "160px" }}
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-100 h-100 object-fit-cover"
          />

          {/* Nút lưu */}
          <button
            className="position-absolute top-0 end-0 m-2 btn btn-light rounded-circle p-1 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: handleSave(recipe.id)
            }}
          >
            <Bookmark size={16} />
          </button>

          {/* Thời gian đăng */}
          <div className="position-absolute bottom-0 start-0 m-2 px-2 py-1 bg-dark bg-opacity-50 text-white rounded small">
            {timeAgo(recipe.created_at)}
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-2">
          <h3
            className="fw-bold mb-1 text-truncate"
            style={{ fontSize: "15px" }}
          >
            {recipe.title}
          </h3>

          {/* Thông tin + action */}
          <div
            className="d-flex align-items-center justify-content-between text-muted"
            style={{ fontSize: "13px" }}
          >
            {/* Bên trái: cookTime / view / portion */}
            <div className="d-flex align-items-center" style={{ gap: "12px" }}>
              <div className="d-flex align-items-center">
                <Clock size={14} className="me-1" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="d-flex align-items-center">
                <Eye size={14} className="me-1" />
                <span>{recipe.views}</span>
              </div>
              <div className="d-flex align-items-center">
                <User size={14} className="me-1" />
                <span>{recipe.portion}</span>
              </div>
            </div>

            {/* Bên phải: like & comment */}
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <button
                className="btn btn-link p-0 text-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: handleLike(recipe.id)
                }}
              >
                <Heart size={16} />
              </button>

                <button
                  className="btn btn-link p-0 text-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: openComments(recipe.id)
                  }}
                >
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>


          {/* Tác giả */}
          {showAuthor && (
            <div className="d-flex align-items-center mt-2">
              <img
                src={`${API_BASE_URL}${recipe.author.avatar}`}
                alt="Avatar"
                className="rounded-circle me-2"
                style={{
                  width: "25px",
                  height: "25px",
                  objectFit: "cover",
                }}
              />
              <div className="fw-bold" style={{ fontSize: "13px" }}>
                {recipe.author.username}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default RecipeCard;
