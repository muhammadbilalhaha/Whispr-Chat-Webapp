import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { TiPlus } from "react-icons/ti";
import { FaArrowLeft } from "react-icons/fa6";
import { loggedinUserStore } from '../../../../../../store/loggedinUserStore';

const AddNewFriendSlider = ({ addFriendSlider, setAddFriendSlider, onFriendAdded }) => {
    // This state saves what user types in the input
    const [searchEmail, setSearchEmail] = useState('');

    // This state saves the list of users found from search
    const [searchResults, setSearchResults] = useState([]);

    // Get functions from the store
    const { searchNewFriend, addNewFriend } = loggedinUserStore();

    // When searchEmail changes, wait 500ms before searching
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchEmail.trim()) {
                handleSearch(searchEmail);  // search user by email
            } else {
                setSearchResults([]);  // if empty input, clear results
            }
        }, 500);

        return () => clearTimeout(delayDebounce);  // cleanup timeout
    }, [searchEmail]);

    // Function to search new user by email
    const handleSearch = async (email) => {
        try {
            const users = await searchNewFriend(email);  // call backend
            if (Array.isArray(users)) {
                setSearchResults(users);  // if found, save users
            } else {
                setSearchResults([]);  // else show nothing
            }
        } catch (error) {
            console.log("Search error", error);
            setSearchResults([]);  // on error, show nothing
        }
    };

    // Function to add new friend when (+) button is clicked
    const handleAddFriend = async (email) => {
        const res = await addNewFriend(email);  // call backend
        if (res?.data?.success) {
            // Remove that user from the search list
            setSearchResults(prev => prev.filter(user => user.email !== email));

            // Clear the input box
            setSearchEmail("");

            // Call callback function if exists
            if (typeof onFriendAdded === 'function') {
                onFriendAdded();
            }
        }
    };


    return (
        <div
            className={`mainContainer border-r border-gray-600 w-full h-full z-50 bg-[#111b21] overflow-auto absolute top-0 transition-all duration-200 ease-in-out ${addFriendSlider ? "left-0" : "-left-[120%]"}`}
        >
            {/* Top bar with back arrow and heading */}
            <div className="subContainer px-2 pt-7 mb-3">
                <div className="leftArrow-Heading flex items-center gap-6 mb-5">
                    <div className="leftArrow perfectCenter cursor-pointer clickEffect" onClick={() => setAddFriendSlider(false)}>
                        <FaArrowLeft size={"25px"} />
                    </div>
                    <h1 className="text-[20px] font-bold">Add New Friend</h1>
                </div>

                {/* Search input bar */}
                <div className="searchBar flex items-center rounded-lg p-[2px_10px] bg-[#202c33]">
                    <div className='text-[25px] text-gray-400'><IoMdSearch /></div>
                    <input
                        className='w-full p-[4px_10px] focus:outline-none text-[15px]'
                        type="email"
                        placeholder="Enter Your Friend Email"
                        autoComplete='off'
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                </div>
            </div>

            {/* Show search results below */}
            <div className="newFriendList">
                {searchResults.map(user => (
                    <div key={user._id} className="singleCard cursor-pointer hover:bg-gray-700 p-2 m-2 rounded-md flex justify-between items-center gap-2 md:flex-col">
                        <div className="userImage-userName-userEmail flex items-center gap-2 md:flex-col">

                            {/* Show user image or initials if no image */}
                            <div className="userImage w-[80px] h-[80px] perfectCenter overflow-clip rounded-full">
                                <img
                                    src={user?.profilePicture || "/defaultImage.png"}
                                    alt="User"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/defaultImage.png";
                                    }}
                                />

                            </div>

                            {/* Show user name and email */}
                            <div className="userEmail-userName md:text-center">
                                <div className="userName text-white font-semibold">{user.userName}</div>
                                <div className="userEmail text-gray-300 text-[15px]">{user.email}</div>
                            </div>
                        </div>

                        {/* Add friend button */}
                        <button
                            className="addButton w-[50%] h-[40px] hover:bg-white hover:text-black perfectCenter rounded-full cursor-pointer clickEffect"
                            onClick={() => handleAddFriend(user.email)}
                        >
                            <TiPlus size={"25px"} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddNewFriendSlider;
