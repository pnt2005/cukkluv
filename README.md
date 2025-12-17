# 🍳 Cukkluv  
**Mạng xã hội dành riêng cho người yêu nấu ăn**

---

## 📖 Giới thiệu  

**Cukkluv** là một nền tảng mạng xã hội được xây dựng dành riêng cho những người yêu thích nấu ăn và ẩm thực.  
Hệ thống cho phép người dùng chia sẻ công thức nấu ăn, hình ảnh, đồng thời tương tác và kết nối với những người có chung niềm đam mê.

Người dùng có thể:
- Đăng tải và chia sẻ **công thức nấu ăn** kèm **hình ảnh minh họa**
- Khám phá bài đăng, **tương tác** thông qua lượt thích, bình luận
- **Lưu lại công thức yêu thích** để tham khảo sau
- Tham gia xây dựng **cộng đồng ẩm thực**

Hệ thống được phát triển theo mô hình **Frontend – Backend tách rời**.

---

## 🎯 Mục tiêu hệ thống
- Xây dựng nền tảng chia sẻ công thức nấu ăn thân thiện
- Kết nối cộng đồng người yêu ẩm thực
- Áp dụng Django REST Framework và React vào hệ thống thực tế

---

## 🛠️ Công nghệ sử dụng  

### Backend
- Python 3.10+
- Django
- Django REST Framework
- PostgreSQL
- Django CORS Headers

### Frontend
- Node.js 18+
- React
- Vite
- Bootstrap

---

## ⚙️ Hướng dẫn cài đặt  

### 1️⃣ Clone project
```bash
git clone https://github.com/your-username/cukkluv.git
cd cukkluv
```

---

## 🔙 Backend – Django REST Framework  

### Tạo môi trường ảo
```bash
cd backend
python -m venv venv
```

Kích hoạt:

**Windows**
```bash
venv\Scripts\activate
```

**Linux / macOS**
```bash
source venv/bin/activate
```

### Cài đặt thư viện
```bash
pip install -r requirements.txt
```

### Migrate database
```bash
python manage.py makemigrations
python manage.py migrate
```

### Chạy backend
```bash
python manage.py runserver
```

Backend chạy tại:  
http://127.0.0.1:8000/

---

## 🔜 Frontend – React  

### Cài đặt thư viện
```bash
cd frontend
npm install
```

### Cấu hình API
Tạo file `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Chạy frontend
```bash
npm run dev
```

Frontend chạy tại:  
http://localhost:5173/
