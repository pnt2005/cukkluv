import { Eye, Clock } from 'lucide-react';

const RecipeCard = ({ recipe, showAuthor, layout = "vertical" }) => {
  // Layout dọc (dùng cho scroll ngang)
  if (layout === "vertical") {
    return (
      <div 
        className="flex-shrink-0 bg-white rounded-3 overflow-hidden shadow-sm hover:shadow-md transition-all" 
        style={{ 
          width: "250px", 
          height: "250px",
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
            className="w-100 h-100 object-fit-cover rounded-l-3 rounded-r-3"
          />
        </div>
        
        {/* Phần nội dung */}
        <div className="p-2">
          {/* Tiêu đề */}
          <h3 
            className="fw-bold mb-2 text-truncate" 
            style={{ fontSize: "15px" }}
          >
            {recipe.title}
          </h3>
          
          {/* Thông tin thời gian & lượt xem */}
          <div 
            className="d-flex align-items-center text-muted" 
            style={{ fontSize: "14px", gap: "12px" }}
          >
            <div className="d-flex align-items-center">
              <Clock size={14} className="me-1" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="d-flex align-items-center">
              <Eye size={14} className="me-1" />
              <span>{recipe.views}</span>
            </div>
          </div>
          
          {/* Thông tin tác giả */}
          {showAuthor && (
            <div 
              className="mt-1 text-muted" 
              style={{ fontSize: "13px" }}
            >
              Công thức được tạo bởi: {' '}
              <span className="fw-semibold text-dark">
                {recipe.author.username}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default RecipeCard;