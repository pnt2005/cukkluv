## ⚙️ Hướng dẫn cài đặt  


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

