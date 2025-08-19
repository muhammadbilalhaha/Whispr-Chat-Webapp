import React, { useCallback, useContext, useState } from 'react'; // Import React and some hooks
import { useDropzone } from 'react-dropzone'; // Import Dropzone hook for drag and drop file upload
import HomeContext from '../../homeContext/homeContext'; // Import context to share state globally
import { IoCloseSharp, IoSend } from "react-icons/io5"; // Import close and send icons
import { messageStore } from '../../../../../store/messageStore'; // Import message state store (Zustand)

// Main component function
const ImageUploaderDisplay = () => {
    const [preview, setPreview] = useState(null); // State to store image preview
    const [caption, setCaption] = useState(''); // State to store caption for image
    const { setImageUploaderDisplay, activeFriend } = useContext(HomeContext); // Access shared state and functions from context

    const { setMessageText, setMessageImage, sendMessage } = messageStore(); // Get actions from message store

    // Function to handle when user drops/selects an image file
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]; // Get the first selected file
        if (file) {
            const reader = new FileReader(); // Create file reader
            reader.onload = () => setPreview(reader.result); // Set preview image when loaded
            reader.readAsDataURL(file); // Read file as base64 string
        }
    }, []); // Empty dependency array means this won't change

    // Setup dropzone behavior
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, // Use onDrop handler defined above
        accept: { 'image/*': [] }, // Only allow image files
        multiple: false, // Only allow one image at a time
    });

    // Function to handle send button click
    const handleSend = async () => {
        if (!activeFriend?._id) {
            console.error("No active friend selected"); // Show error if no friend selected
            return;
        }

        try {
            setMessageText(caption); // Save caption text to store
            setMessageImage(preview); // Save image (base64) to store
            await sendMessage(activeFriend._id); // Send message to active friend

            setPreview(null); // Clear image preview
            setCaption(''); // Clear caption input
            setImageUploaderDisplay(false); // Close the uploader box
        } catch (err) {
            console.error("Failed to send image message:", err); // Log error if message fails
        }
    };

    return (
        <>
            {/* Close button (top left) */}
            <div
                className="absolute text-gray-300 font-bold top-5 left-5 h-10 w-10 p-1 flex items-center justify-center hover:bg-gray-700 rounded-full cursor-pointer"
                onClick={() => setImageUploaderDisplay(false)} // Close uploader when clicked
            >
                <IoCloseSharp size={35} /> {/* Close icon */}
            </div>

            {/* Main container */}
            <div className="perfectCenter rounded-lg shadow-lg text-white max-w-[70%] space-y-4">

                {/* If there is no image selected, show drop area */}
                {!preview && (
                    <div
                        {...getRootProps()} // Spread dropzone root props
                        className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer"
                    >
                        <input {...getInputProps()} /> {/* Hidden file input */}
                        {
                            isDragActive
                                ? <p>Drop the image here ...</p> // Text when dragging file
                                : <p>Drag & drop an image here, or click to select</p> // Default text
                        }
                    </div>
                )}

                {/* If image is selected, show preview and caption box */}
                {preview && (
                    <div className="space-y-2 p-5 w-[80vw] perfectCenter flex-col gap-8 max-h-[90vh] overflow-y-auto">

                        {/* Image Preview Box */}
                        <div className="w-full max-h-[70vh] overflow-hidden rounded">
                            <img
                                src={preview} // Set image source
                                alt="Preview"
                                className="w-full h-auto max-h-[70vh] object-contain rounded" // Responsive image styles
                            />
                        </div>

                        {/* Caption Input and Send Button */}
                        <div className="caption-sendButton w-full perfectCenter gap-5">
                            <textarea
                                placeholder="Add a caption..." // Placeholder text
                                value={caption} // Value from state
                                onChange={(e) => setCaption(e.target.value)} // Update caption
                                className="w-full p-3 rounded bg-[#2e2e2e] resize-none text-white outline-none"
                                rows={1} // Initial height
                            />
                            <button
                                onClick={handleSend} // Send message when clicked
                                className="bg-red-500 hover:bg-red-600 p-2 h-11 w-11 rounded-full text-white perfectCenter cursor-pointer"
                            >
                                <IoSend size="25px" /> {/* Send icon */}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ImageUploaderDisplay; // Export the component
