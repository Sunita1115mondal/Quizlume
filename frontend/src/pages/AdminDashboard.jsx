
import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

const formatDate = (date) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? '—'
    : parsedDate.toLocaleDateString();
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'quizzes') {
      loadQuizzes();
    } else {
      loadStats();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(
        `/admin/users?search=${encodeURIComponent(searchTerm)}`
      );

      setUsers(data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(
        `/admin/quizzes?search=${encodeURIComponent(searchTerm)}`
      );

      setQuizzes(data.quizzes || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load statistics.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'quizzes') {
      loadQuizzes();
    }
  };

  const handleRefresh = () => {
    setSuccess('');
    setError('');

    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'quizzes') {
      loadQuizzes();
    } else {
      loadStats();
    }
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user? All their results will also be deleted.'
    );

    if (!confirmed) return;

    setBusyAction(`user-${userId}`);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccess('User deleted successfully.');
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete user.');
    } finally {
      setBusyAction('');
    }
  };

  const deleteQuiz = async (quizId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this quiz? All results for this quiz will also be deleted.'
    );

    if (!confirmed) return;

    setBusyAction(`quiz-${quizId}`);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/admin/quizzes/${quizId}`);
      setSuccess('Quiz deleted successfully.');
      await loadQuizzes();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete quiz.');
    } finally {
      setBusyAction('');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setBusyAction(`role-${userId}`);
    setError('');
    setSuccess('');

    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      setSuccess('User role updated successfully.');
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update user role.');
      await loadUsers();
    } finally {
      setBusyAction('');
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'quizzes', label: 'Quizzes', icon: '📝' },
    { id: 'stats', label: 'Statistics', icon: '📊' }
  ];

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.users?.total ?? 0,
      detail: 'Registered accounts',
      icon: '👥',
      color: 'purple'
    },
    {
      label: 'Students',
      value: stats?.users?.students ?? 0,
      detail: 'Student accounts',
      icon: '🎓',
      color: 'blue'
    },
    {
      label: 'Teachers',
      value: stats?.users?.teachers ?? 0,
      detail: 'Teacher accounts',
      icon: '👩‍🏫',
      color: 'green'
    },
    {
      label: 'Total Quizzes',
      value: stats?.quizzes?.total ?? 0,
      detail: `${stats?.quizzes?.recent ?? 0} created in the last 7 days`,
      icon: '📝',
      color: 'orange'
    },
    {
      label: 'Quiz Results',
      value: stats?.results?.total ?? 0,
      detail: `${stats?.results?.recent ?? 0} in the last 7 days`,
      icon: '📈',
      color: 'pink'
    },
    {
      label: 'Administrators',
      value: stats?.users?.admins ?? 0,
      detail: `${stats?.users?.recent ?? 0} new users in the last 7 days`,
      icon: '🛡️',
      color: 'indigo'
    }
  ];

  return (
    <div className="admin-page">

      {/* Header */}
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">QUIZZY CONTROL CENTER</span>
          <h1>Admin Dashboard</h1>
          <p>Manage users, oversee quizzes and monitor platform activity.</p>
        </div>

        <button
          type="button"
          className="admin-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          ↻ {loading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      {/* Overview cards */}
      <section className="admin-overview">
        <div className="admin-overview-heading">
          <div>
            <h2>Platform Overview</h2>
            <p>Your platform at a glance.</p>
          </div>
        </div>

        <div className="admin-stats-grid">
          {statCards.map((stat) => (
            <div className="admin-stat-card" key={stat.label}>
              <div className={`admin-stat-icon ${stat.color}`}>
                {stat.icon}
              </div>

              <div className="admin-stat-content">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs and content */}
      <section className="admin-main-panel">

        <div className="admin-panel-heading">
          <div>
            <h2>Platform Management</h2>
            <p>Manage the data and accounts on Quizzy.</p>
          </div>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {tabs.map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError('');
                setSuccess('');
              }}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {error && (
          <div className="admin-message admin-error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="admin-message admin-success" role="status">
            <span>✓</span>
            {success}
          </div>
        )}

        {/* Search */}
        {(activeTab === 'users' || activeTab === 'quizzes') && (
          <form className="admin-search-form" onSubmit={handleSearch}>
            <div className="admin-search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={`Search ${activeTab}`}
              />
            </div>

            <button type="submit" className="admin-search-button" disabled={loading}>
              Search
            </button>
          </form>
        )}

        {/* Loading state */}
        {loading && (
          <div className="admin-loading">
            <div className="admin-loader"></div>
            <p>Loading {activeTab}...</p>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && !loading && (
          <div className="admin-tab-content">
            <div className="admin-content-heading">
              <div>
                <h3>Manage Users</h3>
                <p>View accounts and manage user permissions.</p>
              </div>
              <span className="admin-result-count">
                {users.length} {users.length === 1 ? 'User' : 'Users'}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="admin-empty">
                <div>👥</div>
                <h3>No users found</h3>
                <p>Try another search or refresh the user list.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => {
                      const userId = user._id || user.id;

                      return (
                        <tr key={userId}>
                          <td>
                            <div className="admin-user-cell">
                              <div className="admin-user-avatar">
                                {(user.name || '?').charAt(0).toUpperCase()}
                              </div>
                              <strong>{user.name || 'Unnamed user'}</strong>
                            </div>
                          </td>

                          <td className="admin-email-cell">{user.email}</td>

                          <td>
                            <select
                              className="admin-role-select"
                              value={user.role}
                              disabled={busyAction === `role-${userId}`}
                              onChange={(e) =>
                                updateUserRole(userId, e.target.value)
                              }
                              aria-label={`Change role for ${user.name || 'user'}`}
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          <td className="admin-date-cell">
                            {formatDate(user.createdAt)}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="admin-delete-button"
                              disabled={busyAction === `user-${userId}`}
                              onClick={() => deleteUser(userId)}
                            >
                              {busyAction === `user-${userId}` ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Quizzes tab */}
        {activeTab === 'quizzes' && !loading && (
          <div className="admin-tab-content">
            <div className="admin-content-heading">
              <div>
                <h3>Manage Quizzes</h3>
                <p>Review quizzes published by teachers.</p>
              </div>

              <span className="admin-result-count">
                {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
              </span>
            </div>

            {quizzes.length === 0 ? (
              <div className="admin-empty">
                <div>📝</div>
                <h3>No quizzes found</h3>
                <p>Try another search or refresh the quiz list.</p>
              </div>
            ) : (
              <div className="admin-quiz-list">
                {quizzes.map((quiz) => {
                  const quizId = quiz._id || quiz.id;
                  const creator =
                    typeof quiz.createdBy === 'object'
                      ? quiz.createdBy?.name || quiz.createdBy?.email
                      : null;

                  return (
                    <article className="admin-quiz-card" key={quizId}>
                      <div className="admin-quiz-main">
                        <div className="admin-quiz-icon">📚</div>

                        <div className="admin-quiz-info">
                          <h3>{quiz.title}</h3>
                          <p>
                            {quiz.description || 'No description provided.'}
                          </p>

                          <div className="admin-quiz-meta">
                            <span>❓ {quiz.questions?.length || 0} Questions</span>
                            <span>📅 {formatDate(quiz.createdAt)}</span>
                            {creator && <span>👤 {creator}</span>}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="admin-delete-button"
                        disabled={busyAction === `quiz-${quizId}`}
                        onClick={() => deleteQuiz(quizId)}
                      >
                        {busyAction === `quiz-${quizId}` ? 'Deleting...' : 'Delete Quiz'}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Statistics tab */}
        {activeTab === 'stats' && !loading && stats && (
          <div className="admin-tab-content">
            <div className="admin-content-heading">
              <div>
                <h3>Platform Statistics</h3>
                <p>A detailed summary of Quizzy's activity.</p>
              </div>
            </div>

            <div className="admin-detail-grid">
              <article className="admin-detail-card">
                <div className="admin-detail-icon purple">👥</div>
                <h3>User Statistics</h3>

                <div className="admin-detail-row">
                  <span>Total users</span>
                  <strong>{stats.users?.total ?? 0}</strong>
                </div>
                <div className="admin-detail-row">
                  <span>Students</span>
                  <strong>{stats.users?.students ?? 0}</strong>
                </div>
                <div className="admin-detail-row">
                  <span>Teachers</span>
                  <strong>{stats.users?.teachers ?? 0}</strong>
                </div>
                <div className="admin-detail-row">
                  <span>Administrators</span>
                  <strong>{stats.users?.admins ?? 0}</strong>
                </div>
                <div className="admin-detail-row highlight">
                  <span>New users (7 days)</span>
                  <strong>{stats.users?.recent ?? 0}</strong>
                </div>
              </article>

              <article className="admin-detail-card">
                <div className="admin-detail-icon blue">📝</div>
                <h3>Quiz Statistics</h3>

                <div className="admin-detail-row">
                  <span>Total quizzes</span>
                  <strong>{stats.quizzes?.total ?? 0}</strong>
                </div>
                <div className="admin-detail-row highlight">
                  <span>New quizzes (7 days)</span>
                  <strong>{stats.quizzes?.recent ?? 0}</strong>
                </div>
              </article>

              <article className="admin-detail-card">
                <div className="admin-detail-icon green">📈</div>
                <h3>Result Statistics</h3>

                <div className="admin-detail-row">
                  <span>Total results</span>
                  <strong>{stats.results?.total ?? 0}</strong>
                </div>
                <div className="admin-detail-row highlight">
                  <span>New results (7 days)</span>
                  <strong>{stats.results?.recent ?? 0}</strong>
                </div>
              </article>
            </div>
          </div>
        )}

        {activeTab === 'stats' && !loading && !stats && !error && (
          <div className="admin-empty">
            <div>📊</div>
            <h3>Statistics unavailable</h3>
            <p>Refresh the page to try loading the statistics again.</p>
          </div>
        )}

      </section>
    </div>
  );
}
