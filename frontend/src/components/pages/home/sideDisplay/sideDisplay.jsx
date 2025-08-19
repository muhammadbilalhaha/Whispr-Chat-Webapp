import React, { useContext } from 'react';
import UserProfile from './sideDisplayChildren/userProfile/userProfile';
import UserSetting from './sideDisplayChildren/setting/setting';
import UserFriendList from './sideDisplayChildren/userFriendList/userFriendList';
import HomeContext from '../homeContext/homeContext';

const SideDisplay = () => {
    const { activeItem } = useContext(HomeContext);

    const renderComponent = () => {
        switch (activeItem) {
            case 'chat':
                return <UserFriendList />;

            case 'profile':
                return <UserProfile />;

            case 'settings':
                return <UserSetting />;

            default:
                return <UserFriendList />;
        }
    };

    return (
        <div className="mainContainer select-none h-[100vh] w-[25%] bg-[#111b21]">
            <div className="container ">
                    {renderComponent()}
            </div>
        </div>
    );
};

export default SideDisplay;
