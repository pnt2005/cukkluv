import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipeStore } from "../../store/useRecipesStore";
import { recipesAPI } from "../../utils/api";
import { Eye, Clock, Pencil, Trash2 } from "lucide-react";
import RecipeEditForm from "./RecipeEditForm.jsx"; 
import { showSuccess, showError} from "../../utils/toast";
import Swal from 'sweetalert2';

export default function RecipesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    recipe, 
    updateRecipeInStore, 
    deleteRecipeFromStore,
    fetchRecipeDetail, 
    loading 
  } = useRecipeStore();

  const currentUser = localStorage.getItem("username") || "";
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRecipeDetail(id);
  }, [id, fetchRecipeDetail]);

  const canEdit = currentUser && currentUser === recipe?.author?.username;

    const handleSave = async (formData, fd) => {
        setSaving(true);
        try {
            const updated = await recipesAPI.updateRecipe(id, fd);
            if (updated && updated.id) {
                updateRecipeInStore(updated); 
                showSuccess("Cập nhật công thức thành công!"); 
                setTimeout(() => {
                setEditMode(false);
                }, 1000);
            } else {
                showError("Cập nhật công thức thất bại!");
        }
        } catch (err) {
        console.error("Update failed:", err);
        } finally {
        setSaving(false);
        }
    };

    const handleDeleteRecipe = async () => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#ffc107',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });


        if (result.isConfirmed) {
            setDeleting(true);
            try {
            await recipesAPI.deleteRecipe(id);
            deleteRecipeFromStore(id);
            
            showSuccess("Xóa công thức thành công!"); 
            
            setTimeout(() => {
                navigate("/recipes");
            }, 1500);
            } catch (err) {
            showError("Không thể xóa công thức.");
            setDeleting(false);
            }
        }
    };

  if (loading || !recipe) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="bg-white rounded shadow-sm overflow-hidden">
            
            {editMode ? (
              <RecipeEditForm 
                recipe={recipe} 
                onSave={handleSave} 
                onCancel={() => setEditMode(false)}
                saving={saving}
              />
            ) : (
              <>
                <img src={recipe.image} style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} alt={recipe.title} />
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h2 className="mb-0">{recipe.title}</h2>
                    {canEdit && (
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm" onClick={() => setEditMode(true)}>
                          <Pencil size={20} className="me-1" /> 
                        </button>
                        <button className="btn btn-sm" onClick={handleDeleteRecipe} disabled={deleting}>
                          {deleting ? "Deleting..." : <><Trash2 size={20} className="me-1" /></>}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-4 mb-4 text-muted large">
                    <span><Clock size={20} /> {recipe.cookTime}</span>
                    <span><Eye size={21} /> {recipe.views} lượt xem</span>
                    <span className="ms-auto">Khẩu phần: {recipe.portion}</span>
                  </div>

                  <h5 className="text-warning">Mô tả</h5>
                  <p className="text-muted">{recipe.description}</p>

                  <h5 className="mt-4 text-warning">Nguyên liệu</h5>
                  <ul className="list-unstyled">
                    {recipe.ingredients.split("\n").filter(l => l.trim()).map((line, idx) => (
                      <li key={idx}><span className="text-primary me-2">•</span>{line}</li>
                    ))}
                  </ul>

                  <h5 className="mt-4 text-warning">Hướng dẫn cách làm</h5>
                  <ol>
                    {recipe.steps.map((step) => (
                      <li key={step.id} className="mb-4">
                        <p>{step.text}</p>
                        <div className="d-flex gap-2 flex-wrap">
                          {step.images.map(img => (
                            <img key={img.id} src={img.image} className="rounded" style={{ width: "150px" }} />
                          ))}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}