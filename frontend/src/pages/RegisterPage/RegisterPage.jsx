import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/toast';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { authAPI } from '../../utils/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authAPI.register(JSON.stringify(form));
      if (data.ok) {
        showSuccess('Registration successful! Redirecting to login...');
        navigate('/login');
      } else {
        showError('Registration failed');
      }
    } catch (err) {
      showError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              placeholder='username'
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder='email'
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder='password'
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
