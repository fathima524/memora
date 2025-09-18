import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function Footer() {
  const [emailHovered, setEmailHovered] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Branding */}
        <div className="footer-branding">
          <div className="footer-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Flash-doc</span>
          </div>
          <p className="footer-tagline">Quick Medical Revision Made Simple</p>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <span>© 2025 Flash-doc</span>
          <span className="separator">•</span>
          <span>Made with care for medical education</span>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <div className="contact-content">
            <Mail className="contact-icon" size={16} />
            <a 
              href="mailto:memora.education@gmail.com"
              className={`contact-email ${emailHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
            >
              memora.education@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .footer {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #2d3748;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          border-top: 1px solid rgba(203, 213, 225, 0.6);
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #cbd5e0, transparent);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .footer-branding {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 1.75rem;
          background: linear-gradient(135deg, #3182ce, #2c5282);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 4px rgba(49, 130, 206, 0.2));
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { filter: drop-shadow(0 2px 4px rgba(49, 130, 206, 0.2)); }
          50% { filter: drop-shadow(0 4px 8px rgba(49, 130, 206, 0.4)); }
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #2d3748, #4a5568);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
        }

        .footer-tagline {
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a5568;
          margin: 0;
          white-space: nowrap;
        }

        .footer-contact {
          display: flex;
          align-items: center;
        }

        .contact-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          border: 1px solid rgba(203, 213, 225, 0.5);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .contact-content:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: #3182ce;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(49, 130, 206, 0.15);
        }

        .contact-icon {
          color: #3182ce;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .contact-content:hover .contact-icon {
          transform: scale(1.1);
        }

        .contact-email {
          color: #2d3748;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .contact-email.hovered {
          color: #3182ce;
        }

        .footer-copyright {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #718096;
          white-space: nowrap;
        }

        .separator {
          color: #cbd5e0;
          font-weight: bold;
        }

        /* Tablet and Mobile Styles */
        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }

          .footer-branding {
            gap: 0.75rem;
          }

          .footer-tagline {
            white-space: normal;
            font-size: 0.85rem;
          }

          .footer-copyright {
            order: -1;
            font-size: 0.75rem;
          }
        }

        /* Mobile Styles */
        @media (max-width: 480px) {
          .footer {
            padding: 1.5rem 1rem;
          }

          .footer-container {
            gap: 1.25rem;
          }

          .footer-branding {
            flex-direction: column;
            gap: 0.5rem;
          }

          .footer-logo {
            gap: 0.5rem;
          }

          .logo-icon {
            font-size: 1.5rem;
          }

          .logo-text {
            font-size: 1.1rem;
          }

          .footer-tagline {
            font-size: 0.8rem;
          }

          .contact-content {
            padding: 0.5rem 0.625rem;
            border-radius: 8px;
          }

          .contact-email {
            font-size: 0.8rem;
          }

          .footer-copyright {
            flex-direction: column;
            gap: 0.25rem;
            font-size: 0.7rem;
          }

          .separator {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}