import React, { useContext, useState } from 'react'

// Import the three main sections of the chat display
import ChatDisplayHeader from './chatDisplayHeader'       // Top header (name, status, search)
import ChatDisplayBody from './chatDisplayBody'           // Middle area (chat messages)
import ChatDisplayMessageBox from './chatDisplayMessageBox' // Bottom input box (send message)
import FriendProfileRightSlider from './friendProfileRightSlider' // Right side profile panel

// Import context to manage shared state (like which friend is active, right slider, etc.)
import HomeContext from '../../homeContext/homeContext'

const ChatDisplayMain = () => {

    // Get values from HomeContext
    // showRightSlider → if true, friend profile will show
    // setShowRightSlider → used to open/close friend profile
    // imageUploaderDisplay → if true, it means image upload is happening
    const { showRightSlider, setShowRightSlider, imageUploaderDisplay } = useContext(HomeContext);

    return (
        // Main container takes full screen size
        <div className="mainContainer flex w-full h-screen overflow-hidden transition-all duration-300">
            
            {/* Left side: Chat screen area (header, messages, input) */}
            <div
                className={`flex flex-col overflow-hidden h-full transition-all duration-300 
                ${showRightSlider ? 'w-[calc(100%-300px)]' : 'w-full'}`}
            >
                {/* Top header with user info and search */}
                <ChatDisplayHeader setShowRightSlider={setShowRightSlider} />

                {/* Middle chat body: all messages */}
                <ChatDisplayBody />

                {/* Bottom message input box - only show if not uploading image */}
                {!imageUploaderDisplay && <ChatDisplayMessageBox />}
            </div>

            {/* Right side: Friend profile slider panel */}
            <FriendProfileRightSlider 
                showRightSlider={showRightSlider} 
                setShowRightSlider={setShowRightSlider} 
            />
        </div>
    )
}

export default ChatDisplayMain
