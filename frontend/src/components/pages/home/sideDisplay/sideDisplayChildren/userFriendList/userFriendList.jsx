// Importing necessary hooks and context
import React, { useContext, useEffect, useState } from 'react';
import HomeContext from '../../../homeContext/homeContext'; // Home context for sharing state
import { loggedinUserStore } from '../../../../../../store/loggedinUserStore'; // Zustand store for logged-in user data
import AddNewFriendSlider from './addNewFriendSlider'; // Component to add a new friend
import { formatTo12HourTime } from '../../../../../../lib/formateTime'; // Helper to format time
import FriendDeleteOption from './friendMenuList/friendDeleteOption'; // Modal for deleting a friend

// Importing icons
import { IoMdSearch } from "react-icons/io";
import { HiInformationCircle, HiUserAdd } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiDeleteBin6Line } from "react-icons/ri";
import { messageStore } from '../../../../../../store/messageStore';
import { userAuthenticationStore } from '../../../../../../store/userAuthenticationStore';

const UserFriendList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [addFriendSlider, setAddFriendSlider] = useState(false);
    const [showDeleteFriendModal, setShowDeleteFriendModal] = useState(false);

    const { fetchUserFriendList, userFriendList } = loggedinUserStore();
    const { activeFriend, setActiveFriend, setShowRightSlider } = useContext(HomeContext);
    const { authenticationUser, socket } = userAuthenticationStore();

    // Get unreadCounts and reset function from messageStore
    const { unreadCounts, setActiveFriendAndResetUnread, getSingleFriendMessage } = messageStore();

    useEffect(() => {
        setLoading(true);
        fetchUserFriendList();
        setTimeout(() => setLoading(false), 300);
    }, []);

    // When New Friend is Added ---> Real Time Update
    useEffect(() => {
        if (!socket) return;

        socket.on("friend-added", (newFriend) => {
            loggedinUserStore.setState((state) => ({
                userFriendList: [...state.userFriendList, newFriend]
            }));
        });

        return () => {
            socket.off("friend-added");
        };
    }, [socket]);

    // When Friend is Deleted ---> Real Time Update
    useEffect(() => {
        if (!socket) return;

        socket.on("friend-deleted", ({ userId }) => {
            loggedinUserStore.setState((state) => ({
                userFriendList: state.userFriendList.filter(f => f._id !== userId)
            }));
        });

        return () => {
            socket.off("friend-deleted");
        };
    }, [socket]);



    const friendList = (userFriendList || []).slice().sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
    });

    const highlightMatch = (text) => {
        if (typeof text !== 'string' || !searchQuery) return text || '';
        const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === searchQuery.toLowerCase() ? (
                <mark key={index} className="text-[yellow] bg-transparent font-bold">{part}</mark>
            ) : part
        );
    };

    const filteredFriends = friendList.filter(friend =>
        friend.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mainContainer overflow-clip relative w-full h-[100vh] px-2 py-6 select-none flex flex-col">
            <div className="heading-searchbar flex flex-col gap-3">
                <div className="webName-addFriend px-6 flex items-center justify-between">
                    <h1 className="text-[22px] font-bold">Whispr</h1>
                    <div onClick={() => setAddFriendSlider(true)} title="Add new Friend" className="addFriend perfectCenter p-1 w-[35px] h-[35px] hover:bg-gray-600 clickEffect rounded-full cursor-pointer">
                        <HiUserAdd size={"22px"} />
                    </div>
                </div>

                <div className="searchBar flex items-center rounded-lg p-[2px_10px] bg-[#202c33]">
                    <div className='text-[25px] text-gray-400'><IoMdSearch /></div>
                    <input
                        className='w-full p-[4px_10px] focus:outline-none text-[15px]'
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="friendList flex flex-col overflow-y-auto mt-2 pr-1 scrollbar-hide scrollbar-show flex-grow transition-all duration-300">
                {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="cursor-pointer flex items-center gap-3 p-3 rounded-lg animate-pulse">
                            <div className="imageController perfectCenter h-[55px] w-[55px] rounded-full overflow-hidden bg-gray-200"></div>
                            <div className="userName-lastMessage w-[70%]">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                            </div>
                        </div>
                    ))
                ) : filteredFriends.length > 0 ? (
                    filteredFriends.map((friend, index) => {
                        const isActive = activeFriend?._id === friend._id;
                        const unreadCount = unreadCounts[friend._id] || 0;

                        return (
                            <div
                                key={index}
                                className={`singleUserCard group cursor-pointer flex items-center gap-3 p-3 m-0.5 rounded-sm transition-colors duration-200 ${isActive ? 'bg-gray-600 hover:bg-gray-500' : 'hover:bg-gray-700'}`}
                                onClick={async () => {
                                    setActiveFriend(friend);
                                    await getSingleFriendMessage(friend._id);
                                    setActiveFriendAndResetUnread(friend._id);
                                    setShowRightSlider(false);

                                    // Emit 'message-read' event
                                    if (
                                        friend.lastMessageId &&
                                        friend.lastMessageSenderId &&
                                        authenticationUser &&
                                        friend.lastMessageSenderId !== authenticationUser?._id &&
                                        socket
                                    ) {
                                        socket.emit("message-read", {
                                            messageId: friend.lastMessageId,
                                            senderId: friend.lastMessageSenderId,
                                        });
                                    }
                                }}

                            >
                                <div className="imageController perfectCenter h-[50px] min-w-[50px] rounded-full overflow-hidden">
                                    <img
                                        src={friend?.profilePicture || "/defaultImage.png"}
                                        alt="User"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/defaultImage.png";
                                        }}
                                    />
                                </div>

                                <div className="userName-lastMessage-time w-[85%]">
                                    <div className="userName-lastMessageTime flex items-center justify-between">
                                        <p className="userName text-white break-words">{highlightMatch(friend.userName)}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="lastMessageTime text-gray-400 text-[12px]">{formatTo12HourTime(friend.lastMessageTime)}</p>
                                            {unreadCount > 0 && (
                                                <span className="bg-green-500 text-black text-xs font-semibold w-[20px] h-[20px] perfectCenter rounded-full">
                                                    {unreadCount > 99 ? "99+" : unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="lastMessage-dropDown overflow-x-clip relative flex justify-between items-center">
                                        <div className="flex items-space gap-2 max-w-[90%]">
                                            <p className={`text-gray-400 text-[14px] whitespace-nowrap overflow-hidden ${!friend.lastMessage && "italic"} text-ellipsis max-w-[100%] group-hover:max-w-[95%]`}>
                                                {highlightMatch(friend.lastMessage || "No conversation yet.")}
                                            </p>
                                        </div>

                                        <div className={`dropDown absolute z-50 duration-200 cursor-pointer text-gray-400 hover:text-white ${isActive ? "right-0 opacity-100" : "group-hover:right-0 group-hover:opacity-100 right-[-40px] opacity-0"}`}>
                                            <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button"><RiArrowDropDownLine size={"40px"} /></div>
                                                <ul tabIndex={0} className="dropdown-content menu bg-[#202c33] rounded-box z-1 w-52 p-2 shadow-sm">
                                                    <li onClick={(event) => {
                                                        event.stopPropagation();
                                                        setShowRightSlider(true);
                                                    }} className='InformationMain hover:bg-gray-600 rounded-sm clickEffect'>
                                                        <div className="informationSub flex items-center">
                                                            <a className='informationIcon'><HiInformationCircle size={"20px"} /></a><a className='informationText text-[15px]'>Information</a>
                                                        </div>
                                                    </li>
                                                    <li onClick={() => setShowDeleteFriendModal(true)} className='deleteMain hover:bg-red-500 rounded-sm clickEffect'>
                                                        <div className="deleteSub flex items-center">
                                                            <a className='deleteIcon'><RiDeleteBin6Line size={"20px"} /></a><a className='deleteText text-[15px]'>Delete</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-400 text-center mt-10">No results found.</div>
                )}
            </div>

            <AddNewFriendSlider
                addFriendSlider={addFriendSlider}
                setAddFriendSlider={setAddFriendSlider}
                onFriendAdded={() => {
                    setLoading(true);
                    fetchUserFriendList();
                    setTimeout(() => setLoading(false), 300);
                }}
            />

            {showDeleteFriendModal && <FriendDeleteOption setShowDeleteFriendModal={setShowDeleteFriendModal} />}
        </div>
    );
};

export default UserFriendList;
