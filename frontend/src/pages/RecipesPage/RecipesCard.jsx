import React from 'react';
import { Eye, Clock } from 'lucide-react';
import LikeButton from '../../components/LikeButton';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecipesCard = ({ recipe, showAuthor, layout = "vertical" }) => {
  // Layout dọc (dùng cho scroll ngang)
  if (layout === "vertical") {
    return (
      <div className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-white rounded-md shadow-lg">
            <LikeButton 
              postId={recipe.id}
              initialLikeCount={recipe.like_count}
              initiallyLiked={recipe.user_liked || false}
            />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{recipe.views}</span>
            </div>
          </div>
          {showAuthor && (
            <div className="mt-2 text-sm text-gray-500">
              Công thức được tạo bởi: <span className="font-medium text-gray-700">{recipe.author.username}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Layout ngang (dùng cho search results)
  return (
    <div className="card mb-3 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="row g-0">
        {/* Ảnh bên trái */}
        <div className="col-md-3 position-relative">
          <img 
            src={recipe.image}  
            alt={recipe.title}
            className="img-fluid rounded-start h-100 object-fit-cover"
            style={{ minHeight: "150px", maxHeight: "180px" }}
          />
          <div className="position-absolute bottom-0 end-0 m-2">
            <LikeButton 
              postId={recipe.id}
              initialLikeCount={recipe.like_count}
              initiallyLiked={recipe.user_liked || false}
            />
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="col-md-9">
          <div className="card-body">
            <h5 className="card-title fw-bold mb-2">{recipe.title}</h5>
            <div className="d-flex align-items-center gap-3 text-muted small mb-2">
              <div className="d-flex align-items-center gap-1">
                <Clock size={16} />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Eye size={16} />
                <span>{recipe.views}</span>
              </div>
            </div>
            {showAuthor && (
              <p className="card-text small text-muted mb-0">
                Công thức được tạo bởi: <span className="fw-semibold text-dark">{recipe.author.username}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesCard;