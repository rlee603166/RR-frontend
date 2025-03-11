import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Mock users database for temporary use
    const MOCK_USERS = [
        {
            uid: "user1",
            email: "demo@example.com",
            password: "password123",
            displayName: "Demo User",
            photoURL: "https://via.placeholder.com/150",
            createdAt: new Date().toISOString(),
        },
        {
            uid: "user2",
            email: "rory@example.com",
            password: "golfpro",
            displayName: "Rory McIlroy",
            photoURL: "https://via.placeholder.com/150",
            createdAt: new Date().toISOString(),
        },
    ];

    // Load user from localStorage on app startup
    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Remove password from user object for security
                delete parsedUser.password;
                setCurrentUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse stored user:", e);
                localStorage.removeItem("currentUser");
            }
        }
        setLoading(false);
    }, []);

    // Register with email/password (mock implementation)
    const register = async (email, password, name) => {
        try {
            setError("");

            // Check if email is already taken
            const userExists = MOCK_USERS.find(user => user.email === email);
            if (userExists) {
                throw new Error("Email already in use");
            }

            // Create new user
            const newUser = {
                uid: `user${Date.now()}`,
                email,
                password, // In a real app, NEVER store plain text passwords
                displayName: name,
                photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                createdAt: new Date().toISOString(),
            };

            // Add to mock database
            MOCK_USERS.push(newUser);

            // Store in localStorage (without password)
            const userForStorage = { ...newUser };
            delete userForStorage.password;

            localStorage.setItem("currentUser", JSON.stringify(userForStorage));
            setCurrentUser(userForStorage);

            return userForStorage;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Login with email/password (mock implementation)
    const login = async (email, password) => {
        try {
            setError("");

            // Find user by email
            const user = MOCK_USERS.find(user => user.email === email);
            if (!user) {
                throw new Error("User not found");
            }

            // Check password
            if (user.password !== password) {
                throw new Error("Invalid password");
            }

            // Store in localStorage (without password)
            const userForStorage = { ...user };
            delete userForStorage.password;

            localStorage.setItem("currentUser", JSON.stringify(userForStorage));
            setCurrentUser(userForStorage);

            return userForStorage;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Google authentication (mock implementation)
    const googleAuth = async googleToken => {
        try {
            setError("");

            // Create mock user data based on "decoded" Google token
            // In a real implementation, you would decode and verify the JWT
            const mockGoogleUser = {
                uid: `google_${Date.now()}`,
                email: `google_user_${Date.now()}@gmail.com`,
                displayName: "Google User",
                photoURL: "https://via.placeholder.com/150?text=G",
                createdAt: new Date().toISOString(),
                provider: "google",
            };

            localStorage.setItem("currentUser", JSON.stringify(mockGoogleUser));
            setCurrentUser(mockGoogleUser);

            return mockGoogleUser;
        } catch (error) {
            setError("Google authentication failed");
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        error,
        loading,
        register,
        login,
        googleAuth,
        logout,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
