  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { showError, showSuccess } from '../../utils/toast';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  import { authAPI } from '../../utils/api';
  import bc from './bc.jpg';
  import { Link } from "react-router-dom";

  const PRIMARY_COLOR = "#ffc107";

  function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (form.password !== form.confirmPassword) {
        showError('Mật khẩu xác nhận không khớp!');
        return;
      }

      try {
        const data = await authAPI.register(form);
        showSuccess("Đăng ký thành công!");
        navigate('/login');
      } catch (err) {
        showError("Đăng ký thất bại");
      }
    };

  return (
    <div className="py-5 container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="row bg-white shadow-lg" style={{ 
        width: '90%', 
        maxWidth: '1200px',
        borderRadius: '12px',
        overflow: 'hidden'
        }}>

        <div className="col-md-6 d-flex align-items-center justify-content-center p-5">   
          <div style={{ width: '100%', maxWidth: '550px' }}>
              <h1 className="fw-bold mb-1">Tạo Tài Khoản Mới</h1>
              <p className="text-secondary mb-4">
                Bắt đầu hành trình ẩm thực của bạn ngay hôm nay!
              </p>

              {/* Form Đăng ký */}
              <form onSubmit={handleSubmit}>
                
                {/* Tên đăng nhập */}
                <div className="mb-3">
                  <label htmlFor="usernameInput" className="form-label fw-semibold">
                    Tên đăng nhập <span style={{ color: PRIMARY_COLOR }}>*</span>
                  </label>
                  <input
                    id="usernameInput"
                    type="text"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    placeholder='Nhập tên đăng nhập'
                    style={{ padding: "12px 10px", borderColor: PRIMARY_COLOR, borderWidth: "2px" }}
                    required
                  />
                </div>
                
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label fw-semibold">
                    Email <span style={{ color: PRIMARY_COLOR }}>*</span>
                  </label>
                  <input
                    id="emailInput"
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    placeholder='Nhập email của bạn'
                    style={{ padding: "12px 10px", borderColor: PRIMARY_COLOR, borderWidth: "2px" }}
                    required
                  />
                </div>
                
                {/* Mật khẩu */}
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label fw-semibold">
                    Mật khẩu <span style={{ color: PRIMARY_COLOR }}>*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="passwordInput"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      placeholder='Nhập mật khẩu'
                      style={{ padding: "12px 10px", borderColor: PRIMARY_COLOR, borderWidth: "2px", borderRight: 'none' }}
                      required
                    />
                     <button
                        className="btn border bg-white"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderColor: PRIMARY_COLOR, borderWidth: "2px", borderLeftWidth: "0" }}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "#adb5bd" }}></i>
                      </button>
                  </div>
                </div>

                {/* Xác nhận Mật khẩu */}
                <div className="mb-4">
                  <label htmlFor="confirmPasswordInput" className="form-label fw-semibold">
                    Xác nhận Mật khẩu <span style={{ color: PRIMARY_COLOR }}>*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="confirmPasswordInput"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="form-control"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder='Xác nhận mật khẩu'
                      style={{ padding: "12px 10px", borderColor: PRIMARY_COLOR, borderWidth: "2px", borderRight: 'none' }}
                      required
                    />
                     <button
                        className="btn border bg-white"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} // Sử dụng chung nút show/hide
                        style={{ borderColor: PRIMARY_COLOR, borderWidth: "2px", borderLeftWidth: "0" }}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "#adb5bd" }}></i>
                      </button>
                  </div>
                </div>
                
                {/* Nút Đăng ký */}
                <button
                  type="submit"
                  className="btn w-100 fw-bold btn-warning"
                  style={{ padding: "12px", fontSize: "1.1rem", borderRadius: "8px", color: "#000" }}
                >
                  Đăng ký
                </button>
              </form>

              {/* Tùy chọn đăng ký bằng Social */}
              <div className="text-center my-4 text-secondary">
                Hoặc đăng ký bằng:
              </div>
              <div className="d-flex justify-content-between mb-4">
                <button className="btn border flex-grow-1 me-2 py-2 bg-white" style={{ borderRadius: "8px" }}>
                  <i className="bi bi-google" style={{ fontSize: "1.2rem", color: "#db4437" }}></i>
                </button>
                <button className="btn border flex-grow-1 mx-2 py-2 bg-white" style={{ borderRadius: "8px" }}>
                  <i className="bi bi-facebook" style={{ fontSize: "1.2rem", color: "#4267B2" }}></i>
                </button>
                <button className="btn border flex-grow-1 ms-2 py-2 bg-white" style={{ borderRadius: "8px" }}>
                  <i className="bi bi-apple" style={{ fontSize: "1.2rem", color: "#000" }}></i>
                </button>
              </div>
              
              {/* Đã có tài khoản? */}
              <p className="text-center small text-secondary">
                Bạn đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  Đăng nhập ngay
                </Link>
              </p>
          </div>
        </div>
          
        <div className="col-md-6 d-none d-md-flex p-0 align-items-center justify-content-center">
          <img 
            src={bc} 
            alt="Background" 
            className="img-fluid" 
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>   
      </div>
    </div>
  );
}

export default RegisterPage;