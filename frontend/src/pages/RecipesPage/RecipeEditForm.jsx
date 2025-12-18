import { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";

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

  const addStepImage = (stepIndex, file) => {
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
          fd.append("step_image_meta", JSON.stringify({ step_id: step.id }));
        }
      });
    });

    onSave(form, fd);
  };

  return (
    <div className="p-4">
      <div className="position-relative mb-3">
        <img src={mainImagePreview || form.image} className="w-100 rounded" style={{maxHeight: '300px', objectFit: 'cover'}} />
        <label className="btn btn-sm btn-warning position-absolute bottom-0 end-0 m-2">
          <Upload size={20} /> Tải ảnh lên <input type="file" className="d-none" onChange={e => handleMainImageChange(e.target.files[0])} />
        </label>
      </div>

      <input className="form-control mb-3" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
      <textarea className="form-control mb-3" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

      <h5 className="text-warning">Nguyên liệu</h5>
      <textarea className="form-control mb-3" rows={5} value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} />

      <h5 className="text-warning">Hướng dẫn cách làm</h5>
      {form.steps.map((step, sIdx) => (
        <div key={sIdx} className="border p-2 mb-2 rounded">
          <textarea className="form-control mb-2" value={step.text} onChange={e => {
            const newSteps = [...form.steps];
            newSteps[sIdx].text = e.target.value;
            setForm({...form, steps: newSteps});
          }} />
          <div className="d-flex gap-2 mb-2">
             {step.images.map((img, iIdx) => (
               <img key={iIdx} src={img.preview || img.image} width="80" height="80" className="object-fit-cover rounded" />
             ))}
             <label className="btn btn-sm btn-warning d-flex align-items-center">
               <Upload size={14} /> <input type="file" className="d-none" onChange={e => addStepImage(sIdx, e.target.files[0])} />
             </label>
          </div>
        </div>
      ))}

      <div className="d-flex gap-2 justify-content-end mt-4 border-top pt-3">
        <button className="btn btn-secondary" onClick={onCancel}>Hoàn tác</button>
        <button className="btn btn-success" onClick={handleInternalSave} disabled={saving}>
          {saving ? "Saving..." : <><Save size={20} /> Lưu thay đổi</>}
        </button>
      </div>
    </div>
  );
}