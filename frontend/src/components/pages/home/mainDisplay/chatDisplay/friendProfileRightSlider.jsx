import React, { useContext } from 'react'
import { IoMdClose } from "react-icons/io";
import HomeContext from '../../homeContext/homeContext';

const FriendProfileRightSlider = ({ showRightSlider, setShowRightSlider }) => {

    const { activeFriend } = useContext(HomeContext);


    return (
        // Main container for the right-side profile slider
        <div
            className={`h-full border-l border-gray-600 transition-all duration-300 ease-in-out
                ${
                // If the slider is open → show with width and padding
                // Else → hide using transform and opacity
                showRightSlider
                    ? 'w-[400px] -translate-y-0 opacity-100 p-4'
                    : '-translate-y-[30px] scale-x-0.40 opacity-0'
                }
                overflow-hidden`}
        >
            {
                // If slider is open, render the inside content
                showRightSlider && (
                    <div className="w-full">
                        {/* Top section with Close button and title */}
                        <div className="close-ContactInfo flex items-center gap-5">
                            <div
                                onClick={() => setShowRightSlider(false)}
                                className="closeIcon cursor-pointer w-[35px] h-[35px] hover:bg-gray-700 rounded-full perfectCenter"
                            >
                                <IoMdClose size={"25px"} />
                            </div>
                            <p>Contact Info</p>
                        </div>

                        {/* Main body section with animation */}
                        <div
                            className={`mainBody transition-all duration-300 ease-in-out overflow-hidden 
                                ${
                                // If open → show full content
                                // Else → collapse it with animation
                                showRightSlider
                                    ? 'opacity-100 translate-y-0 max-h-[1000px] visible'
                                    : 'opacity-0 -translate-y-5 max-h-0 invisible'
                                }
                            `}
                        >
                            <div className="image-userName-email perfectCenter flex-col gap-3 m-12">

                                {/* Profile image or initials */}
                                <div className="userImage overflow-clip bg-red-600 w-[160px] h-[160px] rounded-full">
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

                                {/* Username */}
                                <div className="userName w-full text-center text-[20px]">
                                    {activeFriend.userName}
                                </div>

                                {/* Email */}
                                <div className="userEmail w-full text-center text-[14px] text-gray-300">
                                    {activeFriend.email}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default FriendProfileRightSlider
