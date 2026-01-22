import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Reuseable/Footer";

export default function Welcome() {
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Pool of sample flashcards - 19 questions covering all MBBS subjects
  const flashcardPool = [
    {
      subject: "Anatomy",
      difficulty: "Hard",
      question: "What are the branches of the Arch of Aorta?",
      answer: "1. Brachiocephalic trunk\n2. Left common carotid artery\n3. Left subclavian artery"
    },
    {
      subject: "Physiology",
      difficulty: "Medium",
      question: "What is the normal pH range of arterial blood?",
      answer: "7.35 to 7.45\n\nValues below 7.35 indicate acidosis, while values above 7.45 indicate alkalosis."
    },
    {
      subject: "Biochemistry",
      difficulty: "Hard",
      question: "What is the rate-limiting enzyme of glycolysis?",
      answer: "Phosphofructokinase-1 (PFK-1)\n\nIt catalyzes the conversion of fructose-6-phosphate to fructose-1,6-bisphosphate."
    },
    {
      subject: "Pathology",
      difficulty: "Hard",
      question: "What are the classic features of Virchow's Triad?",
      answer: "1. Endothelial injury\n2. Abnormal blood flow (stasis/turbulence)\n3. Hypercoagulability"
    },
    {
      subject: "Pharmacology",
      difficulty: "Medium",
      question: "What is the mechanism of action of Aspirin?",
      answer: "Irreversibly inhibits COX-1 and COX-2 enzymes, preventing the synthesis of prostaglandins and thromboxane A2."
    },
    {
      subject: "Microbiology",
      difficulty: "Easy",
      question: "Which bacteria is the most common cause of UTI?",
      answer: "Escherichia coli (E. coli)\n\nAccounts for approximately 80-85% of community-acquired UTIs."
    },
    {
      subject: "Forensic Medicine",
      difficulty: "Medium",
      question: "What are the stages of decomposition?",
      answer: "1. Fresh stage (0-3 days)\n2. Bloating stage (4-10 days)\n3. Active decay (10-20 days)\n4. Advanced decay (20-50 days)\n5. Dry/skeletal remains (50+ days)"
    },
    {
      subject: "Community Medicine",
      difficulty: "Easy",
      question: "What are the components of the epidemiological triad?",
      answer: "1. Agent (causative factor)\n2. Host (susceptible individual)\n3. Environment (external factors)\n\nThese three components interact to cause disease."
    },
    {
      subject: "Internal Medicine",
      difficulty: "Medium",
      question: "What are the diagnostic criteria for Diabetes Mellitus?",
      answer: "1. Fasting glucose ≥126 mg/dL\n2. Random glucose ≥200 mg/dL with symptoms\n3. HbA1c ≥6.5%\n4. 2-hour OGTT ≥200 mg/dL"
    },
    {
      subject: "Surgery",
      difficulty: "Easy",
      question: "What is McBurney's point?",
      answer: "A point located 1/3 the distance from the anterior superior iliac spine (ASIS) to the umbilicus.\n\nMaximum tenderness at this point suggests acute appendicitis."
    },
    {
      subject: "Obstetrics & Gynecology",
      difficulty: "Medium",
      question: "What are the cardinal movements of labor?",
      answer: "1. Engagement\n2. Descent\n3. Flexion\n4. Internal rotation\n5. Extension\n6. External rotation (Restitution)\n7. Expulsion"
    },
    {
      subject: "Pediatrics",
      difficulty: "Easy",
      question: "What is the normal respiratory rate for a newborn?",
      answer: "30-60 breaths per minute\n\nRates above 60 may indicate respiratory distress in newborns."
    },
    {
      subject: "Ophthalmology",
      difficulty: "Medium",
      question: "What are the features of acute angle-closure glaucoma?",
      answer: "1. Severe eye pain\n2. Blurred vision with halos\n3. Red eye\n4. Fixed mid-dilated pupil\n5. Raised intraocular pressure\n6. Nausea and vomiting"
    },
    {
      subject: "ENT",
      difficulty: "Easy",
      question: "What is the Weber test used for?",
      answer: "To differentiate between conductive and sensorineural hearing loss.\n\nA tuning fork is placed on the forehead. Sound lateralizes to the affected ear in conductive loss and to the normal ear in sensorineural loss."
    },
    {
      subject: "Orthopedics",
      difficulty: "Medium",
      question: "What are the components of the Unhappy Triad (O'Donoghue Triad)?",
      answer: "1. ACL tear (Anterior Cruciate Ligament)\n2. MCL tear (Medial Collateral Ligament)\n3. Medial meniscus tear\n\nCommonly occurs from lateral impact to the knee."
    },
    {
      subject: "Dermatology",
      difficulty: "Easy",
      question: "What is the ABCDE rule for melanoma detection?",
      answer: "A - Asymmetry\nB - Border irregularity\nC - Color variation\nD - Diameter >6mm\nE - Evolution (changing over time)"
    },
    {
      subject: "Psychiatry",
      difficulty: "Medium",
      question: "What are the core symptoms of Major Depressive Disorder?",
      answer: "Must have at least 5 symptoms for 2+ weeks, including:\n1. Depressed mood (required)\n2. Anhedonia (loss of interest/pleasure)\n3. Sleep disturbance\n4. Appetite/weight changes\n5. Fatigue\n6. Guilt/worthlessness\n7. Concentration problems\n8. Psychomotor changes\n9. Suicidal thoughts"
    },
    {
      subject: "Radiology",
      difficulty: "Hard",
      question: "What are the radiological features of pneumoperitoneum on an erect chest X-ray?",
      answer: "1. Rigler's sign (both sides of bowel wall visible)\n2. Football sign (large oval lucency)\n3. Free air under the diaphragm (crescent-shaped lucency)\n\nIndicates bowel perforation requiring urgent surgical intervention."
    },
    {
      subject: "Anesthesiology",
      difficulty: "Medium",
      question: "What are the components of the ASA Physical Status Classification?",
      answer: "ASA I - Normal healthy patient\nASA II - Mild systemic disease\nASA III - Severe systemic disease\nASA IV - Severe disease, constant threat to life\nASA V - Moribund, not expected to survive\nASA VI - Brain-dead organ donor"
    }
  ];

  // Randomly select a flashcard on component mount
  const [currentCard] = React.useState(() => {
    const randomIndex = Math.floor(Math.random() * flashcardPool.length);
    return flashcardPool[randomIndex];
  });

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🩺</span>
            <span className="logo-text">Memora</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/login" className="nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Master Medicine with <br />
              <span className="text-gradient">Intelligent Flashcards</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate revision tool for MBBS students. Boost your memory with
              active recall and scientifically-proven spaced repetition.
            </p>
            <div className="hero-btns">
              <Link to="/login" className="btn-primary">Start Studying Free</Link>
            </div>

          </div>

          <div className="hero-visual">
            <div
              className={`glass-card-container ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="glass-card-inner">
                {/* Front */}
                <div className="glass-card-front">
                  <div className="card-header">
                    <span className="card-tag">{currentCard.subject}</span>
                    <span className={`card-difficulty ${currentCard.difficulty.toLowerCase()}`}>{currentCard.difficulty}</span>
                  </div>
                  <div className="card-body">
                    <h3>{currentCard.question}</h3>
                    <div className="card-action">Tap to reveal answer</div>
                  </div>
                </div>
                {/* Back */}
                <div className="glass-card-back">
                  <div className="card-header">
                    <span className="card-tag">Answer</span>
                    <span className="card-difficulty correct">Correct</span>
                  </div>
                  <div className="card-body">
                    <p className="answer-list" style={{ whiteSpace: 'pre-line' }}>
                      {currentCard.answer}
                    </p>
                  </div>
                  <div className="card-footer">
                    <span>Active Recall Success</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-blob blob-1"></div>
            <div className="floating-blob blob-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Why Memora?</h2>
          <p className="section-subtitle">Designed specifically for the intense curriculum of medical school.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Spaced Repetition</h3>
            <p>Our algorithm predicts when you're about to forget a concept and brings it back at the perfect moment.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3>Curated MBBS Content</h3>
            <p>Questions reviewed by medical professionals, covering Clinical, Pre-clinical and Para-clinical subjects.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>Track your daily progress, streaks, and identify your weak areas with visual charts.</p>
          </div>
        </div>
      </section>
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --bg: #0f172a;
          --text: #f8fafc;
          --text-muted: #94a3b8;
          --accent: #38bdf8;
          --glass-bg: rgba(30, 41, 59, 0.7);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        .landing-page {
          min-height: 100vh;
          background: radial-gradient(circle at top right, #1e293b, #0f172a);
        }

        /* Nav */
        .nav {
          height: 80px;
          display: flex;
          align-items: center;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 100;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
        }

        .nav-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 800;
          text-decoration: none;
        }

        .logo-text { color: white; }
        .text-accent { color: var(--accent); }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-link:hover { color: white; }

        .nav-cta {
          background: var(--primary);
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: 99px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s, background 0.3s;
        }

        .nav-cta:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        /* Hero */
        .hero {
          padding-top: 160px;
          padding-bottom: 100px;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 2rem;
          padding-right: 2rem;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -2px;
        }

        .text-gradient {
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 540px;
        }

        .hero-btns {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);
        }

        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.5);
        }



        .hero-stats {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--glass-border);
        }

        /* Hero Visual - Interactive Card */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }

        .glass-card-container {
          width: 100%;
          max-width: 380px;
          height: 320px;
          cursor: pointer;
          position: relative;
          z-index: 2;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .flipped .glass-card-inner {
          transform: rotateY(180deg);
        }

        .glass-card-front, .glass-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .glass-card-back {
          transform: rotateY(180deg);
          background: rgba(15, 23, 42, 0.9);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .card-tag {
          background: rgba(56, 189, 248, 0.2);
          color: var(--accent);
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .card-difficulty {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .card-difficulty.easy {
          color: #4ade80;
        }

        .card-difficulty.medium {
          color: #fbbf24;
        }

        .card-difficulty.hard {
          color: #f87171;
        }

        .card-difficulty.correct {
          color: #4ade80;
        }

        .card-body h3 {
          font-size: 1.5rem;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          font-weight: 600;
          color: white;
        }

        .answer-list {
          text-align: left;
          color: var(--accent);
          line-height: 1.8;
          font-weight: 600;
        }

        .card-action {
          color: var(--text-muted);
          font-size: 0.875rem;
          text-align: center;
          padding: 1rem;
          border: 1.5px dashed var(--glass-border);
          border-radius: 12px;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .pulse-indicator {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          animation: pulse 2s infinite;
        }

        .floating-blob {
          position: absolute;
          width: 300px;
          height: 300px;
          filter: blur(80px);
          z-index: 1;
          border-radius: 50%;
        }

        .blob-1 {
          background: rgba(37, 99, 235, 0.3);
          top: -20%;
          right: -10%;
        }

        .blob-2 {
          background: rgba(56, 189, 248, 0.2);
          bottom: -10%;
          left: -10%;
        }

        /* Features */
        .features {
          padding: 100px 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 1.125rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          padding: 2.5rem;
          border-radius: 20px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .feature-card p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        /* Mobile Responsive */
        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .nav-container { padding: 0 1.5rem; }
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }
          .hero-text {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-title {
            font-size: 3.5rem;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .nav { height: 70px; }
          .nav-container { padding: 0 1rem; }
          .logo-text { font-size: 1.1rem; }
          .logo-icon { font-size: 1.25rem; }
          .nav-links { gap: 0.75rem; }
          .nav-link { font-size: 0.85rem; }
          .nav-cta { padding: 0.5rem 1rem; font-size: 0.85rem; }
          
          .hero { padding-top: 100px; padding-bottom: 40px; }
          .hero-title { font-size: 2.25rem; line-height: 1.2; }
          .hero-subtitle { font-size: 1rem; line-height: 1.5; margin-bottom: 2rem; }
          .glass-card-container { height: 260px; }
          .card-body h3 { font-size: 1.15rem; }
          .features { padding: 40px 1.25rem; }
          .section-title { font-size: 1.75rem; }
        }

        @media (max-width: 480px) {
          .nav-container { padding: 0 0.75rem; }
          .logo-text { display: none; }
          .hero-title {
            font-size: 2rem;
            letter-spacing: -0.5px;
          }
          .hero-subtitle { font-size: 0.95rem; }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .hero-btns {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary {
            width: 100%;
            text-align: center;
            padding: 0.875rem;
          }
          .glass-card-container { max-width: 100%; height: 240px; }
          .glass-card-front, .glass-card-back { padding: 1.25rem; }
          .card-header { margin-bottom: 0.75rem; }
          .feature-card { padding: 1.25rem; }
        }
      `}</style>
    </div >
  );
}