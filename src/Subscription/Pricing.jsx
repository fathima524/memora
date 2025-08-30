import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";

export default function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fromFreeTrial, sessionData, message } = location.state || {};

  const handleSelectPlan = (plan) => {
    console.log(`Selected plan: ${plan}`);
    // Pass the plan as state to the checkout page
    navigate("/payment-checkout", { state: { plan } });
  };

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

  const titleStyle = {
    color: '#2c3e50',
    fontSize: '3rem',
    marginBottom: fromFreeTrial ? '1rem' : '3rem',
    textAlign: 'center',
    fontWeight: '700',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1,
    letterSpacing: '-0.02em'
  };

  const messageStyle = {
    background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    color: 'white',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3)',
    maxWidth: '600px'
  };

  const sessionStatsStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1rem',
    maxWidth: '500px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
  };

  const statItemStyle = {
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#27374d',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    fontSize: '0.9rem',
    color: '#526d82',
    fontWeight: '500'
  };

  const plansGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '700px',
    width: '100%',
    zIndex: 1
  };

  const planCardStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(25px)',
    borderRadius: '24px',
    padding: '3rem 2.5rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    minHeight: '280px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const planCardHoverStyle = {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 15px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
    background: 'rgba(255, 255, 255, 0.95)',
  };

  const planTitleStyle = {
    color: '#2c3e50',
    fontSize: '2.2rem',
    marginBottom: '1rem',
    fontWeight: '600',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  const planPriceStyle = {
    color: '#34495e',
    fontSize: '1.6rem',
    marginBottom: '2rem',
    fontWeight: '400',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
  };

  const planButtonStyle = {
    background: 'linear-gradient(135deg, #6b8caa 0%, #3d4d5d 100%)',
    color: 'white',
    border: 'none',
    padding: '1.4rem 2.5rem',
    borderRadius: '16px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    boxShadow: '0 10px 30px rgba(107, 140, 170, 0.35)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden'
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredButton, setHoveredButton] = React.useState(null);

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        {fromFreeTrial && (
          <>
            <div style={messageStyle}>
              {message || "Great job! Upgrade to access unlimited questions and all subjects."}
            </div>
            {sessionData && (
              <div style={sessionStatsStyle}>
                <div style={statItemStyle}>
                  <div style={statNumberStyle}>{sessionData.score}</div>
                  <div style={statLabelStyle}>Correct</div>
                </div>
                <div style={statItemStyle}>
                  <div style={statNumberStyle}>{sessionData.totalQuestions}</div>
                  <div style={statLabelStyle}>Total</div>
                </div>
                <div style={statItemStyle}>
                  <div style={statNumberStyle}>{Math.floor(sessionData.timeSpent / 60)}</div>
                  <div style={statLabelStyle}>Minutes</div>
                </div>
                <div style={statItemStyle}>
                  <div style={statNumberStyle}>{sessionData.streak}</div>
                  <div style={statLabelStyle}>Streak</div>
                </div>
              </div>
            )}
          </>
        )}
        
        <h1 style={titleStyle}>Choose Your Plan</h1>
        <div style={plansGridStyle}>
          <div
            style={{
              ...planCardStyle,
              ...(hoveredCard === "monthly" ? planCardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredCard("monthly")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <h2 style={planTitleStyle}>Monthly</h2>
              <p style={planPriceStyle}>₹299 per month</p>
            </div>
            <button
              style={{
                ...planButtonStyle,
                ...(hoveredButton === "monthly"
                  ? {
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 15px 35px rgba(107, 140, 170, 0.45)",
                      background:
                        "linear-gradient(135deg, #5a7b98 0%, #2a3a4a 100%)",
                    }
                  : {}),
              }}
              onClick={() => handleSelectPlan("monthly")}
              onMouseEnter={() => setHoveredButton("monthly")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Select Monthly
            </button>
          </div>

          <div
            style={{
              ...planCardStyle,
              ...(hoveredCard === "yearly" ? planCardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredCard("yearly")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <h2 style={planTitleStyle}>Yearly</h2>
              <p style={planPriceStyle}>₹2999 per year</p>
            </div>
            <button
              style={{
                ...planButtonStyle,
                ...(hoveredButton === "yearly"
                  ? {
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 15px 35px rgba(107, 140, 170, 0.45)",
                      background:
                        "linear-gradient(135deg, #5a7b98 0%, #2a3a4a 100%)",
                    }
                  : {}),
              }}
              onClick={() => handleSelectPlan("yearly")}
              onMouseEnter={() => setHoveredButton("yearly")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Select Yearly
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}