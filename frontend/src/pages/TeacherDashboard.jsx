
import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export default function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);

  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [error, setError] = useState('');

  const [quizSearch, setQuizSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    loadQuizzes();
    loadStats();
  }, []);

  const loadQuizzes = async () => {
    setLoadingQuizzes(true);
    setError('');

    try {
      const { data } = await api.get('/teacher/quizzes');
      setQuizzes(data.quizzes || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load quizzes.');
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await api.get('/teacher/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadQuizAttempts = async (quizId) => {
    setLoadingAttempts(true);
    setError('');

    try {
      const { data } = await api.get(`/teacher/quiz/${quizId}/attempts`);
      setAttempts(data.attempts || []);
      setSelectedQuiz(data.quiz);
      setStudentSearch('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load quiz attempts.');
      setSelectedQuiz(null);
      setAttempts([]);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const clearSelection = () => {
    setSelectedQuiz(null);
    setAttempts([]);
    setStudentSearch('');
    setError('');
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    (quiz.title || '').toLowerCase().includes(quizSearch.toLowerCase())
  );

  const filteredAttempts = attempts.filter((attempt) =>
    (attempt.studentName || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (attempt.studentEmail || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  const statCards = [
    {
      label: 'Total Quizzes',
      value: stats?.totalQuizzes ?? quizzes.length,
      detail: `${stats?.recentQuizzes ?? 0} created in the last 7 days`,
      icon: '📝',
      color: 'purple'
    },
    {
      label: 'Total Attempts',
      value: stats?.totalAttempts ?? 0,
      detail: `${stats?.recentAttempts ?? 0} in the last 7 days`,
      icon: '👥',
      color: 'blue'
    },
    {
      label: 'Average Score',
      value: stats ? `${stats.averageScore ?? 0}%` : '—',
      detail: 'Across student attempts',
      icon: '📊',
      color: 'green'
    },
    {
      label: 'Active Quizzes',
      value: quizzes.length,
      detail: 'Your available quizzes',
      icon: '⚡',
      color: 'orange'
    }
  ];

  return (
    <div className="teacher-dashboard">

      {/* Page heading */}
      <header className="teacher-header">
        <div>
          <span className="teacher-eyebrow">TEACHER WORKSPACE</span>
          <h1>Teacher Dashboard</h1>
          <p>Manage your quizzes and track student performance.</p>
        </div>

        <button
          className="teacher-refresh"
          onClick={() => {
            loadQuizzes();
            loadStats();
          }}
          disabled={loadingQuizzes}
        >
          ↻ {loadingQuizzes ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      {/* Statistics */}
      <section className="teacher-stats">
        {statCards.map((stat) => (
          <div className="teacher-stat-card" key={stat.label}>
            <div className={`teacher-stat-icon ${stat.color}`}>
              {stat.icon}
            </div>

            <div>
              <p className="teacher-stat-label">{stat.label}</p>
              <h2>{stat.value}</h2>
              <span>{stat.detail}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Error message */}
      {error && (
        <div className="teacher-error" role="alert">
          <span>!</span>
          {error}
        </div>
      )}

      {/* Main dashboard */}
      <section className="teacher-content-grid">

        {/* My quizzes */}
        <div className="teacher-panel">
          <div className="teacher-panel-header">
            <div>
              <h2>My Quizzes</h2>
              <p>Choose a quiz to view student performance.</p>
            </div>

            <span className="teacher-count">
              {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
            </span>
          </div>

          <div className="teacher-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search your quizzes..."
              value={quizSearch}
              onChange={(e) => setQuizSearch(e.target.value)}
              aria-label="Search quizzes"
            />
          </div>

          {loadingQuizzes ? (
            <div className="teacher-empty">
              <div className="teacher-loader"></div>
              <p>Loading your quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="teacher-empty">
              <div className="teacher-empty-icon">📝</div>
              <h3>
                {quizzes.length === 0
                  ? 'No quizzes yet'
                  : 'No matching quizzes'}
              </h3>
              <p>
                {quizzes.length === 0
                  ? 'Your created quizzes will appear here.'
                  : 'Try searching with another quiz title.'}
              </p>
            </div>
          ) : (
            <div className="teacher-quiz-list">
              {filteredQuizzes.map((quiz) => {
                const quizId = quiz.id || quiz._id;
                const isSelected =
                  String(selectedQuiz?.id || selectedQuiz?._id) === String(quizId);

                return (
                  <button
                    type="button"
                    key={quizId}
                    onClick={() => loadQuizAttempts(quizId)}
                    className={`teacher-quiz-item ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="teacher-quiz-top">
                      <div className="teacher-quiz-icon">📚</div>
                      <span className={isSelected ? 'selected-label' : 'quiz-arrow'}>
                        {isSelected ? 'Selected ✓' : 'View →'}
                      </span>
                    </div>

                    <h3>{quiz.title}</h3>
                    <p className="teacher-quiz-description">
                      {quiz.description || 'No description provided.'}
                    </p>

                    <div className="teacher-quiz-meta">
                      <span>❓ {quiz.questionCount ?? 0} Questions</span>
                      <span>👥 {quiz.attemptCount ?? 0} Attempts</span>
                    </div>

                    <div className="teacher-quiz-date">
                      Created: {quiz.createdAt
                        ? new Date(quiz.createdAt).toLocaleDateString()
                        : 'Date unavailable'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Student attempts */}
        <div className="teacher-panel">
          <div className="teacher-panel-header">
            <div>
              <h2>Student Performance</h2>
              <p>
                {selectedQuiz
                  ? `Results for ${selectedQuiz.title}`
                  : 'View attempts and scores for your quizzes.'}
              </p>
            </div>

            {selectedQuiz && (
              <button
                className="teacher-clear"
                onClick={clearSelection}
              >
                Clear
              </button>
            )}
          </div>

          {!selectedQuiz && !loadingAttempts && (
            <div className="teacher-empty teacher-select-empty">
              <div className="teacher-empty-icon">📈</div>
              <h3>Select a quiz</h3>
              <p>Choose a quiz from the left panel to see its student attempts.</p>
            </div>
          )}

          {loadingAttempts && (
            <div className="teacher-empty">
              <div className="teacher-loader"></div>
              <p>Loading student attempts...</p>
            </div>
          )}

          {selectedQuiz && !loadingAttempts && (
            <>
              <div className="teacher-attempt-summary">
                <div>
                  <span>Total attempts</span>
                  <strong>{attempts.length}</strong>
                </div>
                <div>
                  <span>Showing</span>
                  <strong>{filteredAttempts.length}</strong>
                </div>
              </div>

              <div className="teacher-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  aria-label="Search student attempts"
                />
              </div>

              {filteredAttempts.length === 0 ? (
                <div className="teacher-empty">
                  <div className="teacher-empty-icon">👨‍🎓</div>
                  <h3>
                    {attempts.length === 0
                      ? 'No attempts yet'
                      : 'No matching students'}
                  </h3>
                  <p>
                    {attempts.length === 0
                      ? 'Student submissions will appear here.'
                      : 'Try another student name or email.'}
                  </p>
                </div>
              ) : (
                <div className="teacher-table-wrapper">
                  <table className="teacher-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Attempt Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAttempts.map((attempt, index) => (
                        <tr key={attempt.id || index}>
                          <td>
                            <div className="teacher-student">
                              <div className="teacher-avatar">
                                {(attempt.studentName || '?').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong>{attempt.studentName || 'Unknown student'}</strong>
                                <span>{attempt.studentEmail || 'No email available'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="teacher-score">
                            {attempt.score} / {attempt.total}
                          </td>

                          <td>
                            <span
                              className={`teacher-percentage ${
                                attempt.percentage >= 70
                                  ? 'high'
                                  : attempt.percentage >= 50
                                  ? 'medium'
                                  : 'low'
                              }`}
                            >
                              {attempt.percentage}%
                            </span>
                          </td>

                          <td className="teacher-date">
                            {attempt.attemptDate
                              ? new Date(attempt.attemptDate).toLocaleDateString()
                              : 'Unavailable'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
