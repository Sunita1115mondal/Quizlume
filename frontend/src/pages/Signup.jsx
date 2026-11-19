
import { useState } from 'react';
import { api } from '../services/api.js';
import { saveAuth } from '../services/auth.js';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup({ onAuth }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role
    };

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.password) {
      setError('All fields are required.');
      return;
    }

    if (trimmedForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post('/auth/register', trimmedForm);

      saveAuth(data);
      onAuth?.();
      navigate('/dashboard');

    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError(
          err?.response?.data?.message || 'Account creation failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">

        <div className="auth-brand">
          <div className="auth-logo">Q</div>
          <span>Quizzy</span>
        </div>

        <div className="auth-heading">
          <h1>Create your account</h1>
          <p>Join Quizzy and make learning more interactive.</p>
        </div>

        <form onSubmit={submit} className="auth-form">

          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              className="input"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>

            <div className="password-wrapper">
              <input
                id="signup-password"
                className="input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-role">Account type</label>
            <select
              id="signup-role"
              className="input"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

        </form>

        <div className="auth-divider">
          <span>Already a member?</span>
        </div>

        <p className="auth-footer">
          Have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>

      </div>
    </div>
  );
}
