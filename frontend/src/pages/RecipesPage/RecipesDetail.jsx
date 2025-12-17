import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipeStore } from "../../store/useRecipesStore";
import { recipesAPI } from "../../utils/api";
import { Eye, Clock, Pencil, Save, X, Upload } from "lucide-react";

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
  
  // Local states
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch recipe khi component mount hoặc id thay đổi
  useEffect(() => {
    fetchRecipeDetail(id);
  }, [id, fetchRecipeDetail]);

  // Sync form với recipe data từ store
  useEffect(() => {
    if (recipe && recipe.id === parseInt(id)) {
      setForm(recipe);
    }
  }, [recipe, id]);

  // Cleanup object URLs khi component unmount
  useEffect(() => {
    return () => {
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
      }
      // Cleanup step image previews
      if (form?.steps) {
        form.steps.forEach(step => {
          step.images.forEach(img => {
            if (img.preview && img.preview.startsWith('blob:')) {
              URL.revokeObjectURL(img.preview);
            }
          });
        });
      }
    };
  }, [mainImagePreview, form]);

  // Loading state
  if (loading || !form) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------
  // HANDLERS - Main Fields
  // -------------------------------------
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMainImageChange = (file) => {
    if (!file) return;

    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }

    setForm(prev => ({ ...prev, image: file }));
    setMainImagePreview(URL.createObjectURL(file));
  };

  // -------------------------------------
  // HANDLERS - Steps
  // -------------------------------------
  const handleStepTextChange = (index, value) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, text: value } : step
      ),
    }));
  };

  const addStepImage = (stepIndex, file) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              images: [
                ...step.images,
                {
                  id: null,     // ảnh mới
                  file,         // File thật
                  preview,      // blob preview
                  url: null,    // ảnh cũ không có
                }
              ]
            }
          : step
      )
    }));
  };

  const removeStepImage = (stepIndex, imgIndex) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex
          ? {
              ...step,
              images: step.images.filter((_, idx) => idx !== imgIndex)
            }
          : step
      )
    }));
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: null,            // step mới
          text: "",
          order: prev.steps.length + 1,
          images: [],
        },
      ],
    }));
  };

  const removeStep = (stepIndex) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== stepIndex),
    }));
  };



  // -------------------------------------
  // SAVE (PATCH)
  // -------------------------------------
  const handleSave = async () => {
    setSaving(true);

    const fd = new FormData();

    // Basic fields
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("ingredients", form.ingredients);
    fd.append("cookTime", form.cookTime);
    fd.append("portion", form.portion);

    // Main image
    if (form.image instanceof File) {
      fd.append("image", form.image);
    }

    // Steps JSON (CHỈ ảnh cũ)
    const stepsPayload = form.steps.map(step => ({
      id: step.id,
      text: step.text,
      order: step.order,
      image_ids: step.images
        .filter(img => img.id)   // chỉ giữ ảnh cũ
        .map(img => img.id),
    }));

    fd.append("steps", JSON.stringify(stepsPayload));

    // Step images mới + meta (song song)
    form.steps.forEach(step => {
      step.images.forEach(img => {
        if (img.file instanceof File) {
          fd.append("step_images", img.file);
          fd.append(
            "step_image_meta",
            JSON.stringify({
              step_id: step.id,
            })
          );
        }
      });
    });

    try {
      const updated = await recipesAPI.updateRecipe(form.id, fd);

      updateRecipeInStore(updated);
      setForm(updated);
      setEditMode(false);

      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
        setMainImagePreview(null);
      }

      alert("Cập nhật công thức thành công!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Lỗi");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------
  // CANCEL EDIT
  // -------------------------------------

  const handleCancel = () => {
    setEditMode(false);
    setForm(recipe); // Reset về original data
    
    // Cleanup previews
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
      setMainImagePreview(null);
    }
  };

  // -------------------------------------
  // DELETE
  // -------------------------------------

  const handleDeleteRecipe = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa công thức này? Hành động này không thể hoàn tác."
    );
    
    if (!confirmed) return;

    setDeleting(true);
    
    try {
      await recipesAPI.deleteRecipe(form.id);
      
      // Remove from store
      deleteRecipeFromStore(form.id);
      
      alert("Xóa thành công!");
      
      // Navigate back to recipes list
      navigate("/recipes");
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`Lỗi: ${err.data?.detail || err.message}`);
      setDeleting(false);
    }
  };

  // -------------------------------------
  // RENDER HELPERS
  // -------------------------------------

  const renderMainImage = () => {
    let imageSrc = recipe.image;
    
    if (editMode) {
      if (mainImagePreview) {
        imageSrc = mainImagePreview;
      } else if (typeof form.image === 'string') {
        imageSrc = form.image;
      }
    }

    return (
      <div className="position-relative">
        <img
          src={imageSrc}
          alt={form.title}
          style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
        />
        
        {editMode && (
          <div className="position-absolute bottom-0 end-0 p-3">
            <label className="btn btn-sm btn-primary">
              <Upload size={16} className="me-1" />
              Đổi ảnh
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => handleMainImageChange(e.target.files[0])}
              />
            </label>
          </div>
        )}
      </div>
    );
  };

  const canEdit = currentUser && currentUser === recipe.author?.username;

  // -------------------------------------
  // MAIN RENDER
  // -------------------------------------

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="bg-white rounded shadow-sm overflow-hidden">

            {/* MAIN IMAGE */}
            {renderMainImage()}

            <div className="p-4">

              {/* TITLE & ACTION BUTTONS */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                {editMode ? (
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Recipe title"
                  />
                ) : (
                  <h2 className="mb-0">{recipe.title}</h2>
                )}

                {!editMode && canEdit && (
                  <div className="d-flex gap-2 ms-3">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setEditMode(true)}
                    >
                      <Pencil size={16} className="me-1" />
                      Chỉnh sửa
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleDeleteRecipe}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <X size={16} className="me-1" />
                          Xóa
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* COOK TIME + VIEWS */}
              <div className="d-flex gap-4 mb-4 text-muted small">
                <span>
                  <Clock size={16} className="me-1" />
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control form-control-sm d-inline-block"
                      style={{ width: "100px" }}
                      value={form.cookTime}
                      onChange={(e) => handleChange("cookTime", e.target.value)}
                      placeholder="e.g. 30 mins"
                    />
                  ) : (
                    recipe.cookTime
                  )}
                </span>
                <span>
                  <Eye size={16} className="me-1" />
                  {recipe.views} lượt xem
                </span>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-4">
                <h5>Mô tả</h5>
                {editMode ? (
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Brief description of the recipe"
                  />
                ) : (
                  <p className="text-muted">{recipe.description}</p>
                )}
              </div>

              {/* INGREDIENTS + PORTION */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="m-0">Nguyên liệu</h5>
                  <span className="text-muted small">
                    Số phần: {" "}
                    {editMode ? (
                      <input
                        type="number"
                        className="form-control form-control-sm d-inline-block"
                        style={{ width: "70px" }}
                        value={form.portion}
                        onChange={(e) => handleChange("portion", e.target.value)}
                        min="1"
                      />
                    ) : (
                      recipe.portion
                    )}
                  </span>
                </div>

                {editMode ? (
                  <textarea
                    className="form-control"
                    rows={6}
                    value={form.ingredients}
                    onChange={(e) => handleChange("ingredients", e.target.value)}
                    placeholder="One ingredient per line"
                  />
                ) : (
                  <ul className="list-unstyled">
                    {recipe.ingredients.split("\n").filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="text-primary me-2">•</span>
                        {line.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

                {/* STEPS */}
                <div className="mb-4">
                  <h5 className="mb-3 d-flex justify-content-between align-items-center">
                    Hướng dẫn
                    {editMode && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={addStep}
                      >
                        + Thêm bước
                      </button>
                    )}
                  </h5>

                  <ol className="ps-3">
                    {(editMode ? form.steps : recipe.steps).map((step, sIndex) => (
                      <li key={step.id ?? `new-${sIndex}`} className="mb-4">

                        {/* STEP TEXT */}
                        {editMode ? (
                          <textarea
                            className="form-control mb-2"
                            rows={3}
                            value={step.text}
                            onChange={(e) =>
                              handleStepTextChange(sIndex, e.target.value)
                            }
                            placeholder={`Step ${sIndex + 1}`}
                          />
                        ) : (
                          <p className="mb-2">{step.text}</p>
                        )}

                        {/* STEP IMAGES */}
                        {step.images.length > 0 && (
                          <div className="d-flex gap-2 flex-wrap mb-2">
                            {step.images.map((img, iIndex) => (
                              <div
                                key={img.id || img.preview || `img-${iIndex}`}
                                className="position-relative"
                              >
                                <img
                                  src={img.preview || img.image}
                                  className="rounded"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                  }}
                                />
                                {editMode && (
                                  <button
                                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                    onClick={() => removeStepImage(sIndex, iIndex)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ADD IMAGE */}
                        {editMode && (
                          <label className="btn btn-sm btn-outline-secondary me-2">
                            <Upload size={14} className="me-1" />
                            Thêm ảnh
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  addStepImage(sIndex, e.target.files[0]);
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                        )}

                        {/* REMOVE STEP */}
                        {editMode && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeStep(sIndex)}
                          >
                            Xóa bước
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>


              {/* SAVE + CANCEL BUTTONS (Edit Mode) */}
              {editMode && (
                <div className="d-flex gap-2 justify-content-end border-top pt-3">
                  <button 
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="me-1" />
                        Lưu
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={16} className="me-1" />
                    Hủy
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}