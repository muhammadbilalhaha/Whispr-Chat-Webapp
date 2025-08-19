// adminStore.js

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


const useAdminStore = create((set) => ({
    users: [],
    loading: false,
    analyticsData: null,
    error: null,

    // =========================
    // FETCH ALL USERS
    // =========================
    fetchAllUsers: async () => {
        try {
            set({ loading: true });
            const response = await axiosInstance.get("/auth/admin/gettingAllUserAccounts");
            set({ users: response.data.data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch users.",
                loading: false,
            });
        }
    },

    // =========================
    // FETCH ALL USERS ANALYSTICS
    // =========================
    fetchTotalUsersAnalystics: async () => {
        set({ isLoadingAnalytics: true });

        try {
            const response = await axiosInstance.get("/auth/admin/gettingTotalUsersAnalytics");

            // Store the analytics data
            set({ analyticsData: response.data.data });
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            set({ analyticsData: null });
        } finally {
            set({ isLoadingAnalytics: false });
        }
    },

    // =========================
    // TARGETED USER ACCOUNT ROLE CHANGER
    // =========================
    targetedUserAccountRoleChange: async (targetedUserId, newRole) => {
        try {
            const response = await axiosInstance.put(`/auth/admin/changeUserRole/${targetedUserId}`, {
                newRole: newRole,
            });
        } catch (error) {
            console.error("Failed to change user role:", error?.response?.data?.message || error.message);
        } 
    },

    // =========================
    // TARGETED USER ACCOUNT BLOCK OR UNBLOCK
    // =========================
    targetedUserAccountBlock: async (targetedUserId) => {
        try {
            const response = await axiosInstance.put(`/auth/admin/userAccountBlock/${targetedUserId}`);
        } catch (error) {
            console.error("Failed to Block operation Perform", error?.response?.data?.message || error.message);
        }
    },

    // =========================
    // TARGETED USER ACCOUNT DELETE
    // =========================
    targetedUserAccountDelete: async (targetedUserId) => {
        try {
            const response = await axiosInstance.delete(`/auth/admin/deleteUserAccount/${targetedUserId}`);
        } catch (error) {
            console.error("Failed to Delete operation Perform", error?.response?.data?.message || error.message);
        }
    },

    // =========================
    // CLEAR ERROR
    // =========================
    clearError: () => set({ error: null }),
}));

export default useAdminStore;
