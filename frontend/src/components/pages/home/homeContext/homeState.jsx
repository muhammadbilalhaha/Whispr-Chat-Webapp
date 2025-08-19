// Import required React hooks and context
import React, { useEffect, useState } from 'react';
import HomeContext from './homeContext';

// Import Zustand stores
import { userAuthenticationStore } from '../../../../store/userAuthenticationStore';
import { loggedinUserStore } from '../../../../store/loggedinUserStore';
import { messageStore } from '../../../../store/messageStore';

// This component will wrap parts of your app and provide shared data using context
const HomeState = (props) => {


    const { authenticationUser, checkAuthentication } = userAuthenticationStore.getState(); // Get data and functions from authentication store
    const { isLoading, setSelectedFriend } = loggedinUserStore.getState();  // Get data and functions from user (friend) store
    const [activeFriend, setActiveFriend] = useState(null); // Store the currently selected friend
    const [activeItem, setActiveItem] = useState("chat"); // Store which tab is currently active (chat, profile, etc.)
    const [showRightSlider, setShowRightSlider] = useState(false); // Control whether the right-side panel (slider) is shown
    const [searchText, setSearchText] = useState(''); // Store the search text typed by the user
    const [imageUploaderDisplay, setImageUploaderDisplay] = useState(false); // Show or hide the image uploader

    // Store the logged-in user's profile details
    const [userProfileDetails, setUserProfileDetails] = useState({
        userName: "",
        email: "",
        profilePicture: ""
    });

    // Whenever activeFriend changes, update it in the global Zustand store
    useEffect(() => {
        setSelectedFriend(activeFriend);
    }, [activeFriend]);

    // Run checkAuthentication function only one time when component mounts
    useEffect(() => {
        checkAuthentication();
    }, []);

    useEffect(() => {
        messageStore.getState().fetchUnreadCounts();
    }, []);


    // When authenticationUser is available, set it in the local profile state
    useEffect(() => {
        if (authenticationUser && authenticationUser.userName) {
            setUserProfileDetails({
                userName: authenticationUser.userName,
                email: authenticationUser.email,
                profilePicture: authenticationUser.profilePicture,
                role: authenticationUser.role
            });
        }
    }, [authenticationUser]);

    // Return the context provider to share these states and functions with child components
    return (
        <HomeContext.Provider value={{
            activeItem, setActiveItem,                 // Active tab
            userProfileDetails, setUserProfileDetails, // User info
            activeFriend, setActiveFriend,             // Selected friend
            showRightSlider, setShowRightSlider,       // Toggle right panel
            searchText, setSearchText,                 // Search input
            imageUploaderDisplay, setImageUploaderDisplay, // Show/hide image upload
            isLoading                                  // Loading state
        }}>
            {props.children}  {/* Render all children inside the context */}
        </HomeContext.Provider>
    );
};

// Export this component to wrap your Home or main layout
export default HomeState;
