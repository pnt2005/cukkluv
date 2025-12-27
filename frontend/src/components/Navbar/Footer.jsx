import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
  return (
    <footer
      className="px-4 pt-5 pb-4 mt-0"
      style={{
        backgroundColor: "#FFF3CD", 
        borderRadius: "28px 28px 0 0",
      }}
    >
      <div className="container-fluid px-5">
        <div className="row gy-4 text-muted small justify-content-center">
          {/* Cột 1 */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold text-uppercase mb-3 text-dark">
              Công thức
            </h6>
            <ul className="list-unstyled">
              <li>Công thức của cộng đồng</li>
              <li>Công thức của CukkLuv</li>
              <li>Công thức của bạn</li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold text-uppercase mb-3 text-dark">
              Khám phá
            </h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/recipes" className="text-muted text-decoration-none">
                  Tất cả công thức
                </Link>
              </li>
              <li>Bí quyết nhà bếp</li>
              <li>Nguyên liệu phổ biến</li>
              <li>Bài viết mới</li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold text-uppercase mb-3 text-dark">
              Thông tin
            </h6>
            <ul className="list-unstyled">
              <li>Giới thiệu</li>
              <li>Liên hệ</li>
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-uppercase mb-3 text-dark">
              Kết nối
            </h6>
            <div className="d-flex gap-3 fs-5 text-dark">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="text-center mt-4">
          <h4 className="fw-bold mb-1">CukkLuv</h4>
          <p className="small text-muted mt-1">
            © {new Date().getFullYear()} CukkLuv. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
