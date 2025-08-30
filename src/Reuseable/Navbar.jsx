import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Theme colors based on the provided palette
  const theme = {
    primary: '#27374d',
    secondary: '#526d82',
    tertiary: '#9db2bf',
    light: '#dde6ed',
    white: '#ffffff',
    text: '#2c3e50',
    background: '#ffffff'
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.tertiary} 100%)`,
    boxShadow: '0 4px 20px rgba(39, 55, 77, 0.3)',
    position: 'relative',
    width: '100%',
    zIndex: 1000,
    minHeight: '60px',
    boxSizing: 'border-box'
  };

  const logoStyle = {
    fontSize: '32px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
    transition: 'transform 0.3s ease'
  };

  const appNameStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: theme.white,
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    letterSpacing: '1px'
  };

  const taglineStyle = {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: '2px 0 0 0',
    fontStyle: 'italic',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  };

  const navbarRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const buttonStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    color: theme.white
  };

  const hamburgerMenuStyle = {
    position: 'relative'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: theme.background,
    border: `1px solid ${theme.tertiary}`,
    borderRadius: '8px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    minWidth: '180px',
    zIndex: 1001,
    marginTop: '0.5rem',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.3s ease'
  };

  const dropdownListStyle = {
    listStyle: 'none',
    margin: 0,
    padding: '0.5rem 0'
  };

  const dropdownItemStyle = {
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${theme.light}`,
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  };

  const dropdownLinkStyle = {
    textDecoration: 'none',
    color: theme.text,
    fontWeight: '500',
    display: 'block',
    fontSize: '0.95rem'
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Study', path: '/flashcard' },
    
  ];

  return (
    <div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav style={navbarStyle}>
        {/* Left Side: Logo */}
        <div style={logoStyle}>
          <div 
            style={{ 
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)',
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
              border: '2px solid rgba(255,255,255,0.4)'
            }}
            onClick={() => handleNavigation('/dashboard')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)';
            }}
          >
            <svg 
              width="26" 
              height="26" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
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

        {/* Center: App Name and Tagline */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={appNameStyle}>Flash-doc</h1>
          <p style={taglineStyle}>Your one-stop platform for all medical exams</p>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            margin: '2px auto 0',
            borderRadius: '1px'
          }}></div>
        </div>

        {/* Right Side: Hamburger Menu */}
        <div style={navbarRightStyle}>
          <div style={hamburgerMenuStyle}>
            <button 
              onClick={toggleDropdown}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ☰
            </button>
            
            {isDropdownOpen && (
              <div style={dropdownStyle}>
                <ul style={dropdownListStyle}>
                  {menuItems.map((item, index) => (
                    <li 
                      key={index}
                      style={{
                        ...dropdownItemStyle,
                        borderBottom: index === menuItems.length - 1 ? 'none' : `1px solid ${theme.light}`
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = theme.tertiary + '20'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div style={dropdownLinkStyle}>
                        {item.label}
                      </div>
                    </li>
                  ))}
                  <li 
                    style={{
                      ...dropdownItemStyle,
                      borderBottom: 'none',
                      borderTop: `1px solid ${theme.light}`
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#ff6b6b20'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    onClick={handleLogout}
                  >
                    <div style={{...dropdownLinkStyle, color: '#e74c3c'}}>
                      Logout
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}