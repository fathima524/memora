import React from 'react';
import { Mail, Linkedin, Github, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ minimal = false }) {
  const currentYear = new Date().getFullYear();

  if (minimal) {
    return (
      <footer className="memora-footer minimal">
        <div className="footer-content">
          <div className="minimal-footer-grid">
            <span className="minimal-brand">Dashboard</span>
            <div className="minimal-support">
              <span className="support-label">Contact us from here:</span>
              <a href="mailto:memora.education@gmail.com">memora.education@gmail.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">© {currentYear} Memora</div>
          </div>
        </div>
        <style>{`
          .memora-footer.minimal {
            background: #0f172a;
            padding: 3rem 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .minimal-footer-grid {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }
          .minimal-brand {
            font-size: 1.5rem;
            font-weight: 800;
            color: white;
            letter-spacing: -1px;
          }
          .minimal-support {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #94a3b8;
            font-size: 0.95rem;
          }
          .support-label { font-weight: 500; }
          .minimal-support a {
            color: #38bdf8;
            text-decoration: none;
            font-weight: 700;
            transition: color 0.2s;
          }
          .minimal-support a:hover { color: white; text-decoration: underline; }
          .footer-bottom {
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.03);
            display: flex;
            justify-content: center;
            font-size: 0.85rem;
            color: #64748b;
          }
          @media (max-width: 640px) {
            .minimal-footer-grid { flex-direction: column; gap: 1rem; text-align: center; }
            .minimal-support { flex-direction: column; gap: 0.25rem; }
          }
        `}</style>
      </footer>
    );
  }

  return (
    <footer className="memora-footer">
      <div className="footer-mesh"></div>

      <div className="footer-content">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-column brand-col">
            <div className="footer-logo">
              <span className="logo-emoji">🩺</span>
              <span className="logo-name">Memora</span>
            </div>
            <p className="footer-description">
              Elevating medical education through science-based active recall and intelligent spaced repetition. Built by students, for students.
            </p>
            <div className="footer-socials">
              <a href="mailto:memora.education@gmail.com" className="social-link" title="Email Us">
                <Mail size={18} />
              </a>
              <a href="#" className="social-link" title="Twitter">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Team Section */}
          <div className="footer-column">
            <h4 className="column-title">The Visionaries</h4>
            <div className="team-list">
              <div className="team-member">
                <div className="member-info">
                  <span className="member-name">Ryyan Sheikh</span>
                  <span className="member-role">Founder & Visionary</span>
                </div>
                <a
                  href="https://www.linkedin.com/in/ryyan-sheikh-65175022a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="member-link"
                >
                  <Linkedin size={16} />
                </a>
              </div>
              <div className="team-member">
                <div className="member-info">
                  <span className="member-name">Fathima Hijaab Irfan</span>
                  <span className="member-role">Lead Developer</span>
                </div>
                <a
                  href="https://www.linkedin.com/in/fathima-hijaab-irfan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="member-link"
                >
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="footer-column">
            <h4 className="column-title">Support</h4>
            <div className="support-direct">
              <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                Contact us from here:
              </span>
              <a href="mailto:memora.education@gmail.com" style={{ color: '#38bdf8', fontWeight: '700', fontSize: '1rem', textDecoration: 'none' }}>
                memora.education@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © {currentYear} Memora. All rights reserved.
          </div>
          <div className="crafted-by">
            Crafted with <Heart size={14} className="heart-icon" /> for the Medical Community
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .memora-footer {
          background: #0f172a;
          color: #94a3b8;
          padding: 6rem 2rem 2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-mesh {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 100%, rgba(37, 99, 235, 0.05) 0%, transparent 50%);
          z-index: 1;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 0.8fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .brand-col {
          max-width: 360px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .logo-emoji { font-size: 1.5rem; }
        .logo-name { 
          font-size: 1.5rem; 
          font-weight: 800; 
          color: white; 
          letter-spacing: -1px;
        }

        .footer-description {
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .footer-socials {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.3s;
        }

        .social-link:hover {
          background: rgba(37, 99, 235, 0.1);
          border-color: #2563eb;
          color: white;
          transform: translateY(-3px);
        }

        .column-title {
          color: white;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .team-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .team-member {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          padding: 1rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s;
        }

        .team-member:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .member-info {
          display: flex;
          flex-direction: column;
        }

        .member-name {
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .member-role {
          font-size: 0.75rem;
          color: #64748b;
        }

        .member-link {
          color: #94a3b8;
          transition: color 0.2s;
        }

        .member-link:hover {
          color: #0077b5; /* LinkedIn Blue */
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .footer-links a:hover {
          color: white;
          padding-left: 5px;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #64748b;
        }

        .heart-icon {
          color: #ef4444;
          display: inline;
          margin: 0 4px;
          vertical-align: middle;
        }

        @media (max-width: 968px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .brand-col {
            grid-column: span 2;
            max-width: none;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .brand-col {
            grid-column: span 1;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}