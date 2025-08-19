import React from 'react'

const DefaultDisplay = () => {
    return (
        <div className="mainContainer perfectCenter w-full h-full p-1 bg-[#222e35]">
            <div className="subContainer w-2xl flex flex-col items-center justify-center gap-5">
                <h1 className="welcomeHeading text-3xl text-white font-semibold">Welcome to Your Chat Space</h1>
                <p className="description text-[15px] text-center text-gray-300">Start chatting instantly with friends and contacts. Your conversations are secure, fast, and always in sync. Select a contact to begin chatting now.</p>
            </div>
        </div>
    )
}

export default DefaultDisplay
