
import { useState } from 'react';
import { api } from '../services/api.js';

const createEmptyQuestion = () => ({
  text: '',
  options: ['', ''],
  correctAnswer: 0
});

export default function TeacherPanel() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([createEmptyQuestion()]);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions((qs) => [...qs, createEmptyQuestion()]);
    setError('');
    setMsg('');
  };

  const removeQuestion = (idx) => {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
    setError('');
  };

  const setQText = (idx, text) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, text } : q))
    );
  };

  const addOption = (qi) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qi ? { ...q, options: [...q.options, ''] } : q
      )
    );
    setError('');
  };

  const removeOption = (qi, oi) => {
    setQuestions((qs) =>
      qs.map((q, i) => {
        if (i !== qi || q.options.length <= 2) return q;

        let newCorrectAnswer = q.correctAnswer;

        if (q.correctAnswer === oi) {
          newCorrectAnswer = 0;
        } else if (q.correctAnswer > oi) {
          newCorrectAnswer -= 1;
        }

        return {
          ...q,
          options: q.options.filter((_, j) => j !== oi),
          correctAnswer: newCorrectAnswer
        };
      })
    );
    setError('');
  };

  const setOption = (qi, oi, value) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qi
          ? {
              ...q,
              options: q.options.map((option, j) =>
                j === oi ? value : option
              )
            }
          : q
      )
    );
  };

  const setCorrect = (qi, oi) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qi ? { ...q, correctAnswer: oi } : q
      )
    );
    setError('');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setQuestions([createEmptyQuestion()]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Please enter a quiz title.');
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.text.trim()) {
        setError(`Please enter the text for Question ${i + 1}.`);
        return;
      }

      if (q.options.length < 2 || q.options.some((option) => !option.trim())) {
        setError(`Question ${i + 1} must have at least two non-empty options.`);
        return;
      }

      if (
        !Number.isInteger(q.correctAnswer) ||
        q.correctAnswer < 0 ||
        q.correctAnswer >= q.options.length
      ) {
        setError(`Please select a correct answer for Question ${i + 1}.`);
        return;
      }
    }

    const quizData = {
      title: cleanTitle,
      description: description.trim(),
      questions: questions.map((q) => ({
        text: q.text.trim(),
        options: q.options.map((option) => option.trim()),
        correctAnswer: q.correctAnswer
      }))
    };

    try {
      setLoading(true);

      await api.post('/quizzes', quizData);

      setMsg('Your quiz has been created successfully!');
      resetForm();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to create quiz. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-page">

      {/* Header */}
      <header className="create-quiz-header">
        <div>
          <span className="create-quiz-eyebrow">TEACHER WORKSPACE</span>
          <h1>Create a Quiz</h1>
          <p>Build an engaging quiz and test your students' knowledge.</p>
        </div>

        <div className="create-quiz-header-icon">✏️</div>
      </header>

      {/* Progress summary */}
      <div className="create-quiz-summary">
        <div className="create-summary-item">
          <span className="create-summary-icon">📝</span>
          <div>
            <strong>{questions.length}</strong>
            <span>{questions.length === 1 ? 'Question' : 'Questions'}</span>
          </div>
        </div>

        <div className="create-summary-divider"></div>

        <div className="create-summary-item">
          <span className="create-summary-icon">☑️</span>
          <div>
            <strong>
              {questions.reduce((total, q) => total + q.options.length, 0)}
            </strong>
            <span>Answer options</span>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="create-quiz-form">

        {/* Quiz details */}
        <section className="create-quiz-card">
          <div className="create-section-heading">
            <div className="create-section-icon">📋</div>
            <div>
              <h2>Quiz Details</h2>
              <p>Give your quiz a title and a short description.</p>
            </div>
          </div>

          <div className="create-field">
            <label htmlFor="quiz-title">
              Quiz Title <span>*</span>
            </label>
            <input
              id="quiz-title"
              className="create-input"
              type="text"
              placeholder="e.g. General Knowledge Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="create-field">
            <label htmlFor="quiz-description">Description</label>
            <textarea
              id="quiz-description"
              className="create-input create-textarea"
              placeholder="Tell students what this quiz is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </section>

        {/* Questions heading */}
        <div className="create-questions-heading">
          <div>
            <h2>Questions</h2>
            <p>Add questions and mark the correct answer for each one.</p>
          </div>

          <span className="create-question-count">
            {questions.length} added
          </span>
        </div>

        {/* Question cards */}
        {questions.map((q, qi) => (
          <section className="create-question-card" key={qi}>

            <div className="create-question-header">
              <div className="create-question-number">
                {String(qi + 1).padStart(2, '0')}
              </div>

              <div className="create-question-title">
                <h3>Question {qi + 1}</h3>
                <p>{q.options.length} answer options</p>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  className="create-remove-question"
                  onClick={() => removeQuestion(qi)}
                  aria-label={`Remove Question ${qi + 1}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="create-field">
              <label htmlFor={`question-${qi}`}>
                Question text <span>*</span>
              </label>
              <textarea
                id={`question-${qi}`}
                className="create-input create-question-input"
                placeholder="Enter your question here..."
                value={q.text}
                onChange={(e) => setQText(qi, e.target.value)}
                rows={2}
                required
              />
            </div>

            <div className="create-options-heading">
              <div>
                <h4>Answer Options</h4>
                <p>Select the radio button beside the correct answer.</p>
              </div>
              <span>Correct answer</span>
            </div>

            <div className="create-option-list">
              {q.options.map((option, oi) => (
                <div
                  className={`create-option-row ${
                    q.correctAnswer === oi ? 'correct' : ''
                  }`}
                  key={oi}
                >
                  <label
                    className="create-option-radio"
                    htmlFor={`correct-${qi}-${oi}`}
                  >
                    <input
                      id={`correct-${qi}-${oi}`}
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctAnswer === oi}
                      onChange={() => setCorrect(qi, oi)}
                      aria-label={`Mark option ${oi + 1} as correct`}
                    />
                    <span className="create-radio-custom"></span>
                  </label>

                  <span className="create-option-letter">
                    {String.fromCharCode(65 + oi)}
                  </span>

                  <input
                    className="create-option-input"
                    type="text"
                    placeholder={`Enter option ${oi + 1}`}
                    value={option}
                    onChange={(e) => setOption(qi, oi, e.target.value)}
                    aria-label={`Question ${qi + 1}, option ${oi + 1}`}
                    required
                  />

                  {q.correctAnswer === oi && (
                    <span className="create-correct-label">Correct</span>
                  )}

                  {q.options.length > 2 && (
                    <button
                      type="button"
                      className="create-remove-option"
                      onClick={() => removeOption(qi, oi)}
                      aria-label={`Remove option ${oi + 1}`}
                      title="Remove option"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="create-add-option"
              onClick={() => addOption(qi)}
            >
              <span>+</span> Add another option
            </button>

          </section>
        ))}

        {/* Add question */}
        <button
          type="button"
          className="create-add-question"
          onClick={addQuestion}
        >
          <span>+</span>
          Add another question
        </button>

        {/* Messages */}
        {error && (
          <div className="create-message create-error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        {msg && (
          <div className="create-message create-success" role="status">
            <span>✓</span>
            {msg}
          </div>
        )}

        {/* Submit */}
        <div className="create-submit-area">
          <p>Review your questions and correct answers before publishing.</p>

          <button
            type="submit"
            className="create-submit-button"
            disabled={loading}
          >
            {loading ? 'Creating Quiz...' : '✓  Create Quiz'}
          </button>
        </div>

      </form>
    </div>
  );
}
