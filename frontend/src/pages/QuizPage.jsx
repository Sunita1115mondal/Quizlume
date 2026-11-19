
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    api.get(`/quizzes/${id}`)
      .then(({ data }) => {
        setQuiz(data);
        setAnswers(Array(data.questions.length).fill(null));
      })
      .catch(() => setError('Unable to load this quiz. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  const selectAnswer = (qi, oi) => {
    const copy = [...answers];
    copy[qi] = oi;
    setAnswers(copy);
  };

  const submit = async () => {
    setError('');

    if (answers.some((a) => a === null)) {
      setError('Please answer all questions before submitting.');
      return;
    }

    try {
      const { data } = await api.post(`/results/submit/${id}`, { answers });
      navigate('/result', { state: { result: data, quiz } });
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) {
    return <div className="quiz-loading">Loading your quiz...</div>;
  }

  if (!quiz) {
    return <div className="quiz-error">Unable to load the quiz.</div>;
  }

  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <span className="quiz-label">QUIZZY • KNOWLEDGE CHECK</span>
        <h1>{quiz.title}</h1>
        <p>{quiz.description}</p>

        <div className="quiz-progress-info">
          <span>{answeredCount} of {quiz.questions.length} answered</span>
          <span>{Math.round((answeredCount / quiz.questions.length) * 100)}% completed</span>
        </div>

        <div className="quiz-progress-track">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${(answeredCount / quiz.questions.length) * 100}%`
            }}
          />
        </div>
      </header>

      <section className="quiz-questions">
        {quiz.questions.map((q, qi) => (
          <article className="quiz-question-card" key={qi}>
            <div className="question-heading">
              <span className="question-number">
                QUESTION {String(qi + 1).padStart(2, '0')}
              </span>
              <span className="question-count">
                {qi + 1} / {quiz.questions.length}
              </span>
            </div>

            <h2>{q.text}</h2>

            <div className="quiz-options">
              {q.options.map((opt, oi) => (
                <button
                  type="button"
                  key={oi}
                  className={`quiz-option ${
                    answers[qi] === oi ? 'selected' : ''
                  }`}
                  onClick={() => selectAnswer(qi, oi)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <span className="option-text">{opt}</span>
                  <span className="option-check">
                    {answers[qi] === oi ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      {error && <div className="quiz-error">{error}</div>}

      <footer className="quiz-footer">
        <span>{answeredCount} / {quiz.questions.length} questions completed</span>
        <button
          type="button"
          className="quiz-submit-button"
          onClick={submit}
        >
          Submit Quiz →
        </button>
      </footer>
    </main>
  );
}
