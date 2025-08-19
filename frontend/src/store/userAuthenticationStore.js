import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { io } from 'socket.io-client';

// Create Zustand store for user authentication
export const userAuthenticationStore = create((set, get) => ({

    // === Initial States ===

    authenticationUser: null, // Store logged-in user info
    isSigningIn: false,       // Show loading while signing up
    isLoggingIn: false,       // Show loading while logging in
    isUpdatingProfile: false, // Optional: for profile updates
    onlineUsers: [],          // Store list of online user IDs
    socket: null,             // Will store socket connection

    isCheckingAuthentication: true, // True until check is done

    // === Check if User is Already Logged In (Auto Login) ===
    checkAuthentication: async () => {
        try {
            // Call backend to get logged-in user data (via cookies)
            const response = await axiosInstance.get("/auth/user/userLoader", {
                withCredentials: true, // So cookie is sent
            });

            const user = response.data;

            // Save user in state
            set({ authenticationUser: user });

            // If user has _id (means logged in), connect socket
            if (user?._id) {
                const socket = io("http://localhost:5005", {
                    query: { userId: user._id }, // Pass userId to server
                });

                socket.connect(); // Connect the socket

                set({ socket }); // Save socket in state

                // Listen for online users update from server
                socket.on("getOnlineUsers", (userIds) => {
                    // Remove any "undefined" entries
                    const filteredUserIds = userIds.filter((id) => id !== "undefined");
                    set({ onlineUsers: filteredUserIds }); // Save online user list
                });
            }
        } catch (error) {
            // If error, set user as null
            console.log(error);
            set({ authenticationUser: null });
        } finally {
            // In both success/error, stop loading
            set({ isCheckingAuthentication: false });
        }
    },

    // === Sign Up (Register New User) ===
    userRegistration: async (data) => {
        set({ isSigningIn: true }); // Start loading
        try {
            // Send registration data to backend
            const response = await axiosInstance.post("/auth/newUserCreation", data);

            // Save new user
            set({ authenticationUser: response.data });

            // Connect socket after signup
            get().connectSocket();
        } catch (error) {
            console.log(error);
        }
    },

    // === Login Function ===
    userLogin: async (data) => {
        set({ isLoggingIn: true }); // Start loading
        try {
            // Send login request
            const response = await axiosInstance.post("/auth/userLogin", data);

            // Save logged-in user data
            set({ authenticationUser: response.data });

            // Connect socket after login
            get().connectSocket();
        } catch (error) {
            console.log(error);
            // If error, return this object for UI
            return {
                success: false,
                error: error.response?.data?.message || "Login failed. Please try again.",
            };
        }
    },

    // === Logout Function ===
    userLogout: async () => {
        try {
            // Call backend to log out
            const response = await axiosInstance.post("/auth/userLogout");

            // Clear user data
            set({ authenticationUser: null });

            // Disconnect socket
            get().disconnectSocket();
        } catch (error) {
            console.log(error);
        }
    },

    // === Forgot Password (Send Email Link) ===
    userForgetPassword: async (data) => {
        try {
            const response = await axiosInstance.post("/auth/userForgetPassword", data);
            return response.data; // Return backend message (success or fail)
        } catch (error) {
            console.log(error);
        }
    },

    // === Reset Password (with token from email) ===
    userResetPassword: async (token, data) => {
        try {
            const response = await axiosInstance.put(`/auth/userResetPassword/${token}`, data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    // === Connect Socket (used after login/signup) ===
    connectSocket: () => {
        const { authenticationUser } = get(); // Get current user
        console.log(authenticationUser); // For debugging

        // If no user or socket is already connected, skip
        if (!authenticationUser || get().socket?.connected) return;

        // Create socket with userId as query
        const socket = io("http://localhost:5005", {
            query: { userId: authenticationUser?._id },
        });

        socket.connect(); // Connect the socket

        set({ socket }); // Save to state

        // Listen for list of online users from server
        socket.on("getOnlineUsers", (userId) => {
            set({ onlineUsers: userId });
        });
    },

    // === Disconnect Socket (used on logout) ===
    disconnectSocket: () => {
        // If socket exists and connected, disconnect it
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }

}));
