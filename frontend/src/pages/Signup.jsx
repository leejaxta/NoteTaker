import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupApi } from "../api/auth.api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Invalid email address";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signupApi({ name, email, password });
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="login-logo">
            <img src="note_taker.png" alt="Logo" className="app-logo" />
            <h1 className="app-title">Notes</h1>
          </div>
          <p className="app-subtitle">Create your account to get started</p>
        </div>

        <div className="signup-card">
          <div className="card-header">
            <h2 className="card-title">Create account</h2>
            <p className="card-subtitle">
              Enter your information to create your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <Input
              label="Full name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {fieldErrors.name && (
              <div className="field-error">{fieldErrors.name}</div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <div className="field-error">{fieldErrors.email}</div>
            )}

            <div className="password-input-wrapper">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {fieldErrors.password && (
              <div className="field-error">{fieldErrors.password}</div>
            )}

            {error && <div className="error-message">{error}</div>}

            <Button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="card-footer">
            <span className="signup-text">Already have an account? </span>
            <Link to="/login" className="signup-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
