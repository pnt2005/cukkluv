// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          CukkLuv🍲
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
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
  );
}

export default Navbar;
