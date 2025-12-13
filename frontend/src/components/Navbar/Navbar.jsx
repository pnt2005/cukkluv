import { Link } from "react-router-dom";
import CreateSelectModal from "./CreateSelectModal.jsx";
import CreatePostModal from "./CreatePostModal.jsx";
import { useEffect, useState } from "react";
import { authAPI } from "../../utils/api.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        setUser(data);
      } catch (err) {
        setUser(null); // chưa login
      }
    };
    fetchUser();
  }, []);


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

              {/* LOGIN / AVATAR */}
              <li className="nav-item">
                {user ? (
                  <Link to="/profile" className="nav-link p-0">
                    <img
                      src={`${API_BASE_URL}${user.avatar}`}
                      alt="avatar"
                      className="rounded-circle"
                      style={{
                        width: 36,
                        height: 36,
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                ) : (
                  <Link className="nav-link text-warning" to="/login">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <CreateSelectModal />
      <CreatePostModal />
    </>
  );
}

export default Navbar;
