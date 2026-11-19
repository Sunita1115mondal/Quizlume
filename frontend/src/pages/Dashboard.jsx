
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Link } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/quizzes')
      .then(({ data }) => {
        if (active) {
          setQuizzes(Array.isArray(data) ? data : []);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('Unable to load quizzes. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalQuestions = quizzes.reduce(
    (total, quiz) => total + (quiz.questions?.length || 0),
    0
  );

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <main className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Your Dashboard</h1>
          <p>Welcome back, {firstName}! Ready to learn something new?</p>
        </div>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link to="/teacher" className="dashboard-create-btn">
            <span>＋</span> Create Quiz
          </Link>
        )}
      </div>

      <section className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-tag">YOUR LEARNING SPACE</span>
          <h2>Learn. Practice. Achieve.</h2>
          <p>
            Challenge yourself with interactive quizzes and keep
            building your knowledge, one question at a time.
          </p>
          <a href="#available-quizzes" className="welcome-btn">
            Explore quizzes <span>→</span>
          </a>
        </div>

        <div className="welcome-decoration" aria-hidden="true">
          <div className="decoration-circle circle-one"></div>
          <div className="decoration-circle circle-two"></div>
          <div className="decoration-book">✦</div>
          <div className="decoration-small">✧</div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon stat-purple">▤</div>
          <div>
            <p>Available Quizzes</p>
            <h3>{loading ? '—' : quizzes.length}</h3>
            <span>Ready to explore</span>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon stat-blue">☷</div>
          <div>
            <p>Total Questions</p>
            <h3>{loading ? '—' : totalQuestions}</h3>
            <span>Across all quizzes</span>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon stat-green">♙</div>
          <div>
            <p>Your Account</p>
            <h3 className="role-value">
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : 'Student'}
            </h3>
            <span>Account type</span>
          </div>
        </article>
      </section>

      <section className="quiz-section" id="available-quizzes">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KEEP LEARNING</span>
            <h2>Explore Quizzes</h2>
            <p>Choose a quiz and test your knowledge.</p>
          </div>
          <span className="quiz-count">
            {loading ? 'Loading...' : `${quizzes.length} available`}
          </span>
        </div>

        {loading && (
          <div className="dashboard-message">
            <div className="loading-spinner"></div>
            <p>Loading your quizzes...</p>
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-message error-message">
            {error}
          </div>
        )}

        {!loading && !error && quizzes.length > 0 && (
          <div className="quiz-grid">
            {quizzes.map((quiz, index) => (
              <article className="quiz-card" key={quiz._id || quiz.id}>
                <div className={`quiz-card-icon quiz-icon-${index % 3}`}>
                  {['✦', '▤', '◇'][index % 3]}
                </div>

                <div className="quiz-card-content">
                  <span className="quiz-label">INTERACTIVE QUIZ</span>
                  <h3>{quiz.title}</h3>
                  <p>
                    {quiz.description || 'Test your knowledge with this quiz.'}
                  </p>
                </div>

                <div className="quiz-card-footer">
                  <span className="question-count">
                    <span>☷</span>
                    {quiz.questions?.length || 0} Questions
                  </span>

                  <Link
                    to={`/quiz/${quiz._id || quiz.id}`}
                    className="start-quiz-btn"
                  >
                    Start Quiz <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>No quizzes available yet</h3>
            <p>
              New quizzes will appear here when your teacher publishes them.
            </p>
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        <span>Quizzy</span>
        <span>Learn something new every day.</span>
      </footer>
    </main>
  );
}
