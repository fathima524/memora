import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#e2e8f0',
      color: '#2d3748',
      padding: '1.5rem 2rem 1rem',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Branding */}
        <div className="footer-branding" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div className="footer-logo" style={{
            fontSize: '1.5rem',
            background: 'linear-gradient(45deg, #4a5568, #2d3748)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(74, 85, 104, 0.3))'
          }}>
            ⚡
          </div>
          <p className="footer-tagline" style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            margin: '0',
            background: 'linear-gradient(45deg, #4a5568, #2d3748)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Quick Medical Revision Made Simple
          </p>
        </div>

        {/* Navigation Links */}
        <div className="footer-links" style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {['Home', 'About', 'Contact', 'Privacy', 'Terms', 'FAQ'].map((link, index) => (
            <a key={index} href="#" style={{
              color: '#718096',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#4a5568';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#718096';
            }}>
              {link}
            </a>
          ))}
        </div>

        {/* Social Links */}
        <div className="footer-socials" style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {['LinkedIn', 'Twitter', 'Instagram'].map((social, index) => (
            <a key={index} href="#" style={{
              color: '#718096',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              padding: '0.3rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#4a5568';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#718096';
            }}>
              {social}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="footer-copy" style={{
          fontSize: '0.8rem',
          color: '#718096',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          © 2025 Flash-doc
        </div>
      </div>
    </footer>
  );
}