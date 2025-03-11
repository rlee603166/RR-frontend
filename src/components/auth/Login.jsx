import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import "../../styles/Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, googleAuth, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/dashboard";

    useEffect(() => {
        // If user is already logged in, redirect
        if (currentUser) {
            navigate(from);
        }
    }, [currentUser, navigate, from]);

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate(from);
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to sign in. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async credentialResponse => {
        try {
            setError("");
            setLoading(true);
            await googleAuth(credentialResponse.credential);
            navigate(from);
        } catch (error) {
            setError("Google authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google authentication failed. Please try again or use email login.");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to analyze your golf swing</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="auth-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
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
                        text="signin_with"
                        shape="rectangular"
                        width="100%"
                    />
                </div>

                <div className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="auth-link">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
