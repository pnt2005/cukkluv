import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  onClear,
  placeholder = "Tìm kiếm...",
  className = ""
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: "" } });
    }
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`d-flex gap-2 ${className}`}>
      <div className="flex-grow-1 position-relative">
        <input
          type="text"
          className="form-control pe-5"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {/* Nút X để clear search */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
            style={{ textDecoration: 'none' }}
          >
            <X size={18} />
          </button>
        )}
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