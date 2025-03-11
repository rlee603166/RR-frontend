import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Divider,
    IconButton,
    Tabs,
    Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { GoogleLogin } from "@react-oauth/google";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(4),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(2, 4, 3),
    },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#fff",
    color: "#757575",
    textTransform: "none",
    padding: "10px 16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    fontWeight: 500,
    "&:hover": {
        backgroundColor: "#f9f9f9",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    },
}));

const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

function AuthModal({ open, onClose, onLoginSuccess }) {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setError("");
    };

    const handleGoogleLogin = credentialResponse => {
        // In a real application, you would send this token to your server
        // for verification and to create a session
        console.log("Google login successful", credentialResponse);

        // For demo purposes, we'll simulate a successful login
        const mockUserResponse = {
            clientId: credentialResponse.clientId || "google-user-123",
            profileObj: {
                email: "golfer@example.com",
                name: "Golf Enthusiast",
            },
        };

        onLoginSuccess(mockUserResponse);
    };

    const handleSubmit = e => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (tab === 1 && !name) {
            setError("Please provide your name");
            return;
        }

        // In a real application, you would make an API call to your backend here
        // For demo purposes, we'll simulate a successful login/signup
        const mockUserResponse = {
            clientId: "email-user-123",
            profileObj: {
                email: email,
                name: tab === 0 ? "Golf User" : name,
            },
        };

        onLoginSuccess(mockUserResponse);
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            aria-labelledby="auth-dialog-title"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="auth-dialog-title" sx={{ pb: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" component="div" fontWeight={600}>
                        {tab === 0 ? "Sign In" : "Create Account"}
                    </Typography>
                    <IconButton aria-label="close" onClick={onClose} edge="end">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Tabs
                value={tab}
                onChange={handleTabChange}
                aria-label="auth tabs"
                centered
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                <Tab label="Sign In" id="auth-tab-0" />
                <Tab label="Sign Up" id="auth-tab-1" />
            </Tabs>

            <DialogContent>
                <TabPanel value={tab} index={0}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 1, mb: 3 }}
                        >
                            Sign In
                        </Button>
                    </form>
                </TabPanel>

                <TabPanel value={tab} index={1}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Full Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="signup-email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            id="signup-password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 1, mb: 3 }}
                        >
                            Create Account
                        </Button>
                    </form>
                </TabPanel>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        OR
                    </Typography>
                </Divider>

                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Box sx={{ width: "100%", maxWidth: "320px" }}>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError("Google login failed")}
                            shape="rectangular"
                            width="100%"
                            logo_alignment="center"
                            text="continue_with"
                            useOneTap
                        />
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
}

export default AuthModal;
