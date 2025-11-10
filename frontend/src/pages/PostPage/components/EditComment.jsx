import { useState, useRef, useEffect } from "react";

export default function EditCommentForm({ initialValue, onSave, onCancel }) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef();

  useEffect(() => {
    setTimeout(() => ref.current?.focus?.(), 0);
  }, []);

  return (
    <div className="d-flex gap-2 align-items-center">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSave(value.trim())}
        className="form-control form-control-sm"
        placeholder="Edit your comment..."
        style={{ maxWidth: "300px" }}
      />
      <button
        className="btn btn-sm btn-success"
        onClick={() => onSave(value.trim())}
      >
        Save
      </button>
      <button className="btn btn-sm btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
