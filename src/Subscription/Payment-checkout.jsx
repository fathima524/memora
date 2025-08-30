import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || "monthly";
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  
  // UPI state
  const [upiId, setUpiId] = useState("");
  
  // Net Banking state
  const [bank, setBank] = useState("");

  const handlePayment = (e) => {
    e.preventDefault();
    // Add payment processing logic here
    navigate("/thanks");
  };

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #e8f0f5 0%, #f5f8fa 100%)',
    padding: window.innerWidth <= 768 ? '1rem' : '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  };

  const checkoutCardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(25px)',
    borderRadius: window.innerWidth <= 768 ? '16px' : '24px',
    padding: window.innerWidth <= 768 ? '1.5rem' : '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    maxWidth: '600px',
    width: '100%',
    marginBottom: '2rem'
  };

  const titleStyle = {
    color: '#2c3e50',
    fontSize: window.innerWidth <= 768 ? '1.8rem' : '2.5rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    fontWeight: '700',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const subtitleStyle = {
    color: '#7f8c8d',
    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1.1rem',
    textAlign: 'center',
    marginBottom: '2rem',
    fontWeight: '400',
    lineHeight: '1.4'
  };

  const sectionStyle = {
    marginBottom: '2rem'
  };

  const sectionTitleStyle = {
    color: '#2c3e50',
    fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    borderBottom: '2px solid #e8f0f5',
    paddingBottom: '0.5rem'
  };

  const orderSummaryStyle = {
    background: 'rgba(52, 152, 219, 0.1)',
    borderRadius: window.innerWidth <= 768 ? '12px' : '16px',
    padding: window.innerWidth <= 768 ? '1rem' : '1.5rem',
    marginBottom: '2rem',
    border: '1px solid rgba(52, 152, 219, 0.2)'
  };

  const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem'
  };

  const summaryTotalStyle = {
    ...summaryRowStyle,
    fontWeight: '700',
    fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem',
    color: '#2c3e50',
    borderTop: '2px solid rgba(52, 152, 219, 0.3)',
    paddingTop: '0.5rem',
    marginTop: '1rem',
    marginBottom: '0'
  };

  const radioGroupStyle = {
    display: 'flex',
    gap: window.innerWidth <= 768 ? '0.5rem' : '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
  };

  const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: window.innerWidth <= 768 ? '0.8rem 1rem' : '0.8rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
    fontWeight: '500',
    width: window.innerWidth <= 768 ? '100%' : 'auto'
  };

  const radioInputStyle = {
    margin: 0,
    width: '18px',
    height: '18px'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    color: '#2c3e50',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    width: '100%',
    padding: window.innerWidth <= 768 ? '0.8rem' : '1rem',
    border: '2px solid #e8f0f5',
    borderRadius: '12px',
    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const cardRowStyle = {
    display: 'flex',
    gap: window.innerWidth <= 768 ? '0.5rem' : '1rem',
    marginBottom: '1.5rem',
    flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
  };

  const cardColStyle = {
    flex: 1
  };

  const payButtonStyle = {
    background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    color: 'white',
    border: 'none',
    padding: window.innerWidth <= 768 ? '1rem 1.5rem' : '1.2rem 2rem',
    borderRadius: '16px',
    fontSize: window.innerWidth <= 768 ? '1rem' : '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const [hoveredButton, setHoveredButton] = useState(false);

  const planDetails = {
    monthly: { name: 'Monthly Plan', price: 299, period: 'month' },
    yearly: { name: 'Yearly Plan', price: 2999, period: 'year' }
  };

  const currentPlan = planDetails[selectedPlan];

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <div style={checkoutCardStyle}>
          <h1 style={titleStyle}>Complete Your Payment</h1>
          <p style={subtitleStyle}>Secure checkout powered by industry-standard encryption</p>
          
          {/* Order Summary */}
          <div style={orderSummaryStyle}>
            <h3 style={{...sectionTitleStyle, marginBottom: '1rem', borderBottom: 'none'}}>Order Summary</h3>
            <div style={summaryRowStyle}>
              <span>{currentPlan.name}</span>
              <span>₹{currentPlan.price}</span>
            </div>
            <div style={summaryRowStyle}>
              <span>Taxes & Fees</span>
              <span>₹0</span>
            </div>
            <div style={summaryTotalStyle}>
              <span>Total Amount</span>
              <span>₹{currentPlan.price}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Payment Method</h3>
            <div style={radioGroupStyle}>
              <label 
                style={{
                  ...radioLabelStyle,
                  borderColor: paymentMethod === "card" ? '#3498db' : 'transparent',
                  background: paymentMethod === "card" ? 'rgba(52, 152, 219, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={radioInputStyle}
                />
                💳 Credit/Debit Card
              </label>
              <label 
                style={{
                  ...radioLabelStyle,
                  borderColor: paymentMethod === "upi" ? '#3498db' : 'transparent',
                  background: paymentMethod === "upi" ? 'rgba(52, 152, 219, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={radioInputStyle}
                />
                📱 UPI
              </label>
              <label 
                style={{
                  ...radioLabelStyle,
                  borderColor: paymentMethod === "netbanking" ? '#3498db' : 'transparent',
                  background: paymentMethod === "netbanking" ? 'rgba(52, 152, 219, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                }}
              >
                <input
                  type="radio"
                  value="netbanking"
                  checked={paymentMethod === "netbanking"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={radioInputStyle}
                />
                🏦 Net Banking
              </label>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment}>
            {paymentMethod === "card" && (
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Card Details</h3>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Enter cardholder name"
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={cardRowStyle}>
                  <div style={cardColStyle}>
                    <label style={labelStyle}>Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={cardColStyle}>
                    <label style={labelStyle}>CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>UPI Details</h3>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Net Banking Details</h3>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Select Your Bank</label>
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    style={selectStyle}
                    required
                  >
                    <option value="">Choose your bank</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit"
              style={{
                ...payButtonStyle,
                ...(hoveredButton ? {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px rgba(39, 174, 96, 0.4)',
                  background: 'linear-gradient(135deg, #229954 0%, #27ae60 100%)'
                } : {})
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              Pay ₹{currentPlan.price} Now
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#7f8c8d',
            fontSize: '0.9rem'
          }}>
            🔒 Your payment information is secure and encrypted
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}