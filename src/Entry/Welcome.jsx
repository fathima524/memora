import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Reuseable/Footer";
import "./Welcome.css";

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
    </div>
  );
}