import React, { useState, useRef, useEffect } from "react";
import "../styles/VerifyOtp.css";
import { useNavigate } from "react-router-dom";
import { resendOtp, signupWithOtp } from "../api/auth.api";
import Toast from "../components/common/Toast";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    const newOtp = [...otpValues];

    if (value) {
      newOtp[index] = value;
      setOtpValues(newOtp);
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = "";
      setOtpValues(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otpValues];

      if (otpValues[index]) {
        newOtp[index] = "";
        setOtpValues(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < pasteData.length && i < newOtp.length; i++) {
      newOtp[i] = pasteData[i];
      if (inputRefs.current[i]) inputRefs.current[i].value = pasteData[i];
    }
    setOtpValues(newOtp);

    const lastIndex = Math.min(pasteData.length, inputRefs.current.length) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otp = otpValues.join("");
    try {
      await signupWithOtp({ otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (isResending || resendCooldown > 0) return;
    setIsResending(true);

    try {
      await resendOtp();
      setResendMessage({
        message: "A new OTP has been sent to your email.",
        type: "success",
      });
      setResendCooldown(30);
      setTimeout(() => setResendMessage(null), 3000);
    } catch (err) {
      setResendMessage(err.response?.data?.message || "Failed to resend OTP");
      setTimeout(() => setResendMessage(null), 3000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-title">Verify Your Email</h2>
      <p className="otp-subtitle">Enter the 6-digit OTP sent to your email</p>

      {error && <div className="otp-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="otp-inputs">
          {otpValues.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        <button type="submit" className="otp-button">
          Verify OTP
        </button>
      </form>

      <div className="otp-resend">
        <button
          className="otp-resend-button"
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : isResending
            ? "Resending..."
            : "Resend OTP"}
        </button>
      </div>
      {resendMessage && (
        <Toast
          message={resendMessage.message}
          type={resendMessage.type}
          onClose={() => setResendMessage(null)}
        />
      )}
    </div>
  );
};

export default VerifyOtp;
