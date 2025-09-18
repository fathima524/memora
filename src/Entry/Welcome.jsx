import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome-box">
        <h1 className="welcome-title">Welcome to Flash-doc</h1>
        <p className="welcome-text">
          Get ready to revise smarter with flashcards, spaced repetition, and curated questions for MBBS students.
        </p>

        <Link to="/login" className="welcome-button">Get Started</Link>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .welcome-page {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100vw;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 40%, #8b9da9 70%, #e8eaec 100%);
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
          margin: 0;
          position: relative;
          animation: fadeInBackground 1.2s ease-out;
        }

        .welcome-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 60px 50px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 40px rgba(60, 75, 92, 0.3), 0 8px 16px rgba(60, 75, 92, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
          animation: slideUpFade 1s ease-out 0.3s both;
        }

        .welcome-title {
          font-size: 32px;
          font-weight: 700;
          color: #3c4b5c;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
          line-height: 1.2;
          animation: slideUpFade 0.8s ease-out 0.6s both;
        }

        .welcome-text {
          font-size: 16px;
          font-weight: 400;
          color: #5a6b7a;
          line-height: 1.6;
          margin-bottom: 35px;
          letter-spacing: 0.2px;
          animation: slideUpFade 0.8s ease-out 0.9s both;
        }

        .welcome-button {
          display: inline-block;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
          box-sizing: border-box;
          animation: slideUpFade 0.8s ease-out 1.2s both, pulse 2s ease-in-out 2s infinite;
        }

        .welcome-button:hover {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(60, 75, 92, 0.4);
          text-decoration: none;
          color: white;
          animation: none;
        }

        .welcome-button:active {
          transform: translateY(0);
        }

        /* Keyframe Animations */
        @keyframes fadeInBackground {
          from {
            opacity: 0;
            background-size: 110% 110%;
          }
          to {
            opacity: 1;
            background-size: 100% 100%;
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(60, 75, 92, 0.3);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(60, 75, 92, 0.4);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .welcome-page {
            padding: 15px;
          }
          
          .welcome-box {
            padding: 50px 30px;
            max-width: calc(100vw - 30px);
          }
          
          .welcome-title {
            font-size: 28px;
          }
          
          .welcome-text {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .welcome-page {
            padding: 10px;
          }
          
          .welcome-box {
            padding: 40px 20px;
            max-width: calc(100vw - 20px);
            border-radius: 15px;
          }
          
          .welcome-title {
            font-size: 24px;
            margin-bottom: 18px;
          }
          
          .welcome-text {
            font-size: 14px;
            margin-bottom: 30px;
          }
          
          .welcome-button {
            padding: 14px;
            font-size: 16px;
          }
        }

        @media (max-width: 375px) {
          .welcome-page {
            padding: 8px;
          }
          
          .welcome-box {
            padding: 35px 15px;
            max-width: calc(100vw - 16px);
            border-radius: 12px;
          }
          
          .welcome-title {
            font-size: 22px;
          }
          
          .welcome-text {
            font-size: 13px;
            line-height: 1.5;
          }
        }

        @media (max-width: 320px) {
          .welcome-page {
            padding: 5px;
          }
          
          .welcome-box {
            padding: 30px 12px;
            max-width: calc(100vw - 10px);
            border-radius: 10px;
          }
          
          .welcome-title {
            font-size: 20px;
            margin-bottom: 15px;
          }
          
          .welcome-text {
            font-size: 12px;
            margin-bottom: 25px;
          }
          
          .welcome-button {
            padding: 12px;
            font-size: 14px;
          }
        }

        /* Ultra-wide screens */
        @media (min-width: 1200px) {
          .welcome-box {
            max-width: 550px;
            padding: 70px 60px;
          }
          
          .welcome-title {
            font-size: 36px;
          }
          
          .welcome-text {
            font-size: 18px;
          }
        }

        /* Landscape orientation on mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .welcome-page {
            padding: 10px;
          }
          
          .welcome-box {
            padding: 30px 40px;
            max-width: 90vw;
          }
          
          .welcome-title {
            font-size: 24px;
            margin-bottom: 15px;
          }
          
          .welcome-text {
            font-size: 14px;
            margin-bottom: 25px;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
          .welcome-box {
            border: 0.5px solid rgba(255, 255, 255, 0.3);
          }
        }

        /* Reduce animations on devices that prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .welcome-page,
          .welcome-box,
          .welcome-title,
          .welcome-text,
          .welcome-button {
            animation: none;
          }
          
          .welcome-button:hover {
            transform: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .welcome-box {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(15px);
          }
        }
      `}</style>
    </div>
  );
}