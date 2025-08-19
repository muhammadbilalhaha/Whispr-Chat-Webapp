import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

export const loggedinUserStore = create((set) => ({ 

    
    userFriendList: [], // Store user's friend list
    selectedFriend: null, // Store currently selected friend
    isLoading: false,// Boolean to show loading spinner or status

    // Function to update user profile (name, email, profile picture)
    userUpdateProfile: async (data) => {
        set({ isLoading: true });

        try {
            const response = await axiosInstance.put("/auth/user/userUpdateProfile", data);
        } catch (error) {
            console.log("Updating Profile Error: ", error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Function to update selected friend (for chat screen)
    setSelectedFriend: (friend) => {
        set({ selectedFriend: friend });
    },

    // Function to get user's all friends from backend
    fetchUserFriendList: async () => {
        set({ isLoading: true });

        try {
            const response = await axiosInstance.get("/auth/user/userGetAllFriends");
            set({ userFriendList: response.data.friends, isLoading: false });
        } catch (error) {
            console.log("This is FriendList Error: ", error);
            set({ isLoading: false });
        }
    },

    // Function to search new users by email (for adding friend)
    searchNewFriend: async (email) => {
        try {
            const response = await axiosInstance.get(`/auth/user/searchNewFriend?email=${email}`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    // Function to add new friend using their email
    addNewFriend: async (email) => {
        try {
            const res = await axiosInstance.post(`/auth/user/userAddNewFriend`, { email });
            return res;
        } catch (error) {
            console.log("Add Friend Error:", error);
            return { data: { success: false, message: "Adding friend failed" } };
        }
    },

    // Function to delete friend by ID
    deleteFriend: async (friendId) => {
        try {
            const res = await axiosInstance.delete(`/auth/user/userDeleteFriend/${friendId}`);
            return res;
        } catch (error) {
            console.log("Delete Friend Error:", error);
            return { data: { success: false, message: "Deleting friend failed" } };
        }
    },

    // Function to update last message and time in friend list
    updateLastMessageInFriendList: (friendId, messageText, messageTime) => {
        set((state) => {
            const updatedList = state.userFriendList.map(friend => {
                if (friend._id === friendId) {
                    return {
                        ...friend,
                        lastMessage: messageText,
                        lastMessageTime: messageTime
                    };
                }
                return friend;
            });
            return { userFriendList: updatedList };
        });
    },

}));
