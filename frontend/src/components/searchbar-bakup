import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  onSearch,
  onClear,
  placeholder = "Tìm kiếm...",
  className = "",
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    if (onClear) onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`d-flex gap-2 ${className}`}>
      <div className="flex-grow-1 position-relative">
        <input
          type="text"
          className="form-control pe-5"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-link position-absolute top-50 translate-middle-y text-muted"
          style={{ textDecoration: "none", zIndex: 10, padding: 0, right: "8px" }}
        >
          <X size={18} />
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-warning text-white d-flex align-items-center gap-2"
      >
        <Search size={18} />
        Tìm kiếm
      </button>
    </form>
  );
}
