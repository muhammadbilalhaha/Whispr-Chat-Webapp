import React, { useContext, useEffect, useRef, useState } from 'react';
import { messageStore } from '../../../../../store/messageStore';
import { userAuthenticationStore } from '../../../../../store/userAuthenticationStore';
import HomeContext from '../../homeContext/homeContext';
import { formatTo12HourTime } from '../../../../../lib/formateTime';
import ImageUploaderDisplay from './imageUploaderDisplay';
import { loggedinUserStore } from '../../../../../store/loggedinUserStore';

//icons
import { IoCloseSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdDelete } from 'react-icons/md';
import { FaShare } from 'react-icons/fa';
import { IoCheckmarkSharp, IoCheckmarkDone } from "react-icons/io5";
import { TbArrowForwardUpDouble } from "react-icons/tb";


const ChatDisplayBody = () => {
    const { activeFriend, searchText, imageUploaderDisplay } = useContext(HomeContext);
    const { messages, loadingMessages, getSingleFriendMessage, clearMessages, subscribeToMessages, unSubscribeFromMessages, deleteMessage, forwardMessage } = messageStore();
    const { authenticationUser } = userAuthenticationStore();
    const { userFriendList, fetchUserFriendList } = loggedinUserStore();

    const containerRef = useRef(null);
    const [highlightedId, setHighlightedId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [dropdownDirection, setDropdownDirection] = useState('dropdown-bottom');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [confirmationState, setConfirmationState] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // "me" or "everyone"
    const [modalType, setModalType] = useState(null); // "delete" or "forward"
    const [selectedForwardFriends, setSelectedForwardFriends] = useState([]);





    // Scroll to the bottom of the container when messages change
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    // Load messages for the selected friend
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeFriend?._id) return;
            clearMessages(); // Clear messages when switching
            await getSingleFriendMessage(activeFriend._id);
        };
        loadMessages();

        // This subscribes to real-time messages for that friend
        subscribeToMessages(activeFriend._id);

        // This unsubscribes when friend changes or component unmounts
        return () => {
            unSubscribeFromMessages();
        };
    }, [activeFriend?._id]);

    useEffect(() => {
        console.log(messages)
    }, [messages])


    useEffect(() => {
        if (!messages || messages.length === 0) return;

        const socket = userAuthenticationStore.getState().socket;
        if (!socket) return;

        const unreadMessageIds = messages
            .filter(
                (msg) =>
                    msg.senderId === activeFriend?._id &&
                    msg.status !== "read"
            )
            .map((msg) => msg._id);

        if (unreadMessageIds.length > 0) {
            // 1. Emit message-read to server for all
            unreadMessageIds.forEach((id) => {
                socket.emit("message-read", { messageId: id });
            });

            // 2. Immediately update them locally
            messageStore.getState().markMessagesAsReadLocally(unreadMessageIds);
        }
    }, [messages, activeFriend]);




    // Highlight and scroll to the first matched message from search
    useEffect(() => {
        if (searchText && messages.length > 0) {
            const match = messages.find(msg =>
                msg.text?.toLowerCase().includes(searchText.toLowerCase())
            );
            if (match) {
                setHighlightedId(match._id);
                setTimeout(() => {
                    const target = document.getElementById(`msg-${match._id}`);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            } else {
                setHighlightedId(null);
            }
        } else {
            setHighlightedId(null);
        }
    }, [searchText, messages]);


    const handleDeleteMessage = (id) => {
        const msg = messages.find((m) => m._id === id);
        setSelectedMessage(msg);
        setModalType("delete");
        setConfirmationState(false);
    };



    const handleForwardMessage = (msg) => {
        setSelectedMessage(msg);
        setModalType("forward");
    };

    //detect the cursor position and set the dropdown direction
    const handleDropdownPosition = (e) => {
        const viewportHeight = window.innerHeight;
        const cursorY = e.clientY;

        if (cursorY > viewportHeight / 2) {
            setDropdownDirection('dropdown-top');
        } else {
            setDropdownDirection('dropdown-bottom');
        }
    };


    return (
        <div className="mainContainer bg-[#111b21] relative flex-1 h-full w-full overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-center z-0"
                style={{
                    backgroundImage: "url('./messageBg.png')",
                    backgroundSize: '1200px',
                    backgroundAttachment: 'fixed',
                    opacity: 0.08,
                    pointerEvents: 'none',
                }}
            ></div>

            {/* Messages */}
            <div ref={containerRef} className="relative z-10 h-full overflow-x-clip overflow-y-auto px-10 py-3 space-y-3">
                {loadingMessages ? (
                    Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className={`chat ${i % 2 === 0 ? 'chat-end' : 'chat-start'}`}>
                            <div className="chat-bubble bg-[#252729]">
                                <div className="skeleton h-4 w-40"></div>
                            </div>
                        </div>
                    ))
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isSender = msg.senderId === authenticationUser._id;
                        const isHighlighted = highlightedId === msg._id;

                        return (
                            <div
                                key={msg._id}
                                id={`msg-${msg._id}`}
                                className={`chat ${isSender ? 'chat-end' : 'chat-start'} relative group`}
                            >
                                <div className={`chat-bubble max-w-[60%] gap-5 text-white bg-[#252729] shadow px-3 py-2
                                    ${isHighlighted ? 'animate-pulse border-l-3 border-amber-300' : ''}`}
                                >

                                    {/* Message Dropdown */}
                                    <div className={`absolute z-50 overflow-visible -top-1 ${isSender ? '-left-6' : '-right-6'} transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 opacity-0`}>
                                        <div className={`dropdown ${dropdownDirection} ${isSender ? 'dropdown-left' : 'dropdown-right'}`}>
                                            <div tabIndex={0} role="button" onMouseEnter={handleDropdownPosition}>
                                                <IoIosArrowDown className="font-bold text-[20px]" />
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                                            >
                                                <li>
                                                    <a onClick={() => handleDeleteMessage(msg._id)} className="flex items-center gap-2 text-red-500 hover:text-red-700">
                                                        <MdDelete className="text-[16px]" />
                                                        Delete Message
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={() => handleForwardMessage(msg)} className="flex items-center gap-2">
                                                        <FaShare className="text-[14px]" />
                                                        Forward
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* ****************************** Delete & Forward Modal Check Point ************************ */}
                                    {modalType && selectedMessage && (
                                        <div className="fixed inset-0 z-[100] flex items-center bg-[#00000002] justify-center">
                                            <div className="bg-[#1e1e1e] text-white rounded-xl w-[90%] max-w-sm p-6 space-y-5">

                                                {/* ****************************** Deleting Message Modal*********************** */}
                                                {modalType === "delete" && (
                                                    <>
                                                        {!confirmationState ? (
                                                            <>
                                                                <h3 className="text-xl font-semibold text-center">Delete Message?</h3>

                                                                <div className="flex flex-col gap-3">
                                                                    <button
                                                                        onClick={() => {
                                                                            setDeleteTarget("me");
                                                                            setConfirmationState(true);
                                                                        }}
                                                                        className="w-full py-2 rounded-full bg-[#2e2f31] hover:bg-[#393b3d] transition-colors text-sm"
                                                                    >
                                                                        Delete for Me
                                                                    </button>

                                                                    {["sent", "delivered"].includes(selectedMessage.status) && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setDeleteTarget("everyone");
                                                                                setConfirmationState(true);
                                                                            }}
                                                                            className="w-full py-2 rounded-full text-black bg-red-500 hover:bg-red-600 transition-colors text-sm"
                                                                        >
                                                                            Delete for Everyone
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        onClick={() => {
                                                                            setModalType(null);
                                                                            setSelectedMessage(null);
                                                                        }}
                                                                        className="w-full py-2 rounded-full bg-[#2e2f31] hover:bg-[#393b3d] transition-colors text-sm"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <h3 className="text-xl font-semibold text-center">Are you sure?</h3>
                                                                <p className="text-center text-sm text-gray-400">This action cannot be undone.</p>

                                                                <div className="flex flex-col gap-3">
                                                                    <button
                                                                        onClick={async () => {
                                                                            if (deleteTarget === "me") {
                                                                                await deleteMessage(selectedMessage?._id, authenticationUser?._id, "me")
                                                                            } else if (deleteTarget === "everyone") {
                                                                                await deleteMessage(selectedMessage._id, authenticationUser._id, "everyone")
                                                                            }
                                                                            fetchUserFriendList();
                                                                            setConfirmationState(false);
                                                                            setModalType(null);
                                                                            setSelectedMessage(null);
                                                                        }}
                                                                        className="w-full py-2 rounded-full text-black bg-red-500 hover:bg-red-600 transition-colors text-sm"
                                                                    >
                                                                        Yes, Delete
                                                                    </button>

                                                                    <button
                                                                        onClick={() => setConfirmationState(false)}
                                                                        className="w-full py-2 rounded-full bg-[#2e2f31] hover:bg-[#393b3d] transition-colors text-sm"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {/* ***************** Forward Message Modal****************** */}
                                                {modalType === "forward" && (
                                                    <>
                                                        <h3 className="text-xl font-semibold text-center">Forward Message</h3>
                                                        <p className="text-sm text-gray-400 text-center">Select one or more friends</p>

                                                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                                                            {[...userFriendList]
                                                                .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                                                                .map((friend) => {
                                                                    const isSelected = selectedForwardFriends.includes(friend._id);

                                                                    return (
                                                                        <label
                                                                            key={friend._id}
                                                                            className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer 
                    ${isSelected ? 'bg-[#393b3d]' : 'bg-[#2e2f31] hover:bg-[#393b3d]'}
                    transition-colors text-sm`}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => {
                                                                                    setSelectedForwardFriends((prev) =>
                                                                                        prev.includes(friend._id)
                                                                                            ? prev.filter((id) => id !== friend._id)
                                                                                            : [...prev, friend._id]
                                                                                    );
                                                                                }}
                                                                                className="checkbox checkbox-sm"
                                                                            />
                                                                            {friend.userName}
                                                                        </label>
                                                                    );
                                                                })}

                                                        </div>

                                                        <button
                                                            onClick={async () => {
                                                                if (selectedForwardFriends.length === 0) return;

                                                                await forwardMessage(selectedMessage._id, selectedForwardFriends);
                                                                // Reset modal
                                                                setSelectedForwardFriends([]);
                                                                setModalType(null);
                                                                setSelectedMessage(null);
                                                            }}
                                                            disabled={selectedForwardFriends.length === 0}
                                                            className="w-full mt-4 py-2 rounded-full text-black bg-red-500 hover:bg-red-600 transition-colors text-sm disabled:bg-gray-500 disabled:text-white"
                                                        >
                                                            Forward to {selectedForwardFriends.length} {selectedForwardFriends.length === 1 ? "friend" : "friends"}
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setSelectedForwardFriends([]);
                                                                setModalType(null);
                                                                setSelectedMessage(null);
                                                            }}
                                                            className="w-full mt-2 py-2 rounded-full bg-[#2e2f31] hover:bg-[#393b3d] transition-colors text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {msg.isForwarded && (<span className="text-xs flex items-center gap-1 text-gray-400 italic"> <TbArrowForwardUpDouble size={"15px"} /> Forwarded</span>)}
                                    {msg.image && (
                                        <div
                                            onClick={() => setPreviewImage(msg.image)} className="cursor-pointer py-1 my-1 w-[300px] h-[300px]">
                                            <img
                                                src={msg.image}
                                                alt="chat"
                                                className="w-full h-full object-cover rounded mb-1 hover:opacity-80 transition duration-200"
                                            />
                                        </div>
                                    )}
                                    {msg.text && (
                                        <div className="forwardText-actualText">
                                            <p className={`message text-[15px] wrap-anywhere ${isHighlighted ? 'font-semibold' : ''}`}>{msg.text}</p>
                                        </div>
                                    )}

                                    <div className="time-isRead flex items-center justify-end gap-1">
                                        <p className="messageTime text-gray-300 text-[10px] text-right whitespace-nowrap">
                                            {formatTo12HourTime(msg.createdAt)}
                                        </p>
                                        <i className={`text-[16px] font-bold ${msg.status === 'read' ? 'text-blue-400' : 'text-gray-400'
                                            }`}>
                                            {msg.status === 'read' || msg.status === 'delivered' ? (
                                                <IoCheckmarkDone />
                                            ) : msg.status === 'sent' ? (
                                                <IoCheckmarkSharp />
                                            ) : null}
                                        </i>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Image Uploading Preview */}
            {imageUploaderDisplay && (
                <div className="absolute inset-0 z-50 bg-[#000000b7] backdrop-blur-sm flex justify-center items-center">
                    <ImageUploaderDisplay />
                </div>
            )}

            {/* Full Image Preview */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute cursor-pointer w-11 h-11 hover:bg-gray-600 perfectCenter top-2 right-8 m-2 text-gray-300 text-xl font-bold bg-opacity-50 p-2 rounded-full"
                    >
                        <IoCloseSharp size={"35px"} />
                    </button>
                    <div className="relative perfectCenter max-w-[80%] max-h-[80%]">
                        <img
                            src={previewImage}
                            alt="Full preview"
                            className="rounded-lg max-w-[90%] border border-base-100 max-h-screen"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatDisplayBody;
