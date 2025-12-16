import { Link } from "react-router-dom";
import CreateSelectModal from "./CreateSelectModal.jsx";
import CreatePostModal from "./CreatePostModal.jsx";
import "./Navbar.css";

export default function Navbar() {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark sticky-top"
        style={{
          background: "#ffffffff",
          boxShadow: "none",
        }}
      >
        <div className="container-fluid px-5">
          {/* Logo */}
          <Link className="navbar-brand fw-bold text-warning" to="/">
            🍲 CukkLuv
          </Link>

          {/* Toggle mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div
            className="collapse navbar-collapse"
            id="mainNavbar"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <li className="nav-item">
                <button
                  className="nav-link text-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#createSelectModal"
                >
                  TẠO
                </button>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-warning" to="/recipes">
                  CÔNG THỨC
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-warning" to="/posts">
                  CỘNG ĐỒNG
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="btn btn-warning rounded-pill px-3 ms-lg-2"
                  to="/login"
                >
                  ĐĂNG NHẬP
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <CreateSelectModal />
      <CreatePostModal />
    </>
  );
}
