
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="app-navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">Q</span>
          <span>Quizzy<span className="brand-dot">.</span></span>
        </Link>

        <div className="navbar-right">
          {user?.role === 'teacher' || user?.role === 'admin' ? (
            <>
              <Link to="/teacher" className="nav-link">
                Create Quiz
              </Link>
              <Link to="/teacher/dashboard" className="nav-link">
                Teacher Dashboard
              </Link>
            </>
          ) : null}

          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-link">
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <>
              <div className="user-profile">
                <div className="user-avatar">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
              </div>

              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="navbar-signup">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
