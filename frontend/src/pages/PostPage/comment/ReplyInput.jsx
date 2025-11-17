import { useState, useRef, useEffect } from "react";

export default function ReplyInput({ onSend, onCancel }) {
  const [value, setValue] = useState("");
  const ref = useRef();

  useEffect(() => {
    setTimeout(() => ref.current?.focus?.(), 0);
  }, []);

  return (
    <div className="d-flex gap-2 mb-2">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend(value.trim())}
        className="form-control form-control-sm"
        placeholder="Write a reply..."
      />
      <button className="btn btn-sm btn-primary" onClick={() => onSend(value.trim())}>
        Send
      </button>
      <button className="btn btn-sm btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}