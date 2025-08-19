import React, { useContext, useEffect } from 'react'
import HomeContext from '../../homeContext/homeContext';
import MessageSearchbar from './messageSearchbar';
import { userAuthenticationStore } from '../../../../../store/userAuthenticationStore';

const ChatDisplayHeader = ({ setShowRightSlider }) => {
    // Get the currently selected friend from context
    const { activeFriend } = useContext(HomeContext);

    // Get the array of online user IDs from Zustand store
    const onlineUsers = userAuthenticationStore((state) => state.onlineUsers);

    // This function runs when user clicks the header
    // It opens the right side profile panel
    const handleOpenFriendProfile = () => {
        setShowRightSlider(true); // Set right slider to show
    };

    return (
        <div className='mainContainer'>
            {/* Top chat header bar */}
            <div className="chatHeader cursor-pointer bg-[#202c33] h-[60px] border-b border-gray-700 p-6 flex items-center justify-between shadow-[0_4px_6px_-1px_rgb(0, 0, 0)]">

                {/* Friend’s profile picture and name section */}
                <div
                    onClick={handleOpenFriendProfile} // When user clicks this section, it opens the profile
                    className="image-userName flex items-center gap-5 w-[85%]"
                >
                    {/* Circle image or initials box */}
                    <div className="userImage h-[45px] w-[45px] overflow-clip rounded-full perfectCenter">
                        {/* If user has uploaded a profile picture */}
                        <img
                            src={activeFriend?.profilePicture || "/defaultImage.png"}
                            alt="User"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/defaultImage.png";
                            }}
                        />

                    </div>

                    {/* Friend’s name and status text */}
                    <div className="userName-userStatus">
                        {/* Display the user’s name */}
                        <h4 className='userName font-[500]'>{activeFriend.userName}</h4>

                        {/* Show online/offline status text and green dot if online */}
                        <div className='userStatus text-[12px] text-gray-300 flex items-center gap-1'>
                            <span className='perfectCenter'>
                                {/* Check if this friend is in onlineUsers list */}
                                {onlineUsers.includes(activeFriend._id) ? 'Online' : 'Offline'}
                            </span>

                            {/* Show green dot only when the friend is online */}
                            {onlineUsers.includes(activeFriend._id) && (
                                <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side message search bar (for filtering messages) */}
                <MessageSearchbar />
            </div>
        </div>
    );
};

export default ChatDisplayHeader;
