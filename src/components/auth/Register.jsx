import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "../../styles/Auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, googleAuth, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (currentUser) {
            navigate("/dashboard");
        }
    }, [currentUser, navigate]);

    const validatePassword = () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!validatePassword()) return;

        try {
            setError("");
            setLoading(true);
            await register(email, password, name);
            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create an account");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async credentialResponse => {
        try {
            setError("");
            setLoading(true);
            await googleAuth(credentialResponse.credential);
            navigate("/dashboard");
        } catch (error) {
            setError("Google authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google authentication failed. Please try again or use email registration.");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join Rory Rater to improve your golf swing</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <div className="terms-privacy">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms" className="auth-link">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="auth-link">
                            Privacy Policy
                        </Link>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <div className="social-login">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_blue"
                        text="signup_with"
                        shape="rectangular"
                        width="100%"
                    />
                </div>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
