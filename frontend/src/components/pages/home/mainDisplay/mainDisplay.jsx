import React, { useContext, useEffect } from 'react';
import DefaultDisplay from './defaultDisplay';
import HomeContext from '../homeContext/homeContext';
import ChatDisplayMain from './chatDisplay/chatDisplayMain';

const MainDisplay = () => {

    const { activeFriend } = useContext(HomeContext);


    return (
        <div className="mainContainer flex w-[72%]">
            <div className="subMainContainer w-full bg-[#222e35]">
                {activeFriend ? <ChatDisplayMain /> : <DefaultDisplay />}
            </div>
        </div>

    )
}

export default MainDisplay
