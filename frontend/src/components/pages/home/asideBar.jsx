import React, { useContext } from 'react'
import HomeContext from './homeContext/homeContext';
import { loggedinUserStore } from '../../../store/loggedinUserStore';


// icons
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

const Asidebar = () => {

    const { activeItem, setActiveItem, userProfileDetails, setShowRightSlider, setActiveFriend } = useContext(HomeContext);
    const isLoading = loggedinUserStore((state) => state.isLoading);


    return (
        <aside onClick={() => {
            setShowRightSlider(false);
        }} className='h-[100vh] w-17 bg-[#202c33] pt-12 pb-8 flex flex-col justify-between items-center boxShadow select-none'>

            <div data-tip="Chat" className="upMenu tooltip tooltip-right tooltip-warning perfectCenter">
                <ul className='perfectCenter'>
                    <li
                        onClick={() => setActiveItem("chat")}
                        className={` cursor-pointer rounded-lg p-[8px_18px] w-[95%] border-l-3
                            ${activeItem === "chat" ? "border-l-red-500 bg-gray-500" : "border-l-transparent hover:bg-gray-500"}`}
                    >
                        <IoChatboxEllipsesOutline className='w-[100%]' size={"25px"} />
                    </li>
                </ul>
            </div>

            <div className="downMenu perfectCenter">
                <ul className='perfectCenter flex-col gap-4'>
                    <li
                        onClick={() => {
                            setActiveItem("settings");
                            setActiveFriend(null);
                        }}
                        className={`  rounded-full perfectCenter 
                            ${activeItem === "settings" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                    >
                        <button data-tip="Setting" className='flex tooltip tooltip-right tooltip-warning cursor-pointer justify-center items-center w-10 h-10 rounded-full font-bold'>
                            <IoSettingsOutline size={"25px"} />
                        </button>
                    </li>

                    <div className="tooltip tooltip-right tooltip-warning" data-tip="Profile">
                        <li
                            onClick={() => {
                                setActiveItem("profile");
                                setActiveFriend(null);
                            }}
                            className={`flex justify-center items-center h-[48px] w-[48px] p-1 cursor-pointer rounded-full overflow-hidden font-bold 
            ${activeItem === "profile" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            <img
                                src={userProfileDetails?.profilePicture || "/defaultImage.png"}
                                alt="User"
                                className={`h-full w-full rounded-full object-cover ${isLoading ? "bg-gray-200 animate-pulse" : ""}`}
                                onError={(e) => {
                                    e.currentTarget.onerror = null; // Prevents infinite loop in case default also fails
                                    e.currentTarget.src = "/defaultImage.png";
                                }}
                            />

                        </li>
                    </div>

                </ul>
            </div>

        </aside>
    )
}

export default Asidebar;
