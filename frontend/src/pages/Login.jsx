
import { useState } from 'react';
import { api } from '../services/api.js';
import { saveAuth } from '../services/auth.js';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = form.email.trim();

    if (!trimmedEmail || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post('/auth/login', {
        email: trimmedEmail,
        password: form.password
      });

      saveAuth(data);
      onAuth?.();
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to the server. Please check if the backend is running.');
      } else {
        setError(err.response.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-icon">Q</div>

        <span className="auth-eyebrow">WELCOME BACK</span>

        <h1>Login to Quizzy</h1>

        <p className="auth-subtitle">
          Continue your learning journey and challenge yourself.
        </p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>

            <div className="auth-password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="auth-show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Account →'}
          </button>
        </form>

        <div className="auth-divider">
          <span>NEW TO QUIZZY?</span>
        </div>

        <p className="auth-signup-text">
          Don't have an account?{' '}
          <Link to="/signup">Create an account</Link>
        </p>

        <div className="auth-footer">
          ✨ Learn something new, one quiz at a time.
        </div>
      </section>
    </main>
  );
}
