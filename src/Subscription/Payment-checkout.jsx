import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Reuseable/Navbar";
import Footer from "../Reuseable/Footer";

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || "monthly";
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [loading, setLoading] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      navigate("/thanks");
    }, 2000);
  };

  const planDetails = {
    monthly: { name: 'Monthly Pro', price: 299, period: 'month' },
    yearly: { name: 'Yearly Pro', price: 2499, period: 'year' }
  };

  const currentPlan = planDetails[selectedPlan];

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-container">
        <div className="mesh-bg"></div>

        <div className="checkout-wrapper">
          <div className="checkout-form-section">
            <header className="checkout-header">
              <h1>Complete Upgrade</h1>
              <p>Securely finalize your subscription to Memora Pro.</p>
            </header>

            <div className="payment-methods">
              <button
                className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span className="icon">💳</span> Card
              </button>
              <button
                className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <span className="icon">📱</span> UPI
              </button>
              <button
                className={`method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <span className="icon">🏦</span> Bank
              </button>
            </div>

            <form onSubmit={handlePayment} className="actual-form">
              {paymentMethod === 'card' && (
                <div className="card-fields animate-fade-in">
                  <div className="input-group">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="Dr. Jane Smith" required />
                  </div>
                  <div className="input-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="xxxx xxxx xxxx xxxx" required />
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Expiry</label>
                      <input type="text" placeholder="MM/YY" required />
                    </div>
                    <div className="input-group">
                      <label>CVV</label>
                      <input type="password" placeholder="***" required />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-fields animate-fade-in">
                  <div className="input-group">
                    <label>UPI ID</label>
                    <input type="text" placeholder="doctor@okaxis" required />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bank-fields animate-fade-in">
                  <div className="input-group">
                    <label>Select Bank</label>
                    <select required>
                      <option value="">Choose bank...</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>SBI</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" className="btn-pay" disabled={loading}>
                {loading ? <span className="loader"></span> : `Pay ₹${currentPlan.price}`}
              </button>
            </form>
          </div>

          <aside className="order-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>{currentPlan.name}</span>
                <span>₹{currentPlan.price}</span>
              </div>
              <div className="summary-row">
                <span>Platform Fee</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{currentPlan.price}</span>
              </div>
            </div>

            <div className="security-badge">
              <span className="icon">🔒</span>
              <p>256-bit SSL Encrypted Payment</p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .checkout-page {
          min-height: 100vh;
          background: #0f172a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: white;
        }

        .checkout-container {
          position: relative;
          padding: 8rem 2rem 4rem;
          min-height: calc(100vh - 80px);
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        .mesh-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: 
            radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.05) 0%, transparent 50%);
          z-index: 1;
        }

        .checkout-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
        }

        .checkout-form-section {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
          padding: 3.5rem;
        }

        .checkout-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }

        .checkout-header p {
          color: #94a3b8;
          margin-bottom: 2.5rem;
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .method-btn {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: #94a3b8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .method-btn.active {
          background: rgba(37, 99, 235, 0.1);
          border-color: #2563eb;
          color: white;
        }

        .actual-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .input-group input, .input-group select {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 14px;
          color: white;
          outline: none;
          font-family: inherit;
          transition: all 0.2s;
        }

        .input-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .btn-pay {
          background: #2563eb;
          color: white;
          padding: 1.25rem;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.125rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 1rem;
        }

        .btn-pay:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
        }

        .order-summary-box {
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
          padding: 2.5rem;
          height: fit-content;
        }

        .order-summary-box h3 {
          font-size: 1.25rem;
          margin-bottom: 2rem;
        }

        .summary-details {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
        }

        .summary-row.total {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.25rem;
          font-weight: 700;
          color: white;
          font-size: 1.25rem;
        }

        .free { color: #22c55e; font-weight: 700; }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
          color: #64748b;
          font-size: 0.875rem;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .loader {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 968px) {
          .checkout-wrapper { grid-template-columns: 1fr; }
          .checkout-form-section { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}