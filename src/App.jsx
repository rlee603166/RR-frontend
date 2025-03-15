import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Upload from "./components/Upload";
import PoseView from "./components/PoseView";
import Landing from "./components/Landing";
import Playground from "./components/Playground";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/index.css";

function App() {
    const [processID, setProcessID] = useState(null);
    const [difference, setDifference] = useState(0);
    const [fetchAble, setFetchAble] = useState(false);
    const [frontVideo, setFrontVideo] = useState(0);
    const [backVideo, setBackVideo] = useState(0);

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <Router>
                <AuthProvider>
                    <div className="app-container">
                        <Navbar />
                        <div className="content-container">
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/playground" element={<Playground />} />

                                <Route
                                    path="/upload"
                                    element={
                                        <ProtectedRoute>
                                            <Upload
                                                setProcessID={setProcessID}
                                                setDifference={setDifference}
                                                setBackVideo={setBackVideo}
                                                setFrontVideo={setFrontVideo}
                                                setFetchAble={setFetchAble}
                                            />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/analysis"
                                    element={
                                        <PoseView
                                            frontVideo={frontVideo}
                                            backVideo={backVideo}
                                            processID={processID}
                                            difference={difference}
                                            fetchAble={fetchAble}
                                            setFetchAble={setFetchAble}
                                        />
                                    }
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </div>
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
