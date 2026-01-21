import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fromFreeTrial, sessionData, message } = location.state || {};

  const handleSelectPlan = (plan) => {
    navigate("/payment-checkout", { state: { plan } });
  };

  return (
    <div className="pricing-page">
      <Navbar />

      <main className="pricing-container">
        <div className="mesh-bg"></div>

        <div className="content-wrapper">
          {fromFreeTrial && (
            <div className="trial-summary">
              <div className="trial-message">
                {message || "Daily free limit reached. Upgrade to keep the momentum going!"}
              </div>
              {sessionData && (
                <div className="mini-stats">
                  <div className="mini-stat">
                    <span className="label">Score</span>
                    <span className="value">{sessionData.score}/{sessionData.totalQuestions}</span>
                  </div>
                  <div className="mini-stat">
                    <span className="label">Streak</span>
                    <span className="value">{sessionData.streak} 🔥</span>
                  </div>
                  <div className="mini-stat">
                    <span className="label">Time</span>
                    <span className="value">{Math.floor(sessionData.timeSpent / 60)}m</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <header className="pricing-header">
            <h1>Elevate Your Learning</h1>
            <p>Choose a plan that fits your medical career goals.</p>
          </header>

          <div className="plans-grid">
            <div className="plan-card">
              <div className="plan-badge">Most Flexible</div>
              <h2>Monthly</h2>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">299</span>
                <span className="period">/month</span>
              </div>
              <ul className="plan-features">
                <li>✅ Unlimited Flashcards</li>
                <li>✅ All Medical Subjects</li>
                <li>✅ AI Spaced Repetition</li>
                <li>✅ Advanced Analytics</li>
              </ul>
              <button className="btn-plan" onClick={() => handleSelectPlan("monthly")}>
                Start Monthly
              </button>
            </div>

            <div className="plan-card featured">
              <div className="plan-badge">Best Value - 20% Off</div>
              <h2>Yearly</h2>
              <div className="price">
                <span className="currency">₹</span>
                <span className="amount">2,499</span>
                <span className="period">/year</span>
              </div>
              <ul className="plan-features">
                <li>✅ Everything in Monthly</li>
                <li>✅ Priority Support</li>
                <li>✅ Offline Mode Access</li>
                <li>✅ Early Beta Features</li>
              </ul>
              <button className="btn-plan primary" onClick={() => handleSelectPlan("yearly")}>
                Claim Yearly Deal
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pricing-page {
          min-height: 100vh;
          background: #0f172a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
        }

        .pricing-container {
          position: relative;
          padding: 8rem 2rem 4rem;
          min-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .mesh-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(56, 189, 248, 0.1) 0%, transparent 50%);
          z-index: 1;
        }

        .content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .trial-summary {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 1.5rem 2rem;
          margin-bottom: 3rem;
          width: 100%;
          max-width: 600px;
          text-align: center;
        }

        .trial-message {
          color: #38bdf8;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .mini-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .mini-stat {
          display: flex;
          flex-direction: column;
        }

        .mini-stat .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 1px;
        }

        .mini-stat .value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .pricing-header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -2px;
          background: linear-gradient(to right, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pricing-header p {
          color: #94a3b8;
          font-size: 1.25rem;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          width: 100%;
        }

        .plan-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .plan-card:hover {
          transform: translateY(-10px);
          border-color: rgba(37, 99, 235, 0.3);
          background: rgba(30, 41, 59, 0.8);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
        }

        .plan-card.featured {
          background: rgba(37, 99, 235, 0.1);
          border-color: rgba(37, 99, 235, 0.4);
        }

        .plan-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 99px;
          width: fit-content;
          margin-bottom: 1.5rem;
          color: #38bdf8;
        }

        .plan-card h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 2rem;
        }

        .currency { font-size: 1.5rem; color: #94a3b8; }
        .amount { font-size: 3.5rem; font-weight: 800; }
        .period { color: #94a3b8; }

        .plan-features {
          list-style: none;
          margin-bottom: 3rem;
          flex-grow: 1;
        }

        .plan-features li {
          margin-bottom: 1rem;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-plan {
          width: 100%;
          padding: 1.25rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .btn-plan:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-plan.primary {
          background: #2563eb;
          border: none;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .btn-plan.primary:hover {
          background: #1d4ed8;
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .pricing-header h1 { font-size: 2.5rem; }
          .plans-grid { grid-template-columns: 1fr; }
          .plan-card { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}