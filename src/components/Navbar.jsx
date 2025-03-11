import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        // Close mobile menu when route changes
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="Rory Rater Logo" className="logo-image" />
                    <span className="logo-text">Rory Rater</span>
                </Link>

                <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"} />
                </div>

                <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
                    <li className="nav-item">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/playground"
                            className={`nav-link ${location.pathname === "/playground" ? "active" : ""}`}
                        >
                            Playground
                        </Link>
                    </li>
                    {currentUser && (
                        <>
                            <li className="nav-item">
                                <Link
                                    to="/upload"
                                    className={`nav-link ${location.pathname === "/upload" ? "active" : ""}`}
                                >
                                    Analyze Swing
                                </Link>
                            </li>
                            {/* Additional nav items can be added here */}
                            <li className="nav-item user-menu">
                                <div className="user-avatar">
                                    {currentUser.photoURL ? (
                                        <img
                                            src={currentUser.photoURL}
                                            alt="User"
                                            className="avatar-image"
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {currentUser.displayName?.charAt(0) ||
                                                currentUser.email?.charAt(0) ||
                                                "?"}
                                        </div>
                                    )}
                                    <span className="user-name">
                                        {currentUser.displayName || currentUser.email}
                                    </span>
                                </div>
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="dropdown-item logout-button"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </>
                    )}
                    {!currentUser && (
                        <>
                            <li className="nav-item">
                                <Link
                                    to="/login"
                                    className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                                >
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link signup">
                                    Sign Up
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
