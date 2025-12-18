import React, { useState } from "react";
import { Search } from "lucide-react"; // Không cần X nữa nếu không có nút clear

export default function SearchBar({
  onSearch,
  placeholder = "Bạn muốn nấu gì hôm nay ?", 
  className = "",
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`d-flex align-items-stretch bg-white`} 
      style={{ 
        maxWidth: "800px", 
        margin: "0 auto", 
        borderRadius: "40px",
        border: "2px solid #f8eda6ff", 
        overflow: "hidden", 
        height: "56px", 
        padding: 0, 
      }}
    >
      
      <div 
        className="flex-grow-1 d-flex align-items-center"
        style={{
          padding: "0 10px", 
        }}
      >

        <Search 
          size={24} 
          className="text-muted" 
          style={{ 
            marginLeft: "10px", 
            minWidth: "24px", 
          }} 
        />
        <input
          type="text"
          className="border-0 w-100 h-100" 
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            padding: "0 15px",
            fontSize: "1.1rem", 
            outline: "none",
            boxShadow: "none",
            color: "#333", 
          }}
        />
      </div>
      
      <button
        type="submit"
        className="btn btn-warning d-flex align-items-center justify-content-center"
        style={{
          color: "white",
          borderRadius: "40px 40px 40px 40px", 
          border: "none",
          minWidth: "120px", 
          height: "100%",
          fontSize: "1.1rem",
          fontWeight: "bold",
          padding: "0 25px",
        }}
      >
        Tìm kiếm
      </button>
    </form>
  );
}