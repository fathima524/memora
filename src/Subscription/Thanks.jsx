import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";

export default function Thanks() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/dashboard"); // or "/" for home
  };

  const [hoveredButton, setHoveredButton] = React.useState(false);

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #e8f0f5 0%, #f5f8fa 100%)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  };

  const thanksCardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(25px)',
    borderRadius: '24px',
    padding: '4rem 3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    maxWidth: '600px',
    width: '100%',
    transform: 'translateY(-5px)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };

  const titleStyle = {
    color: '#2c3e50',
    fontSize: '3.5rem',
    marginBottom: '2rem',
    fontWeight: '700',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const messageStyle = {
    color: '#34495e',
    fontSize: '1.3rem',
    marginBottom: '3rem',
    fontWeight: '400',
    lineHeight: '1.6',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    maxWidth: '450px',
    margin: '0 auto 3rem auto'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #6b8caa 0%, #3d4d5d 100%)',
    color: 'white',
    border: 'none',
    padding: '1.5rem 3rem',
    borderRadius: '16px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(107, 140, 170, 0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden',
    minWidth: '200px',
    ...(hoveredButton ? {
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 15px 35px rgba(107, 140, 170, 0.45)',
      background: 'linear-gradient(135deg, #5a7b98 0%, #2a3a4a 100%)',
    } : {})
  };

  const checkmarkStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem auto',
    boxShadow: '0 10px 25px rgba(39, 174, 96, 0.3)',
    position: 'relative'
  };

  const checkmarkIconStyle = {
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: 'bold'
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <div style={thanksCardStyle}>
          <div style={checkmarkStyle}>
            <span style={checkmarkIconStyle}>✓</span>
          </div>
          <h1 style={titleStyle}>Thank You!</h1>
          <p style={messageStyle}>
            Your payment was successful. Your subscription is now active and you can start enjoying all the premium features.
          </p>
          <button
            style={buttonStyle}
            onClick={handleGoToDashboard}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}