import React from 'react';
import { Eye, Clock } from 'lucide-react';
import LikeButton from '../../components/LikeButton';

const RecipeCard = ({ recipe, showAuthor }) => {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-48">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white rounded-md shadow-lg">
          <LikeButton 
            postId={recipe.id}
            initialLikeCount={recipe.likes}
            initiallyLiked={recipe.isLiked || false}
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.name}</h3>
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
            Công thức được tạo bởi: <span className="font-medium text-gray-700">{recipe.author}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
