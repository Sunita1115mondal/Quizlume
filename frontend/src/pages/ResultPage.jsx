
import { useLocation, Link } from 'react-router-dom';

export default function ResultPage() {
  const { state } = useLocation();
  const result = state?.result;
  const quiz = state?.quiz;

  if (!result) {
    return (
      <div className="result-empty">
        <h2>No result available</h2>
        <p>Please attempt a quiz first.</p>
        <Link to="/dashboard" className="result-button">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const total = Number(result.total) || 0;
  const score = Number(result.score) || 0;
  const percent = total > 0
    ? Math.round((score / total) * 100)
    : 0;

  const message =
    percent >= 80 ? 'Excellent Work!' :
    percent >= 60 ? 'Good Job!' :
    percent >= 40 ? 'Keep Practising!' :
    'Every Attempt Makes You Better!';

  return (
    <main className="result-page">
      <section className="result-card">
        <div className="result-icon">🏆</div>

        <span className="result-label">QUIZ COMPLETED</span>

        <h1>{message}</h1>

        <p className="result-subtitle">
          {quiz?.title || 'Your Quiz Results'}
        </p>

        <div
          className="result-circle"
          style={{
            background: `conic-gradient(#7565dc ${percent * 3.6}deg, #eceaf5 0deg)`
          }}
        >
          <div className="result-circle-inner">
            <strong>{percent}%</strong>
            <span>Your Score</span>
          </div>
        </div>

        <div className="result-stats">
          <div className="result-stat">
            <strong>{score}</strong>
            <span>Correct Score</span>
          </div>

          <div className="result-stat">
            <strong>{total}</strong>
            <span>Total Marks</span>
          </div>

          <div className="result-stat">
            <strong>{Math.max(0, total - score)}</strong>
            <span>Marks Lost</span>
          </div>
        </div>

        <p className="result-message">
          {percent >= 80
            ? 'You did an amazing job. Keep up the great work!'
            : 'Keep learning and practising. You can improve your score next time!'}
        </p>

        <Link to="/dashboard" className="result-button">
          Back to Dashboard →
        </Link>
      </section>
    </main>
  );
}
