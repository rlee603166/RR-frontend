import { useEffect, useState, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../styles/Upload.css";

function Upload({ setProcessID, setDifference, setBackVideo, setFrontVideo, setFetchAble }) {
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);
    const [frontGifUrl, setFrontGifUrl] = useState(null);
    const [backGifUrl, setBackGifUrl] = useState(null);
    const [frontURL, setFrontURL] = useState(null);
    const [backURL, setBackURL] = useState(null);
    const [frontTime, setFrontTime] = useState(0);
    const [backTime, setBackTime] = useState(0);
    const [frontDuration, setFrontDuration] = useState(0);
    const [backDuration, setBackDuration] = useState(0);
    const [frontSlider, setFrontSlider] = useState(false);
    const [backSlider, setBackSlider] = useState(false);
    const [open, setOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [analysisStage, setAnalysisStage] = useState("");

    const frontVideoRef = useRef(null);
    const backVideoRef = useRef(null);
    const frontRangeRef = useRef(null);
    const backRangeRef = useRef(null);

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const url = "http://127.0.0.1:5000/";

    const handleFrontFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setFront(file);
            const url = URL.createObjectURL(file);
            setFrontURL(url);

            if (frontVideoRef.current) {
                frontVideoRef.current.src = url;
                frontVideoRef.current.addEventListener("loadedmetadata", () => {
                    setFrontDuration(frontVideoRef.current.duration);
                });
            }
        }
    };

    // Handle file selection for back view
    const handleBackFileChange = e => {
        const file = e.target.files[0];
        if (file) {
            setBack(file);
            const url = URL.createObjectURL(file);
            setBackURL(url);

            if (backVideoRef.current) {
                backVideoRef.current.src = url;
                backVideoRef.current.addEventListener("loadedmetadata", () => {
                    setBackDuration(backVideoRef.current.duration);
                });
            }
        }
    };

    const handleFrontTimeChange = e => {
        const newTime = parseFloat(e.target.value);
        setFrontTime(newTime);
        if (frontVideoRef.current) {
            frontVideoRef.current.currentTime = newTime;
        }
    };

    const handleBackTimeChange = e => {
        const newTime = parseFloat(e.target.value);
        setBackTime(newTime);
        if (backVideoRef.current) {
            backVideoRef.current.currentTime = newTime;
        }
    };

    const toggleFrontPlay = () => {
        if (frontVideoRef.current) {
            if (frontVideoRef.current.paused) {
                frontVideoRef.current.play();
            } else {
                frontVideoRef.current.pause();
            }
        }
    };

    const toggleBackPlay = () => {
        if (backVideoRef.current) {
            if (backVideoRef.current.paused) {
                backVideoRef.current.play();
            } else {
                backVideoRef.current.pause();
            }
        }
    };

    const handleFrontTimeUpdate = () => {
        if (frontVideoRef.current && frontRangeRef.current) {
            setFrontTime(frontVideoRef.current.currentTime);
            frontRangeRef.current.value = frontVideoRef.current.currentTime;
        }
    };

    const handleBackTimeUpdate = () => {
        if (backVideoRef.current && backRangeRef.current) {
            setBackTime(backVideoRef.current.currentTime);
            backRangeRef.current.value = backVideoRef.current.currentTime;
        }
    };

    const handleClear = () => {
        setFront(null);
        setBack(null);
        setFrontGifUrl(null);
        setBackGifUrl(null);
        setFrontURL(null);
        setBackURL(null);
        setFrontTime(0);
        setBackTime(0);
        setFrontSlider(false);
        setBackSlider(false);

        if (frontVideoRef.current) {
            frontVideoRef.current.src = "";
        }
        if (backVideoRef.current) {
            backVideoRef.current.src = "";
        }
    };

    const simulateUploadProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 500);

        return () => clearInterval(interval);
    };

    const simulateAnalysisStages = () => {
        const stages = [
            "Uploading videos...",
            "Analyzing front swing...",
            "Analyzing back swing...",
            "Detecting key points...",
            "Building 3D model...",
            "Comparing with Rory McIlroy...",
            "Generating recommendations...",
        ];

        let currentStage = 0;

        const interval = setInterval(() => {
            setAnalysisStage(stages[currentStage]);
            currentStage++;

            if (currentStage >= stages.length) {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    };

    const handleSubmit = async () => {
        let upload_url = url + "upload";
        if (!front && !back) {
            alert("Please select both front and back view videos!");
            return;
        }

        if (setDifference) setDifference(frontTime - backTime);
        handleOpen();

        const cleanup1 = simulateUploadProgress();
        const cleanup2 = simulateAnalysisStages();

        const formData = new FormData();
        formData.append("file", front);
        formData.append("file", back);
        formData.append("front_impact_time", frontTime / frontDuration);
        formData.append("back_impact_time", backTime / backDuration);
        formData.append("user_id", currentUser?.uid || "anonymous");
        saveToLocal();

        if (setDifference) setDifference(frontTime - backTime);

        try {
            const response = await fetch(upload_url, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.process_id);
                if (setProcessID) setProcessID(data.process_id);
                handleClose();
                if (setFetchAble) setFetchAble(true);

                // Navigate to analysis page if used independently
                if (!setProcessID) {
                    navigate("/analysis", {
                        state: {
                            processId: data.process_id,
                            frontVideo: frontURL,
                            backVideo: backURL,
                            difference: frontTime - backTime,
                        },
                    });
                }
            } else {
                alert("File upload failed. Please try again.");
                handleClose();
            }
        } catch (error) {
            console.log(error);
            alert("Error uploading file. Please check your connection and try again.");
            handleClose();
        }

        cleanup1();
        cleanup2();
    };

    const saveToLocal = () => {
        localStorage.setItem("frontUrl", frontURL);
        localStorage.setItem("backUrl", backURL);
    };

    const handleClose = () => {
        setOpen(false);
        setUploadProgress(0);
        setAnalysisStage("");
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div className="upload-container">
            <div className="upload-card-container">
                <div className="upload-card front">
                    <h3>Front View Video</h3>
                    <div className="video-preview">
                        {frontURL ? (
                            <video
                                ref={frontVideoRef}
                                src={frontURL}
                                onTimeUpdate={handleFrontTimeUpdate}
                                onClick={toggleFrontPlay}
                                muted
                            ></video>
                        ) : (
                            <div className="upload-placeholder">
                                <i className="fas fa-video"></i>
                                <p>Upload Front View</p>
                            </div>
                        )}
                    </div>

                    <div className="video-controls">
                        <input
                            type="file"
                            id="front-video"
                            accept="video/*"
                            onChange={handleFrontFileChange}
                            className="file-input"
                        />
                        <label htmlFor="front-video" className="file-label">
                            {frontURL ? "Change Video" : "Select Video"}
                        </label>

                        {frontURL && frontDuration > 0 && (
                            <div className="time-slider">
                                <div className="time-label">Select impact moment:</div>
                                <input
                                    ref={frontRangeRef}
                                    type="range"
                                    min="0"
                                    max={frontDuration}
                                    step="0.01"
                                    value={frontTime}
                                    onChange={handleFrontTimeChange}
                                    className="time-range"
                                />
                                <div className="time-display">{frontTime.toFixed(2)}s</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="upload-card back">
                    <h3>Back View Video</h3>
                    <div className="video-preview">
                        {backURL ? (
                            <video
                                ref={backVideoRef}
                                src={backURL}
                                onTimeUpdate={handleBackTimeUpdate}
                                onClick={toggleBackPlay}
                                muted
                            ></video>
                        ) : (
                            <div className="upload-placeholder">
                                <i className="fas fa-video"></i>
                                <p>Upload Back View</p>
                            </div>
                        )}
                    </div>

                    <div className="video-controls">
                        <input
                            type="file"
                            id="back-video"
                            accept="video/*"
                            onChange={handleBackFileChange}
                            className="file-input"
                        />
                        <label htmlFor="back-video" className="file-label">
                            {backURL ? "Change Video" : "Select Video"}
                        </label>

                        {backURL && backDuration > 0 && (
                            <div className="time-slider">
                                <div className="time-label">Select impact moment:</div>
                                <input
                                    ref={backRangeRef}
                                    type="range"
                                    min="0"
                                    max={backDuration}
                                    step="0.01"
                                    value={backTime}
                                    onChange={handleBackTimeChange}
                                    className="time-range"
                                />
                                <div className="time-display">{backTime.toFixed(2)}s</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="upload-instructions">
                <h3>How to get the best results:</h3>
                <ul>
                    <li>Record both front-facing and side views of your swing</li>
                    <li>Ensure good lighting and a clear view of your full body</li>
                    <li>Move the slider to precisely mark the impact moment in each video</li>
                    <li>Wear form-fitting clothes for better pose detection</li>
                </ul>
            </div>

            <div className="upload-actions">
                <button
                    className="action-button analyze"
                    onClick={handleSubmit}
                    disabled={!front || !back}
                >
                    <i className="fas fa-golf-ball"></i> Analyze My Swing
                </button>
                <button
                    className="action-button clear"
                    onClick={handleClear}
                    disabled={!front && !back}
                >
                    <i className="fas fa-trash"></i> Clear Videos
                </button>
            </div>

            <Backdrop
                sx={theme => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                    display: "flex",
                    flexDirection: "column",
                    backdropFilter: "blur(5px)",
                })}
                open={open}
            >
                <div className="analysis-progress">
                    <h2>{analysisStage || "Preparing analysis..."}</h2>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p>{uploadProgress}% complete</p>
                    <CircularProgress color="inherit" size={60} />
                </div>
            </Backdrop>
        </div>
    );
}

export default Upload;
