import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipeStore } from "../../store/useRecipesStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RecipesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchRecipeDetail, loading } = useRecipeStore();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchRecipeDetail(id).then((data) => setRecipe(data));
  }, [id]);

  if (loading || !recipe) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải công thức...</p>
        </div>
      </div>
    );
  }

  const ingredientsList = recipe.ingredients
    .split("\n")
    .filter((item) => item.trim());
  const stepsList = recipe.steps.split("\n").filter((item) => item.trim());

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Nút quay lại */}
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại
          </button>

          <div className="bg-white rounded shadow-sm overflow-hidden">
            {/* Image */}
            <img
              src={`${recipe.image}`}
              alt={recipe.title}
              className="w-100"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />

            <div className="p-4">
              {/* Title */}
              <h2 className="mb-3">{recipe.title}</h2>

              {/* CookTime + Views */}
              <div className="d-flex gap-4 mb-3 text-muted">
                <span>
                  <i className="bi bi-clock me-1"></i>
                  {recipe.cookTime}
                </span>
                <span>
                  <i className="bi bi-eye me-1"></i>
                  {recipe.views} lượt xem
                </span>
              </div>

              {/* Author */}
              <div className="d-flex align-items-center mb-4">
                <img
                  src={`${API_BASE_URL}${recipe.author.avatar}`}
                  alt="Avatar"
                  className="rounded-circle me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <span className="fw-medium">{recipe.author.username}</span>
              </div>

              <hr />

              {/* Description */}
              <div className="mb-4">
                <h5>Mô tả</h5>
                <p className="text-muted">{recipe.description}</p>
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <h5>Nguyên liệu</h5>
                <ul>
                  {ingredientsList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="mb-4">
                <h5>Các bước thực hiện</h5>
                <ol>
                  {stepsList.map((step, index) => (
                    <li key={index} className="mb-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}