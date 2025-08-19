import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { loggedinUserStore } from './loggedinUserStore.js';
import { userAuthenticationStore } from './userAuthenticationStore.js';
import HomeContext from '../components/pages/home/homeContext/homeContext.jsx';

export const messageStore = create((set, get) => ({

    messageText: '',
    messageImage: '',
    sending: false,
    error: null,
    messages: [],
    loadingMessages: false,
    unreadCounts: {}, // friendId => number of unread messages

    // ********** Set message text **********
    setMessageText: (text) => set({ messageText: text }),

    // ********** Set message image **********
    setMessageImage: (imageBase64) => set({ messageImage: imageBase64 }),

    // ********** Clear all messages **********
    clearMessages: () => set({ messages: [] }),

    // ********** Fetch unread message counts **********
    fetchUnreadCounts: async () => {
        try {
            const response = await axiosInstance.get('/auth/user/message/unreadMessageCount');
            const unreadArr = response.data.unreadCounts || [];

            const unreadObj = {};
            unreadArr.forEach(({ _id, count }) => {
                unreadObj[_id] = count;
            });

            set({ unreadCounts: unreadObj });
        } catch (err) {
            console.error("Fetch unread counts failed", err);
        }
    },

    
// ********** Mark messages as read when opening chat with a friend **********
    openChatWithFriend: async (friendId) => {
        try {
            await axiosInstance.post(`/auth/user/message/markAsRead/${friendId}`);
            // Clear local unread count after success
            set((state) => {
                const unreadCopy = { ...state.unreadCounts };
                unreadCopy[friendId] = 0;
                return { unreadCounts: unreadCopy };
            });
        } catch (err) {
            console.error("Failed to mark messages read", err);
        }
    },


    // ********** Reset unread count when user opens the chat **********
    setActiveFriendAndResetUnread: (friendId) => {
        get().handleStatusUpdate();
        const currentUnread = { ...get().unreadCounts };
        currentUnread[friendId] = 0;
        set({ unreadCounts: currentUnread });
        get().openChatWithFriend(friendId);
    },

    // ********** Send a message to the server **********
    sendMessage: async (friendId) => {
        set({ sending: true, error: null });

        try {
            const { messageText, messageImage, messages } = get();

            const response = await axiosInstance.post(
                `/auth/user/message/sendingMessage/${friendId}`,
                {
                    text: messageText,
                    image: messageImage,
                }
            );
            const newMessage = response.data;
            set({
                messageText: '',
                messageImage: '',
                sending: false,
                messages: [...messages, newMessage],
            });

            return newMessage;

        } catch (err) {
            set({
                sending: false,
                error:
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to send message',
            });
        }
    },

    // ********** Fetch messages for a single friend **********
    getSingleFriendMessage: async (friendId) => {
        set({ loadingMessages: true, error: null });

        try {
            const response = await axiosInstance.get(
                `/auth/user/message/getSingleFriendMessage/${friendId}`
            );

            set({
                messages: response.data.messages,
                loadingMessages: false,
            });

            return response.data;

        } catch (err) {
            set({
                loadingMessages: false,
                error:
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to fetch messages',
            });
        }
    },

    // ********** Deleting message for a single friend **********
    deleteMessage: async (messageId, userId, deleteFor) => {
        set({ loading: true, error: null, successMessage: null });
        console.log(messageId, userId, deleteFor)
        try {
            const response = await axiosInstance.delete(
                `/auth/user/message/messageDelete/${messageId}?deleteFor=${deleteFor}`,
                {
                    data: { userId },
                }
            );
            const { message: successMsg } = response.data;

            // Remove message locally if deleted for everyone
            if (deleteFor === "everyone") {
                const updatedMessages = get().messages.filter(
                    (msg) => msg._id !== messageId
                );
                set({ messages: updatedMessages });
            }

            // If deleted for me, hide it immediately from local state
            if (deleteFor === "me") {
                const updatedMessages = get().messages
                    .map((msg) =>
                        msg._id === messageId
                            ? { ...msg, deletedBy: [...(msg.deletedBy || []), userId] }
                            : msg
                    )
                    .filter((msg) => !(msg.deletedBy || []).includes(userId));

                set({ messages: updatedMessages });

                // If last message deleted, update friend list instantly
                const lastMsg = updatedMessages[updatedMessages.length - 1] || null;

                loggedinUserStore.getState().updateLastMessageInFriendList(
                    friendId,                                // friend whose chat is open
                    lastMsg ? lastMsg.text : "",             // new last message text
                    lastMsg ? lastMsg.createdAt : null       // new last message time
                );
            }

            set({ loading: false, successMessage: successMsg });
        } catch (err) {
            set({
                loading: false,
                error:
                    err?.response?.data?.error || "Failed to delete the message.",
            });
        }
    },

    // *********************** Forwarding Message to Friends ***************************
    forwardMessage: async (messageId, friendIds) => {
        try {
            const response = await axiosInstance.post(
                `/auth/user/message/forwardingMessage`,
                {
                    messageId,
                    friendIds
                }
            );

            const { forwardedMessages } = response.data;

            // Append forwarded messages to local state if relevant
            const currentMessages = get().messages;
            const updatedMessages = [...currentMessages];

            // Add each forwarded message locally if the current chat matches
            const activeFriend = messageStore.getState().selectedFriend
            forwardedMessages?.forEach(msg => {
                if (activeFriend?._id && friendIds.includes(activeFriend._id)) {
                    updatedMessages.push(msg);
                }
            });

            set({ messages: updatedMessages });

            return forwardedMessages;
        } catch (err) {
            console.error("Forward message error:", err);
            set({
                error:
                    err?.response?.data?.message ||
                    err.message ||
                    "Failed to forward message"
            });
        }
    },

    // ********** Update message status when server sends update **********
    handleStatusUpdate: () => {
        const socket = userAuthenticationStore.getState().socket;
        if (!socket) return;

        socket.off("message-status-updated");

        socket.on("message-status-updated", ({ messageId, status }) => {
            const messages = get().messages;

            const updatedMessages = messages.map(msg =>
                msg._id === messageId ? { ...msg, status } : msg
            );

            set({ messages: updatedMessages });
        });
    },

    // ********** Mark messages as read in local state **********
    markMessagesAsReadLocally: (messageIds = []) => {
        const updatedMessages = get().messages.map((msg) =>
            messageIds.includes(msg._id) ? { ...msg, status: "read" } : msg
        );
        set({ messages: updatedMessages });
    },


    // ********** Listen to new messages and track unread per friend **********
    subscribeToMessages: (friendId) => {
        const socket = userAuthenticationStore.getState().socket;
        if (!socket) return;

        // const activeFriendId = loggedinUserStore.getState().selectedFriend._id;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {


            // 1. Check if message is related to currently selected friend
            if (
                newMessage.senderId === friendId ||
                newMessage.receiverId === friendId
            ) {
                set((state) => ({
                    messages: [...state.messages, newMessage],
                }));
            }

            // 2. Update unread count if not current friend
            const currentUserId = userAuthenticationStore.getState().authenticationUser._id;
            const otherUserId =
                newMessage.senderId === currentUserId
                    ? newMessage.receiverId
                    : newMessage.senderId;

            if (otherUserId !== friendId && newMessage.senderId !== currentUserId) {
                const unreadCounts = { ...get().unreadCounts };
                unreadCounts[otherUserId] = (unreadCounts[otherUserId] || 0) + 1;
                set({ unreadCounts });
            }


            // 3. Update last message preview in friend list
            loggedinUserStore.getState().updateLastMessageInFriendList(
                otherUserId,
                newMessage.text || "[Image]",
                newMessage.createdAt
            );

            socket.emit("message-delivered", { messageId: newMessage._id });
        });

        get().handleStatusUpdate();
    },

    // ********** Global listener for all messages **********
    subscribeToAllMessages: () => {
        const socket = userAuthenticationStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.off("message-deleted"); // avoid duplicate listeners

        socket.on("newMessage", (newMessage) => {
            const state = get();
            const { activeFriend } = HomeContext.getState?.() || {};
            const isActive = activeFriend?._id === newMessage.senderId || activeFriend?._id === newMessage.receiverId;

            if (isActive) {
                set({ messages: [...state.messages, newMessage] });
            }
            // else if (newMessage.senderId !== userAuthenticationStore.getState().authenticationUser._id) {
            //     const currentCounts = state.unreadCounts || {};
            //     const otherId = newMessage.senderId;
            //     const current = currentCounts[otherId] || 0;
            //     set({ unreadCounts: { ...currentCounts, [otherId]: current + 1 } });
            // }

            const currentUserId = userAuthenticationStore.getState().authenticationUser._id;

            // Only increase unread count if the message is NOT from me
            if (!isActive && newMessage.senderId !== currentUserId) {
                const currentCounts = state.unreadCounts || {};
                const otherId = newMessage.senderId;
                const current = currentCounts[otherId] || 0;
                set({ unreadCounts: { ...currentCounts, [otherId]: current + 1 } });
            }

            loggedinUserStore.getState().updateLastMessageInFriendList(
                newMessage.senderId,
                newMessage.text || "[Image]",
                newMessage.createdAt
            );

            socket.emit("message-delivered", { messageId: newMessage._id });
        });

        get().handleStatusUpdate();

        // Handle message deletion events
        socket.on("message-deleted", ({ messageId, deleteFor, userId }) => {
            if (deleteFor === "everyone") {
                set((state) => ({
                    messages: state.messages.filter(msg => msg._id !== messageId)
                }));
            } else if (deleteFor === "me") {
                set((state) => ({
                    messages: state.messages.filter(msg => msg._id !== messageId || msg.senderId === userId)
                }));
            }
        });

        get().handleStatusUpdate();
    },

    // ********** Stop listening to new messages **********
    unSubscribeFromMessages: () => {
        const socket = userAuthenticationStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    }

}));
