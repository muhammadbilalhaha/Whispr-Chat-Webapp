import React, { useContext, useEffect } from 'react';
import Asidebar from './asideBar';
import SideDisplay from './sideDisplay/sideDisplay';
import HomeState from './homeContext/homeState';
import MainDisplay from './mainDisplay/mainDisplay';
import AdminDashboard from '../dashboard/dashboardMain';
import HomeContext from './homeContext/homeContext';
import { userAuthenticationStore } from '../../../store/userAuthenticationStore';
import { messageStore } from '../../../store/messageStore';

const HomeContent = () => {
    const { activeItem } = useContext(HomeContext);
    const socket = userAuthenticationStore((state) => state.socket);
    const subscribeToAllMessages = messageStore((state) => state.subscribeToAllMessages);

    useEffect(() => {
        if (socket) {
            subscribeToAllMessages(); // Always listen for new messages
        }
    }, [socket]);

    return (
        <>
            {activeItem === "dashboard" ? (
                <AdminDashboard />
            ) : (
                <main className='flex w-full h-full overflow-clip'>
                    <Asidebar />
                    <SideDisplay />
                    <MainDisplay />
                </main>
            )}
        </>
    );
};

const Home = () => {
    return (
        <HomeState>
            <HomeContent />
        </HomeState>
    );
};

export default Home;
