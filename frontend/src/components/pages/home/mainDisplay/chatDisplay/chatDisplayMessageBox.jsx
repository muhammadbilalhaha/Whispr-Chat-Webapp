import React, { useContext, useEffect, useRef, useState } from 'react';
import HomeContext from '../../homeContext/homeContext';
import { messageStore } from '../../../../../store/messageStore';
import { loggedinUserStore } from '../../../../../store/loggedinUserStore';
import { userAuthenticationStore } from '../../../../../store/userAuthenticationStore';

// icons
import { FaPlus, FaBan } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { IoMdLock } from "react-icons/io";




const ChatDisplayMessageBox = () => {
    // Local message state
    const [localMessage, setLocalMessage] = useState('');

    // Number of rows in the textarea (auto-growing up to 5)
    const [rows, setRows] = useState(1);

    // Ref to control cursor and textarea focus
    const textareaRef = useRef(null);

    // Access global states and functions from context/stores
    const { activeFriend, setImageUploaderDisplay } = useContext(HomeContext);
    const { setMessageText, sendMessage, sending, error } = messageStore();
    const { fetchUserFriendList } = loggedinUserStore();
    const authenticationUser = userAuthenticationStore((state) => state.authenticationUser);

    // When user types in the textarea
    const handleMessageChange = (e) => {
        setLocalMessage(e.target.value);
    };

    // Send the message to the friend
    const handleSendMessage = async () => {
        const trimmedMessage = localMessage.trim(); // remove extra spaces
        if (!trimmedMessage) return; // don't send empty messages

        setMessageText(trimmedMessage); // update message store
        await sendMessage(activeFriend._id); // send message to backend
        setLocalMessage(''); // clear local message input
        setRows(1); // reset rows back to 1
        textareaRef.current?.focus(); // focus back to the textarea
        fetchUserFriendList(); // refresh friend list (to update last message)
    };

    // Handle key press inside textarea
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                // Ctrl + Enter → insert a new line
                e.preventDefault();
                const cursorPos = textareaRef.current.selectionStart;
                const newText =
                    localMessage.substring(0, cursorPos) +
                    '\n' +
                    localMessage.substring(cursorPos);
                setLocalMessage(newText);

                // Move cursor to correct position after adding new line
                setTimeout(() => {
                    textareaRef.current.selectionStart =
                        textareaRef.current.selectionEnd = cursorPos + 1;
                }, 0);

                // Grow the textarea if needed (max 5 rows)
                setRows((prev) => Math.min(prev + 1, 5));
            } else {
                // Just Enter → send message
                e.preventDefault();
                handleSendMessage();
            }
        } else if (e.key === 'Backspace') {
            // If backspace is pressed, shrink rows if possible
            const lines = localMessage.split('\n');
            const isOnEmptyLine = lines[lines.length - 1] === '';

            if (isOnEmptyLine && rows > 1) {
                setTimeout(() => {
                    const newLines = textareaRef.current.value.split('\n');
                    const nonEmptyLines = newLines.filter((line) => line.trim() !== '');

                    // Reduce rows if empty lines were removed
                    if (newLines.length < rows || nonEmptyLines.length < rows) {
                        setRows((prev) => Math.max(1, prev - 1));
                    }
                }, 0);
            }
        }
    };

    return (
        <div className="p-2 bg-[#202c33] ">
            <div className="flex items-end space-x-4">
                {/* Image Upload Button */}
                <button
                    onClick={() => setImageUploaderDisplay(true)}
                    className={`clickEffect perfectCenter ${authenticationUser?.isBlocked ? "" : "cursor-pointer"
                        } hover:bg-gray-600 text-white p-3 rounded-full`}
                    disabled={authenticationUser?.isBlocked}
                >
                    {authenticationUser?.isBlocked ? <FaBan /> : <FaPlus />}
                </button>

                {/* Message Input */}
                <textarea
                    ref={textareaRef}
                    rows={rows}
                    value={localMessage}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        authenticationUser?.isBlocked
                            ? "You are blocked from sending messages"
                            : "Type your message..."
                    }
                    className="flex-1 p-3 perfectCenter bg-[#2e3b42ec] rounded-lg focus:outline-none text-white resize-none transition-all duration-150 ease-in-out"
                    disabled={sending || authenticationUser?.isBlocked}
                />

                {/* Send Button */}
                <button
                    onClick={handleSendMessage}
                    className={`bg-red-500 clickEffect perfectCenter ${authenticationUser?.isBlocked ? "" : "cursor-pointer"
                        } hover:bg-red-400 text-white p-3 rounded-full`}
                    disabled={sending || authenticationUser?.isBlocked}
                >
                    {authenticationUser?.isBlocked ? <IoMdLock size="20px" /> : <IoSend size="20px" />}
                </button>
            </div>
        </div>


    );
};

export default ChatDisplayMessageBox;
