import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      console.log('OTP verified:', otp);
      // ✅ Redirect to Complete Profile page
      navigate('/complete-profile');
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  };

  const handleResendOtp = (e) => {
    e.preventDefault();
    console.log('Resending OTP...');
  };

  return (
    <div className="otp-page">
      <div className="otp-box">
        <h1 className="otp-title">Verify OTP</h1>
        <div className="otp-form">
          <label className="otp-label">Enter OTP</label>
          <input
            type="text"
            placeholder="Enter the 6-digit OTP sent to your phone"
            className="otp-input"
            value={otp}
            onChange={handleOtpChange}
            maxLength="6"
          />
          <button type="button" className="otp-button" onClick={handleSubmit}>
            Verify OTP
          </button>
        </div>
        <p className="otp-footer">
          Didn't receive the OTP?{" "}
          <a href="#" className="otp-resend" onClick={handleResendOtp}>
            Resend OTP
          </a>
        </p>
      </div>


      <style>{`
        .otp-page {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 40%, #8b9da9 70%, #e8eaec 100%);
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: "Inter", "Segoe UI", "Roboto", sans-serif;
          margin: 0;
          box-sizing: border-box;
        }

        .otp-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 40px rgba(60, 75, 92, 0.3), 0 8px 16px rgba(60, 75, 92, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .otp-title {
          font-size: 28px;
          font-weight: 700;
          color: #3c4b5c;
          text-align: center;
          margin-bottom: 30px;
          letter-spacing: -0.5px;
        }

        .otp-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .otp-label {
          font-size: 14px;
          font-weight: 600;
          color: #5a6b7a;
          margin-bottom: 8px;
          display: block;
        }

        .otp-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e8eaec;
          border-radius: 12px;
          font-size: 16px;
          color: #3c4b5c;
          background-color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
          letter-spacing: 2px;
          text-align: center;
          font-weight: 600;
        }

        .otp-input:focus {
          border-color: #5a6b7a;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(90, 107, 122, 0.1);
        }

        .otp-input::placeholder {
          letter-spacing: 0.5px;
          text-align: center;
        }

        .otp-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3c4b5c 0%, #5a6b7a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .otp-button:hover {
          background: linear-gradient(135deg, #2a3642 0%, #485460 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(60, 75, 92, 0.4);
        }

        .otp-footer {
          text-align: center;
          font-size: 14px;
          color: #8b9da9;
          margin: 20px 0 0 0;
        }

        .otp-resend {
          color: #5a6b7a;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .otp-resend:hover {
          color: #3c4b5c;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .otp-page {
            padding: 15px;
            min-height: 100vh;
            min-height: 100dvh; /* For mobile browsers */
          }
          
          .otp-box {
            padding: 40px 30px;
            max-width: 95%;
            width: 100%;
          }
          
          .otp-title {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .otp-page {
            padding: 10px;
          }
          
          .otp-box {
            padding: 30px 20px;
            max-width: 100%;
            border-radius: 15px;
          }
          
          .otp-title {
            font-size: 22px;
            margin-bottom: 25px;
          }
          
          .otp-input {
            padding: 14px;
            font-size: 16px;
          }
          
          .otp-button {
            padding: 14px;
            font-size: 16px;
          }
        }

        @media (max-width: 320px) {
          .otp-box {
            padding: 25px 15px;
            border-radius: 12px;
          }
          
          .otp-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}