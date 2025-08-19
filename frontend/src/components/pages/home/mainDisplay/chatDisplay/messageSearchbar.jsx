// Import React and necessary hooks
import React, { useContext, useState } from 'react'

// Import global context to access shared data/functions
import HomeContext from '../../homeContext/homeContext';

// Import search icon from react-icons
import { IoMdSearch } from "react-icons/io";

// Define the MessageSearchbar component
const MessageSearchbar = () => {

    // Get setSearchText function from context to update global search text
    const { setSearchText } = useContext(HomeContext);

    // Local state to hold the current value in the search input
    const [searchTerm, setSearchTerm] = useState('');

    // Function that runs when user types in the input
    const handleChange = (e) => {
        const value = e.target.value; // Get the current input value
        setSearchTerm(value); // Update the local input state
        setSearchText(value.trim().toLowerCase()); // Update global search text (in lowercase, trimmed)
    };

    return (
        // Outer container with some padding
        <div className="searchField perfectCenter px-[10px]">

            {/* Wrapper for input and search button */}
            <div className="relative flex items-center justify-center gap-[15px] group">

                {/* Search button positioned inside the input */}
                <button
                    className="flex items-center clickEffect justify-center absolute right-0 w-[50px] h-[50px] rounded-full bg-transparent cursor-pointer transition-all duration-200"
                >
                    <IoMdSearch size={"25px"} /> {/* Search icon */}
                </button>

                {/* Search input field */}
                <input
                    placeholder="search.." // Placeholder text
                    name="text" // Input name
                    type="text" // Input type
                    value={searchTerm} // Value from local state
                    onChange={handleChange} // Update input when user types
                    className="text-white placeholder-[#8f8f8f] border-red-500 font-sans text-[17px] pr-10
                    h-[50px] w-[50px] rounded-full outline-none px-[10px] 
                    transition-all ease-in-out duration-500
                    focus:w-[250px] focus:rounded-none focus:bg-transparent 
                    focus:border-b-[1px] focus:border-red-500 focus:shadow-none
                    group-focus-within:w-[250px] group-focus-within:rounded-none 
                    group-focus-within:bg-transparent group-focus-within:border-b-[2px] 
                    group-focus-within:border-red-500 group-focus-within:shadow-none"
                // Styling notes:
                // - Starts as small rounded circle (50px)
                // - Expands when focused (250px wide)
                // - Removes border and background on focus
                // - Uses smooth transition animation
                />
            </div>
        </div>
    );
};

// Export the component to use in other files
export default MessageSearchbar;
