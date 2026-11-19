
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/auth.js';

export default function Landing() {
  const user = getCurrentUser();

  const features = [
    {
      icon: '✍️',
      title: 'Create Quizzes',
      description: 'Teachers can create custom quizzes with multiple-choice questions.',
    },
    {
      icon: '🎯',
      title: 'Take Quizzes',
      description: 'Challenge yourself with interactive quizzes and instant results.',
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Check your scores and understand your learning performance.',
    },
  ];

  const steps = [
    ['01', 'Create an Account', 'Sign up as a student or teacher.'],
    ['02', 'Explore Quizzes', 'Discover available quizzes or create your own.'],
    ['03', 'Test Your Knowledge', 'Answer questions and submit your responses.'],
    ['04', 'See Your Results', 'View your score and celebrate your progress.'],
  ];

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-glow landing-glow-one" />
        <div className="landing-glow landing-glow-two" />

        <div className="landing-content">
          <span className="landing-badge">
            ✨ LEARN • PRACTICE • GROW
          </span>

          <h1>
            Learning becomes
            <span> more exciting </span>
            with Quizzy.
          </h1>

          <p className="landing-description">
            Discover interactive quizzes, challenge your knowledge,
            and track your progress — all in one place.
          </p>

          <div className="landing-actions">
            {user ? (
              <Link to="/dashboard" className="landing-primary-btn">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="landing-primary-btn">
                  Get Started →
                </Link>
                <Link to="/login" className="landing-secondary-btn">
                  Login to Account
                </Link>
              </>
            )}
          </div>

          <div className="landing-trust">
            <span>✓ Easy to use</span>
            <span>✓ Interactive learning</span>
            <span>✓ Instant results</span>
          </div>
        </div>

        <div className="landing-preview">
          <div className="preview-top">
            <div>
              <span className="preview-small">YOUR LEARNING SPACE</span>
              <h3>Ready to test yourself?</h3>
            </div>
            <span className="preview-emoji">🎓</span>
          </div>

          <div className="preview-question">
            <span>GENERAL KNOWLEDGE</span>
            <h4>Which planet is known as the Red Planet?</h4>
            <div className="preview-option">A. Venus</div>
            <div className="preview-option preview-selected">
              B. Mars <span>✓</span>
            </div>
            <div className="preview-option">C. Jupiter</div>
          </div>

          <div className="preview-bottom">
            <span>✨ Keep learning every day!</span>
            <span>01 / 10</span>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-section-heading">
          <span>WHY QUIZZY?</span>
          <h2>Everything you need to learn better.</h2>
          <p>Simple tools that make learning more engaging.</p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature) => (
            <article className="landing-feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-how">
        <div className="landing-section-heading">
          <span>GETTING STARTED</span>
          <h2>Your learning journey in four steps.</h2>
        </div>

        <div className="landing-steps">
          {steps.map(([number, title, description]) => (
            <article className="landing-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to challenge yourself?</h2>
        <p>Start your learning journey with Quizzy today.</p>
        <Link
          to={user ? '/dashboard' : '/signup'}
          className="landing-primary-btn"
        >
          {user ? 'Explore Dashboard →' : 'Join Quizzy →'}
        </Link>
      </section>

      <footer className="landing-footer">
        <strong>Quizzy.</strong>
        <span>Learn something new, one quiz at a time.</span>
      </footer>
    </main>
  );
}
