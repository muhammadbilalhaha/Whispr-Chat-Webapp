// Import React, hooks, Formik components, icons, and validation
import React, { useContext, useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { IoArrowBack, IoCamera } from "react-icons/io5";
import PasswordSetting from './passwordSetting'; // Component to change password
import { loggedinUserStore } from '../../../../../../../store/loggedinUserStore'; // Zustand store for user
import HomeContext from '../../../../homeContext/homeContext'; // Context for profile data
import * as Yup from "yup" // For form validation

// Component starts here
const AccountSetting = ({ showAccountSetting, setShowAccountSetting }) => {

    const { userUpdateProfile } = loggedinUserStore(); // Update user profile function
    const isLoading = loggedinUserStore((state) => state.isLoading); // Loading state from store

    const { userProfileDetails, setUserProfileDetails } = useContext(HomeContext); // Get and set user profile from context

    const [passwordSetting, setPasswordSetting] = useState(false); // Control password setting screen visibility

    // Create a user object from profile details
    const user = {
        userName: userProfileDetails?.userName,
        email: userProfileDetails?.email,
        profilePicture: userProfileDetails?.profilePicture,
    };

    // Called when form is submitted
    const handleSubmit = async (values) => {
        await userUpdateProfile(values); // Call update function
        setUserProfileDetails(values); // Update profile in context
    };

    // When user selects an image, show preview
    const imageHandler = (event, setFieldValue) => {
        const file = event.currentTarget.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a file reader
            reader.onloadend = () => {
                setFieldValue('profilePicture', reader.result); // Set base64 string in form field
            };
            reader.readAsDataURL(file); // Read file as base64
        }
    };

    // Form validation rules
    const validationSchema = Yup.object({
        userName: Yup.string()
            .min(3, 'Name must be at least 3 characters')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
    });

    return (
        <div className={`mainContainer absolute top-0  w-full bg-[#111b21] p-3 select-none flex flex-col justify-center gap-12 transition-all duration-300 
            ${showAccountSetting ? "left-0" : "left-[100%]"} ${passwordSetting ? "left-[-100%]" : ""}`}>

            {/* PasswordSetting component (slides in if true) */}
            <PasswordSetting passwordSetting={passwordSetting} setPasswordSetting={setPasswordSetting} />

            {/* Header with back button */}
            <div className="backArrow-heading flex items-center gap-5">
                <div className="backArrow perfectCenter cursor-pointer" onClick={() => setShowAccountSetting(false)}>
                    <IoArrowBack size={"25px"} />
                </div>
                <h1 className="text-[20px]">Account</h1>
            </div>

            {/* Formik for form handling */}
            <Formik
                initialValues={{
                    userName: user.userName || "",
                    email: user.email || "",
                    profilePicture: user.profilePicture,
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {({ values, handleChange, setFieldValue }) => (
                    <Form className="w-full flex flex-col gap-4">

                        {/* Profile Image Block */}
                        <div className="userProfileParent perfectCenter rounded-full relative h-[200px] w-[200px] group mx-auto">
                            <div className={`userPicture h-[200px] w-[200px] rounded-full overflow-clip bg-gray-200 text-white text-[60px] font-bold flex items-center justify-center hover:shadow-lg transition-shadow relative`}>

                                {/* If image exists, show it */}
                                <img
                                    src={values?.profilePicture || "/defaultImage.png"}
                                    alt="User"
                                    className={`h-full w-full rounded-full object-cover ${isLoading ? "bg-white animate-pulse" : ""}`}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/defaultImage.png";
                                    }}
                                />

                                {/* Camera icon overlay for uploading image */}
                                <label
                                    htmlFor="profilePicture"
                                    className="absolute inset-0 flex rounded-full items-center justify-center group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gray-700 opacity-0 group-hover:opacity-50 transition-opacity rounded-full z-0" />

                                    <span className="z-10 flex flex-col opacity-0 group-hover:opacity-100 items-center justify-center text-white text-2xl transition-opacity">
                                        <IoCamera />
                                        <p className="text-sm w-[70%] font-normal mt-2 text-center">CHANGE PROFILE PHOTO</p>
                                    </span>
                                </label>

                                {/* Hidden input for image file */}
                                <input
                                    id="profilePicture"
                                    name="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => imageHandler(event, setFieldValue)}
                                />
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="userName mt-5">
                            <label htmlFor="userName" className="block text-red-400 text-md">Your name</label>
                            <Field
                                className='w-full h-10 p-[2px_5px] outline-none bg-gray-700 rounded-sm'
                                type="text"
                                name="userName"
                                value={values.userName}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="userName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Email Field */}
                        <div className="email mt-3">
                            <label htmlFor="email" className="block text-red-400 text-md">Your email</label>
                            <Field
                                className='w-full h-10 p-[2px_5px] outline-none bg-gray-700 rounded-sm'
                                type="text"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Save Button */}
                        <button type="submit" className="mt-5 p-3 bg-red-500 rounded-full active:scale-[0.98] duration-300 cursor-pointer text-white">
                            Save
                        </button>

                        {/* Change Password Button */}
                        <button type="button" onClick={() => setPasswordSetting(true)} className="p-3 bg-black rounded-full active:scale-[0.98] duration-300 cursor-pointer text-white">
                            Change Password
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AccountSetting;
