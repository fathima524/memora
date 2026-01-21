import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../supabase/auth';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Profile', path: '/profilepage', icon: <User size={18} /> },
  ];

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/update-password'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <nav className={`memora-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🩺</span>
          <span className="logo-text">Memora</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}


          <button onClick={handleLogout} className="nav-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-item ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <div className="item-left">
                {link.icon}
                <span>{link.label}</span>
              </div>
              <ChevronRight size={16} />
            </Link>
          ))}


          <div className="mobile-divider"></div>
          <button onClick={handleLogout} className="mobile-logout-btn">
            <LogOut size={18} />
            <span>Logout from Session</span>
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .memora-navbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 2rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .memora-navbar.scrolled {
          padding: 1.5rem 2rem;
          background: transparent;
          backdrop-filter: none;
          border-bottom: none;
          box-shadow: none;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: transform 0.2s;
        }

        .nav-logo:hover { transform: scale(1.02); }

        .logo-icon { font-size: 1.5rem; }
        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: -1px;
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.5rem;
          border-radius: 99px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: 99px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .nav-item:hover, .support-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-item.active {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }


        .nav-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: 99px;
          color: #ef4444;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s;
          font-family: inherit;
        }

        .nav-logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
        }

        .nav-mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0f172a;
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 8rem 2rem 2rem;
        }

        .nav-mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s;
        }

        .mobile-nav-item.active {
          background: rgba(37, 99, 235, 0.1);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }
        

        .item-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 1rem 0;
        }

        .mobile-logout-btn {
          padding: 1.25rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 20px;
          color: #ef4444;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          font-family: inherit;
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-mobile-toggle { display: flex; }
          .memora-navbar { padding: 1rem 1.5rem; }
        }
      `}</style>
    </nav>
  );
}