import { useState, useEffect } from "react";
import { Save, Upload, Plus, Trash2 } from "lucide-react"; // Thêm Plus và Trash2

export default function RecipeEditForm({ recipe, onSave, onCancel, saving }) {
  const [form, setForm] = useState(recipe);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      form.steps.forEach(s => s.images.forEach(i => i.preview && URL.revokeObjectURL(i.preview)));
    };
  }, []);

  const handleMainImageChange = (file) => {
    if (!file) return;
    setForm(prev => ({ ...prev, image: file }));
    setMainImagePreview(URL.createObjectURL(file));
  };

  // --- LOGIC CHO STEPS ---
  
  const handleAddStep = () => {
    const newStep = {
      id: null, // ID null vì đây là bước mới hoàn toàn
      text: "",
      order: form.steps.length + 1,
      images: []
    };
    setForm(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const handleRemoveStep = (index) => {
    const updatedSteps = form.steps.filter((_, i) => i !== index);
    // Cập nhật lại 'order' cho đúng thứ tự sau khi xóa
    const reorderedSteps = updatedSteps.map((step, i) => ({ ...step, order: i + 1 }));
    setForm(prev => ({ ...prev, steps: reorderedSteps }));
  };

  const addStepImage = (stepIndex, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === stepIndex ? 
        { ...step, images: [...step.images, { id: null, file, preview }] } : step)
    }));
  };

  const handleInternalSave = () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("ingredients", form.ingredients);
    fd.append("cookTime", form.cookTime);
    fd.append("portion", form.portion);

    if (form.image instanceof File) fd.append("image", form.image);

    const stepsPayload = form.steps.map(step => ({
      id: step.id,
      text: step.text,
      order: step.order,
      image_ids: step.images.filter(img => img.id).map(img => img.id),
    }));
    fd.append("steps", JSON.stringify(stepsPayload));

    form.steps.forEach(step => {
      step.images.forEach(img => {
        if (img.file) {
          fd.append("step_images", img.file);
          fd.append("step_image_meta", JSON.stringify({ step_id: step.id, order: step.order }));
        }
      });
    });

    onSave(form, fd);
  };

  return (
    <div className="p-4">
      <div className="position-relative mb-3 text-center">
        <img src={mainImagePreview || form.image} className="w-100 rounded" style={{maxHeight: '300px', objectFit: 'cover'}} />
        <label className="btn btn-sm btn-warning position-absolute bottom-0 end-0 m-2 shadow">
          <Upload size={20} className="me-1" /> Thay ảnh chính
          <input type="file" className="d-none" onChange={e => handleMainImageChange(e.target.files[0])} />
        </label>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Tên món ăn</label>
        <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Mô tả ngắn</label>
        <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      </div>

      <h5 className="text-warning fw-bold">Nguyên liệu</h5>
      <textarea className="form-control mb-3" rows={5} value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-warning fw-bold mb-0">Hướng dẫn cách làm</h5>
        <button type="button" className="btn btn-sm btn-outline-success" onClick={handleAddStep}>
          <Plus size={18} className="me-1" /> Thêm bước
        </button>
      </div>

      {form.steps.map((step, sIdx) => (
        <div key={sIdx} className="border p-3 mb-3 rounded bg-light shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-primary">Bước {sIdx + 1}</span>
            <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleRemoveStep(sIdx)}>
              <Trash2 size={18} />
            </button>
          </div>
          
          <textarea 
            className="form-control mb-2" 
            placeholder="Nhập nội dung các bước làm..."
            value={step.text} 
            onChange={e => {
              const newSteps = [...form.steps];
              newSteps[sIdx].text = e.target.value;
              setForm({...form, steps: newSteps});
            }} 
          />
          
          <div className="d-flex gap-2 flex-wrap align-items-center">
             {step.images.map((img, iIdx) => (
               <img key={iIdx} src={img.preview || img.image} width="80" height="80" className="object-fit-cover rounded border" />
             ))}
             <label className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', borderStyle: 'dashed'}}>
                <div>
                  <Upload size={20} />
                  <div style={{fontSize: '10px'}}>Thêm ảnh</div>
                </div>
                <input type="file" className="d-none" onChange={e => addStepImage(sIdx, e.target.files[0])} />
             </label>
          </div>
        </div>
      ))}

      <div className="d-flex gap-2 justify-content-end mt-4 border-top pt-3">
        <button className="btn btn-secondary" onClick={onCancel}>Hủy bỏ</button>
        <button className="btn btn-success" onClick={handleInternalSave} disabled={saving}>
          {saving ? "Đang lưu..." : <><Save size={20} className="me-1" /> Lưu thay đổi</>}
        </button>
      </div>
    </div>
  );
}