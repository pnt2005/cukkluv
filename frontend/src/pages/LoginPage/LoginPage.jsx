import { useState } from 'react';
import { showSuccess, showError, showWarning } from '../../utils/toast';
import { Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      showWarning('Please fill in all fields!');
      return;
    }

    fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          showSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          showError('Username or password is incorrect!');
        }
      })
      .catch(() => {
        showError('An error occurred. Please try again later.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card p-4 shadow" style={{ width: '400px' }}>        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Login
          </button>

          <p className="text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-warning fw-bold text-decoration-none">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
