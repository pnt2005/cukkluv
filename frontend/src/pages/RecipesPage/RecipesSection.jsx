import { useState } from "react";
import RecipeCard from "./RecipesCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RecipeSection = ({ title, recipes, onRecipeClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction) => {
    const container = document.getElementById(`scroll-${title}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  if (recipes.length === 0) return null;

  return (
    <div
      className="mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="fw-bold mb-3 text-dark" style={{ fontSize: "25px", WebkitTextStroke: "1.5px black" }}>
        {title}
      </h2>
      <div className="position-relative">
        {/* Nút scroll trái */}
        <button
          onClick={() => scroll("left")}
          className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle shadow opacity-75"
          style={{
            zIndex: 10,
            width: "40px",
            height: "40px",
            opacity: isHovered ? 0.75 : 0,
            visibility: isHovered ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Container các cards */}
        <div
          id={`scroll-${title}`}
          className="d-flex gap-4 overflow-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {recipes.map((recipe) => (
            <div key={recipe.id} onClick={() => onRecipeClick(recipe.id)}>
              <RecipeCard
                recipe={recipe}
                showAuthor={title === "COMMUNITY'S RECIPES"}
                layout="vertical"
              />
            </div>
          ))}
        </div>

        {/* Nút scroll phải */}
        <button
          onClick={() => scroll("right")}
          className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle shadow opacity-75"
          style={{
            zIndex: 10,
            width: "40px",
            height: "40px",
            opacity: isHovered ? 0.75 : 0,
            visibility: isHovered ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        #scroll-${title}::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecipeSection;
