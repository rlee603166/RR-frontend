import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import backgroundImage from "../assets/rory-back.jpg";
import seanFront from "../assets/sean-front.gif";
import seanBack from "../assets/sean-back.gif";
import "../styles/Landing.css";
import Upload from "./Upload";

function Landing() {
    const { currentUser } = useAuth();
    const [showFeatures, setShowFeatures] = useState(false);

    return (
        <div className="landing-container">
            <section className="hero-section">
                <div className="hero-image-container">
                    <img src={backgroundImage} alt="Golf course" className="hero-background" />
                </div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="gradient-text">Perfect Your Swing</span>
                        <span className="with-ai">with AI Technology</span>
                        <p className="hero-subtitle">
                            Compare your golf swing with Rory McIlroy using advanced 3D pose
                            detection
                        </p>
                    </h1>
                    <div className="hero-cta">
                        {currentUser ? (
                            <Link to="/upload" className="cta-button primary">
                                Analyze My Swing
                            </Link>
                        ) : (
                            <Link to="/register" className="cta-button primary">
                                Get Started
                            </Link>
                        )}
                        <button
                            className="cta-button secondary"
                            onClick={() => setShowFeatures(true)}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
            <section className="how-it-works">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Upload Your Swing</h3>
                        <p>Upload front and side view videos of your golf swing</p>
                        <div className="image-container">
                            <img src={seanFront} className="step-image" />
                            <img src={seanBack} className="step-image" />
                        </div>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>AI Analysis</h3>
                        <p>Our AI creates a 3D model and analyzes your technique</p>
                        <img src="/rotation2.gif" alt="AI analysis" className="step-image" />
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Compare & Improve</h3>
                        <p>See your swing side-by-side with Rory McIlroy's perfect form</p>
                        <img src="/poseview.gif" alt="Comparison view" className="step-image" />
                    </div>
                </div>
            </section>
            <section className="features-section" id="features">
                <h2 className="section-title">Advanced Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🏌️</div>
                        <h3>3D Visualization</h3>
                        <p>View your swing from any angle with our interactive 3D model</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Detailed Metrics</h3>
                        <p>Get precise measurements of angles, speed, and positioning</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Frame-by-Frame</h3>
                        <p>Analyze every moment of your swing in slow motion</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Mobile Friendly</h3>
                        <p>Upload and view results on any device</p>
                    </div>
                </div>
            </section>
            {/*   <section className="testimonials-section">
                <h2 className="section-title">What Golfers Are Saying</h2>
                <div className="testimonials-container">
                    <div className="testimonial-card">
                        <p>
                            "Rory Rater helped me identify flaws in my swing I never knew existed.
                            My handicap improved by 3 strokes in just one month!"
                        </p>
                        <div className="testimonial-author">- Michael S., 12 Handicap</div>
                    </div>
                    <div className="testimonial-card">
                        <p>
                            "The side-by-side comparison with Rory's swing was eye-opening. Now I
                            know exactly what to work on with my coach."
                        </p>
                        <div className="testimonial-author">- Sarah T., Golf Instructor</div>
                    </div>
                    <div className="testimonial-card">
                        <p>
                            "I've tried many swing analysis tools, but the 3D visualization in Rory
                            Rater is next level. Worth every penny."
                        </p>
                        <div className="testimonial-author">- James K., Amateur Golfer</div>
                    </div>
                </div>
            </section> 
            <section className="cta-section">
                <h2>Ready to Swing Like Rory?</h2>
                <p>Join thousands of golfers improving their game with AI technology</p>
                {currentUser ? (
                    <Link to="/upload" className="cta-button primary large">
                        Analyze My Swing Now
                    </Link>
                ) : (
                    <Link to="/register" className="cta-button primary large">
                        Sign Up For Free
                    </Link>
                )}
            </section> */}
            {/*{currentUser && (*/}
            <section className="upload-section" id="upload">
                <h2 className="section-title">Upload Your Swing</h2>
                <Upload />
            </section>
            {/*)}*/}
        </div>
    );
}

export default Landing;
