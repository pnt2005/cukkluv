import { Link } from "react-router-dom";
import CreateSelectModal from "./CreateSelectModal.jsx";
import CreatePostModal from "./CreatePostModal.jsx";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-warning" to="/">
            CukkLuv🍲
          </Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className="nav-link text-warning"
                  data-bs-toggle="modal"
                  data-bs-target="#createSelectModal"
                >
                  Create
                </button>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/recipes">
                  Recipes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/posts">
                  Posts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal chọn loại create */}
      <CreateSelectModal />

      {/* Modal tạo post */}
      <CreatePostModal />
    </>
  );
}

export default Navbar;
