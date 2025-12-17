import { useState } from "react";
import { showSuccess, showError, showWarning } from "../../utils/toast";
import { Link } from "react-router-dom";
import { authAPI } from "../../utils/api";
import banhmi from "./banhmi.png";

const PRIMARY_COLOR = "#ffc107";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showWarning("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const data = await authAPI.login(username, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        showSuccess("Đăng nhập thành công!");
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        showError("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      console.error(err);
      showError("Đăng nhập thất bại! Vui lòng thử lại.");
    }
  };

  return (
    <div className="container-fluid px-5 mt-5">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-6 d-none d-lg-block">
          <img
            src={banhmi}
            alt="banhmi"
            className="img-fluid"
            style={{ maxHeight: "70vh", width: "100%", objectFit: "contain" }}
          />
          {/*  */}
        </div>

        {/* Cột Phải: Form Đăng nhập*/}
        <div className="col-lg-6 d-flex justify-content-center">
          <div
            className="card p-5 border-0 shadow"
            style={{
              width: "600px",
              borderRadius: "12px",
              height: "fit-content",
            }}
          >
            <h1 className="fw-bold mb-2">Đăng nhập</h1>
            <p className="text-secondary mb-3">
              Bạn chưa có tài khoản ?{" "}
              <Link
                to="/register"
                className="text-decoration-none fw-semibold text-warning"
              >
                Đăng ký ngay{" "}
              </Link>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="userInput"
                  className="form-label fw-semibold"
                  style={{ color: "#000" }}
                >
                  Tên đăng nhập <span style={{ color: PRIMARY_COLOR }}>*</span>
                </label>
                <input
                  id="userInput"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập username của bạn"
                  style={{
                    padding: "12px 10px",
                    borderColor: PRIMARY_COLOR,
                    borderWidth: "2px",
                  }}
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="passwordInput"
                  className="form-label fw-semibold"
                  style={{ color: "#000" }}
                >
                  Mật khẩu <span style={{ color: PRIMARY_COLOR }}>*</span>
                </label>
                <div className="input-group">
                  <input
                    id="passwordInput"
                    type={showPassword ? "text" : "password"}
                    className="form-control border-end-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    style={{ padding: "12px 10px", borderWidth: "2px" }}
                    required
                  />

                  <button
                    className="btn border border-start-0 bg-white"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderColor: "#ced4da" }}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                      style={{ color: "#adb5bd" }}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMeSwitch"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      backgroundColor: rememberMe ? PRIMARY_COLOR : "#e9ecef",
                      borderColor: rememberMe ? PRIMARY_COLOR : "#ced4da",
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="rememberMeSwitch"
                  >
                    Ghi nhớ tài khoản
                  </label>
                </div>

                <a
                  href="#"
                  className="text-decoration-none"
                  style={{ color: "#333" }}
                >
                  Quên mật khẩu?
                </a>
              </div>
              <button
                type="submit"
                className="btn w-100 fw-bold btn-warning"
                style={{
                  padding: "12px",
                  fontSize: "1.1rem",
                  borderRadius: "8px",
                  color: "#000",
                }}
              >
                Đăng nhập
              </button>
            </form>

            <div className="text-center my-3 text-secondary">
              Hoặc tiếp tục với:
            </div>
            <div className="d-flex justify-content-between mb-3">
              <button
                className="btn border flex-grow-1 me-2 py-2 bg-white"
                style={{ borderColor: "#ced4da", borderRadius: "8px" }}
              >
                <i
                  className="bi bi-google"
                  style={{ fontSize: "1.2rem", color: "#db4437" }}
                ></i>
              </button>

              <button
                className="btn border flex-grow-1 mx-2 py-2 bg-white"
                style={{ borderColor: "#ced4da", borderRadius: "8px" }}
              >
                <i
                  className="bi bi-facebook"
                  style={{ fontSize: "1.2rem", color: "#4267B2" }}
                ></i>
              </button>

              <button
                className="btn border flex-grow-1 ms-2 py-2 bg-white"
                style={{ borderColor: "#ced4da", borderRadius: "8px" }}
              >
                <i
                  className="bi bi-apple"
                  style={{ fontSize: "1.2rem", color: "#000" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
