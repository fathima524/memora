import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";

export default function Thanks() {
  const navigate = useNavigate();

  return (
    <div className="thanks-page">
      <Navbar />

      <main className="thanks-container">
        <div className="mesh-bg"></div>

        <div className="thanks-card">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="thanks-content">
            <h1>Payment Successful!</h1>
            <p>Welcome to the premium medical community. Your Pro account is now active and ready for your next study session.</p>

            <div className="next-steps">
              <div className="step">
                <span className="step-num">1</span>
                <span>Pro subjects unlocked</span>
              </div>
              <div className="step">
                <span className="step-num">2</span>
                <span>Unlimited cards enabled</span>
              </div>
              <div className="step">
                <span className="step-num">3</span>
                <span>Analytics tracking active</span>
              </div>
            </div>

            <button className="btn-dashboard" onClick={() => navigate("/dashboard")}>
              Go to My Dashboard
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .thanks-page {
          min-height: 100vh;
          background: #0f172a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
        }

        .thanks-container {
          position: relative;
          padding: 8rem 2rem 4rem;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .mesh-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 50%);
          z-index: 1;
        }

        .thanks-card {
          position: relative;
          z-index: 2;
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          padding: 4rem;
          max-width: 550px;
          width: 100%;
          text-align: center;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #22c55e;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2.5rem;
          color: white;
          box-shadow: 0 20px 40px -10px rgba(34, 197, 94, 0.4);
        }

        .success-icon svg {
          width: 40px;
          height: 40px;
        }

        .thanks-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -1px;
        }

        .thanks-content p {
          color: #94a3b8;
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .next-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3rem;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #cbd5e1;
          font-weight: 600;
        }

        .step-num {
          width: 24px;
          height: 24px;
          background: rgba(37, 99, 235, 0.2);
          color: #38bdf8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .btn-dashboard {
          width: 100%;
          padding: 1.25rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.125rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-dashboard:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
        }

        @media (max-width: 640px) {
          .thanks-card { padding: 2.5rem 1.5rem; }
          .thanks-content h1 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}