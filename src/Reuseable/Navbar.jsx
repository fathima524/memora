import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../supabase/auth';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout().then(() => {
      localStorage.clear();
      navigate('/');
    });
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profilepage' }
  ];

  return (
    <>
      <nav style={styles.navbar}>
        {/* Left Side: Logo */}
        <div style={styles.logoContainer}>
          <div 
            className="navbar-logo"
            style={styles.logoButton}
            onClick={() => handleNavigation('/dashboard')}
          >
            <svg 
              width={isMobile ? "22" : "26"} 
              height={isMobile ? "22" : "26"} 
              viewBox="0 0 24 24" 
              fill="none" 
              style={styles.logoIcon}
            >
              {/* Medical Cross with Document */}
              <rect x="3" y="4" width="14" height="16" rx="2" fill="none" stroke="url(#medicalGradient)" strokeWidth="1.5"/>
              <path d="M7 8h6M7 12h6M7 16h4" stroke="url(#medicalGradient)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M18 2v8M14 6h8" stroke="url(#medicalGradient)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M19 14l1 2 1-4 1 2 1-1" stroke="url(#medicalGradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="20" cy="20" r="1" fill="url(#medicalGradient)"/>
              <circle cx="22" cy="18" r="0.5" fill="url(#medicalGradient)" opacity="0.7"/>
              <defs>
                <linearGradient id="medicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2c5aa0" />
                  <stop offset="30%" stopColor="#27374d" />
                  <stop offset="70%" stopColor="#526d82" />
                  <stop offset="100%" stopColor="#4a90e2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Center: Enhanced App Name and Tagline */}
        <div style={styles.brandContainer}>
          <div style={styles.brandWrapper} className="brand-wrapper">
            <h1 style={styles.appName} className="app-name-hover">
              <span style={styles.appNameMain} className="app-name-main">Memora</span>
              <span style={styles.appNameAccent}>.</span>
            </h1>
            {!isMobile && (
              <>
                <p style={styles.tagline}>
                  Your comprehensive platform for medical excellence
                </p>
                <div style={styles.underlineContainer}>
                  <div style={styles.underline} className="underline-shimmer"></div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Hamburger Menu */}
        <div style={styles.navbarRight}>
          <div style={styles.hamburgerContainer}>
            <button 
              className="navbar-button"
              onClick={toggleDropdown}
              style={styles.hamburgerButton}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            
            {isDropdownOpen && (
              <div style={styles.dropdown}>
                <ul style={styles.dropdownList}>
                  {menuItems.map((item, index) => (
                    <li 
                      key={index}
                      className="dropdown-item"
                      style={{
                        ...styles.dropdownItem,
                        ...(index === menuItems.length - 1 ? styles.lastDropdownItem : {})
                      }}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div style={styles.dropdownLink}>
                        {item.label}
                      </div>
                    </li>
                  ))}
                  <li 
                    className="logout-item"
                    style={styles.logoutItem}
                    onClick={handleLogout}
                  >
                    <div style={styles.logoutLink}>
                      Logout
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.3)); }
          50% { filter: drop-shadow(0 0 12px rgba(74, 222, 128, 0.5)); }
        }
        
        .navbar-logo:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255, 255, 255, 1) !important;
        }
        
        .navbar-button:hover {
          background: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-2px) !important;
        }
        
        .dropdown-item:hover {
          background-color: rgba(157, 178, 191, 0.2) !important;
        }
        
        .logout-item:hover {
          background-color: rgba(255, 107, 107, 0.2) !important;
        }
        
        .brand-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .brand-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s ease-in-out infinite;
          z-index: 1;
        }
        
        .app-name-hover:hover .app-name-main {
          filter: drop-shadow(0 0 12px rgba(255,255,255,0.4)) drop-shadow(0 1px 2px rgba(0,0,0,0.1));
          transition: all 0.3s ease;
        }
        
        .app-name-hover .app-name-main {
          position: relative;
          z-index: 2;
        }
        
        .underline-shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .underline-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 30%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.8), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }

        /* Enhanced Responsive Design */
        @media (max-width: 320px) {
          .brand-wrapper h1 {
            font-size: 1.4rem !important;
          }
          .navbar-button {
            padding: 0.5rem 0.6rem !important;
            font-size: 16px !important;
            min-width: 36px !important;
          }
        }
        
        @media (max-width: 375px) {
          .brand-wrapper h1 {
            font-size: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .brand-wrapper h1 {
            font-size: 1.6rem !important;
          }
        }
        
        @media (max-width: 768px) {
          .brand-wrapper h1 {
            font-size: 1.9rem !important;
          }
        }
        
        @media (min-width: 769px) {
          .brand-wrapper h1 {
            font-size: 2.4rem !important;
          }
        }

        /* Ultra-wide screens */
        @media (min-width: 1200px) {
          .brand-wrapper h1 {
            font-size: 2.6rem !important;
          }
        }

        /* Landscape orientation adjustments */
        @media (max-height: 500px) and (orientation: landscape) {
          nav {
            min-height: 55px !important;
            padding: 0.6rem 1rem !important;
          }
          .brand-wrapper h1 {
            font-size: 1.6rem !important;
          }
          .navbar-button {
            padding: 0.5rem 0.8rem !important;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
          .dropdown {
            border-width: 0.5px !important;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .navbar-logo,
          .navbar-button,
          .dropdown-item,
          .logout-item,
          .brand-wrapper::before,
          .underline-shimmer::after,
          .app-name-accent {
            animation: none !important;
            transition: none !important;
          }
          
          .navbar-logo:hover,
          .navbar-button:hover {
            transform: none !important;
          }
        }

        /* Focus indicators for keyboard navigation */
        .navbar-logo:focus,
        .navbar-button:focus {
          outline: 2px solid #4ade80;
          outline-offset: 2px;
        }

        .dropdown-item:focus,
        .logout-item:focus {
          outline: 2px solid #4ade80;
          outline-offset: -2px;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .dropdown {
            background: rgba(0, 0, 0, 0.95) !important;
            backdrop-filter: blur(15px) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          .dropdown-item,
          .logout-item {
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          .dropdown-link {
            color: #ffffff !important;
          }
          .logout-link {
            color: #ff6b6b !important;
          }
        }
      `}</style>
    </>
  );
}

// ENHANCED RESPONSIVE STYLES - NO BORDER VERSION
const getResponsiveValue = (mobile, tablet, desktop) => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  if (width <= 480) return mobile;
  if (width <= 768) return tablet;
  return desktop;
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getResponsiveValue('0.8rem 1rem', '1rem 1.5rem', '1rem 2rem'),
    background: 'linear-gradient(135deg, #27374d 0%, #526d82 50%, #9db2bf 100%)',
    boxShadow: '0 4px 20px rgba(39, 55, 77, 0.3)',
    position: 'relative',
    width: '100vw',
    zIndex: 1000,
    minHeight: getResponsiveValue('65px', '70px', '75px'),
    boxSizing: 'border-box',
    backdropFilter: 'blur(10px)',
    margin: 0,
    left: 0,
    right: 0
  },

  logoContainer: {
    flex: '0 0 auto',
    minWidth: getResponsiveValue('50px', '55px', '60px')
  },

  logoButton: {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveValue('40px', '45px', '50px'),
    height: getResponsiveValue('40px', '45px', '50px'),
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
    borderRadius: '50%',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)',
    transform: 'scale(1)',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255,255,255,0.4)',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  },

  logoIcon: {
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
  },

  brandContainer: {
    textAlign: 'center',
    flex: '1 1 auto',
    maxWidth: '100%',
    padding: getResponsiveValue('0 0.5rem', '0 1rem', '0 1rem'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0
  },

  brandWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: getResponsiveValue('280px', '350px', '420px')
  },

  appName: {
    fontSize: getResponsiveValue('1.6rem', '1.9rem', '2.4rem'),
    fontWeight: '700',
    margin: 0,
    letterSpacing: getResponsiveValue('0.8px', '1px', '1.2px'),
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    position: 'relative',
    zIndex: 2
  },

  appNameMain: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 30%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
    transition: 'all 0.3s ease'
  },

  appNameAccent: {
    color: '#4ade80',
    marginLeft: '2px',
    fontSize: '1.1em',
    fontWeight: '300',
    filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.3))',
    animation: 'glowPulse 2s ease-in-out infinite'
  },

  tagline: {
    fontSize: getResponsiveValue('0.75rem', '0.8rem', '0.9rem'),
    color: 'rgba(255, 255, 255, 0.85)',
    margin: '6px 0 0 0',
    fontStyle: 'normal',
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
    fontWeight: '400',
    letterSpacing: '0.3px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  },

  underlineContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '8px',
    position: 'relative',
    width: '100%'
  },

  underline: {
    width: getResponsiveValue('80px', '90px', '100px'),
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(74, 222, 128, 0.8) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
    borderRadius: '1px',
    position: 'relative',
    overflow: 'hidden'
  },

  navbarRight: {
    display: 'flex',
    alignItems: 'center',
    flex: '0 0 auto',
    minWidth: getResponsiveValue('50px', '55px', '60px'),
    justifyContent: 'flex-end'
  },

  hamburgerContainer: {
    position: 'relative'
  },

  hamburgerButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '12px',
    padding: getResponsiveValue('0.6rem 0.8rem', '0.65rem 0.9rem', '0.7rem 1rem'),
    fontSize: getResponsiveValue('18px', '19px', '20px'),
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    color: '#ffffff',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    minWidth: getResponsiveValue('40px', '45px', '50px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(157, 178, 191, 0.3)',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(39, 55, 77, 0.3)',
    minWidth: getResponsiveValue('160px', '180px', '200px'),
    zIndex: 1001,
    marginTop: '0.5rem',
    animation: 'fadeIn 0.3s ease',
    overflow: 'hidden'
  },

  dropdownList: {
    listStyle: 'none',
    margin: 0,
    padding: '0.5rem 0'
  },

  dropdownItem: {
    padding: getResponsiveValue('0.7rem 1rem', '0.8rem 1.1rem', '0.9rem 1.2rem'),
    borderBottom: '1px solid rgba(157, 178, 191, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },

  lastDropdownItem: {
    borderBottom: 'none'
  },

  dropdownLink: {
    textDecoration: 'none',
    color: '#27374d',
    fontWeight: '600',
    display: 'block',
    fontSize: getResponsiveValue('0.85rem', '0.9rem', '0.95rem'),
    transition: 'color 0.2s ease'
  },

  logoutItem: {
    padding: getResponsiveValue('0.7rem 1rem', '0.8rem 1.1rem', '0.9rem 1.2rem'),
    borderTop: '1px solid rgba(157, 178, 191, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },

  logoutLink: {
    textDecoration: 'none',
    color: '#e74c3c',
    fontWeight: '600',
    display: 'block',
    fontSize: getResponsiveValue('0.85rem', '0.9rem', '0.95rem'),
    transition: 'color 0.2s ease'
  }
};