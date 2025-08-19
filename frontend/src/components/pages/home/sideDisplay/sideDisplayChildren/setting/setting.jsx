import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

import HomeContext from '../../../homeContext/homeContext';
import LogoutModal from '../../../../authentication/logoutModal';
import { userAuthenticationStore } from '../../../../../../store/userAuthenticationStore';
import AccountSetting from './accountSetting/accountSetting';

import { RiAccountCircleFill, RiLogoutBoxRLine, RiDashboardFill } from "react-icons/ri";

const UserSetting = () => {
    const { setActiveItem, userProfileDetails } = useContext(HomeContext);
    const [showAccountSetting, setShowAccountSetting] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { userLogout } = userAuthenticationStore();

    const user = {
        userName: userProfileDetails.userName,
        email: userProfileDetails.email,
        image: userProfileDetails.profilePicture,
        role: userProfileDetails.role
    }

    const settingList = [
        { icons: <RiAccountCircleFill />, label: "Account", onClick: () => setShowAccountSetting(true) },
        { icons: <RiLogoutBoxRLine />, label: "Logout", onClick: () => setShowLogoutModal(true) },
    ];

    if (user.role === "master" || user.role === "admin") {
        settingList.unshift({
            icons: <RiDashboardFill />,
            label: "Dashboard",
            to: "/dashboard" // Use this for Link
        });
    }

    return (
        <div className="mainContainer relative w-full p-3 select-none flex flex-col overflow-x-clip justify-center gap-12">
            <AccountSetting showAccountSetting={showAccountSetting} setShowAccountSetting={setShowAccountSetting} />

            <h1 className="text-[20px] font-bold mb-4">Setting</h1>

            <div
                className="userProfileParent flex items-center justify-start gap-5 hover:bg-gray-700 p-3 rounded-md cursor-pointer"
                onClick={() => setActiveItem("profile")}
            >
                <div className="userPicture perfectCenter h-[80px] w-[80px] rounded-full overflow-hidden bg-gray-200 text-white text-[60px] font-bold">
                    <img
                        src={user?.image || "/defaultImage.png"}
                        alt="User"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/defaultImage.png";
                        }}
                    />
                </div>
                <div className="userDetails flex flex-col gap-2">
                    <p className="userName">{user.userName}</p>
                    <p className="userEmail">{user.email}</p>
                </div>
            </div>

            <ul className="settingList">
                {settingList.map((item, index) => {
                    const isDashboard = item.label === "Dashboard";
                    const isLogout = item.label === "Logout";

                    const classes = `flex items-center gap-6 p-[10px_10px] cursor-pointer rounded-md ${isLogout
                            ? "text-[#f51b1be3] hover:bg-[#fb2c36e0] hover:text-white"
                            : "hover:bg-gray-600"
                        }`;

                    return (
                        <li key={index}>
                            {isDashboard ? (
                                <Link to={item.to} className={classes}>
                                    <span className="text-[25px]">{item.icons}</span>
                                    <p>{item.label}</p>
                                </Link>
                            ) : (
                                <div onClick={item.onClick} className={classes}>
                                    <span className="text-[25px]">{item.icons}</span>
                                    <p>{item.label}</p>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            {showLogoutModal && (
                <LogoutModal
                    setShowLogoutModal={setShowLogoutModal}
                    userLogout={userLogout}
                />
            )}
        </div>
    );
};

export default UserSetting;
