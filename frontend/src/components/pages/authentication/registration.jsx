import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from './Navbar';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { userAuthenticationStore } from '../../../store/userAuthenticationStore.js';
import GoogleButton from './googleButton.jsx';

const Registration = () => {

    const {userRegistration} = userAuthenticationStore();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [unknownError, setUnknownError] = useState(""); // Add error handling state

    return (
        <>
            <Navbar />
            <div className=" w-full lg:h-[88vh] perfectCenter select-none ">
                <div className="lg:w-[80%] md:w-[100%] sm:w-[100%] flex flex-col sm:flex-row items-center justify-between">
                    <div className="leftContainer lg:w-[50%] md:w-full sm:w-full perfectCenter flex-col p-6">
                        <h2 className="text-3xl font-bold mb-4">Create Account</h2>
                        <p className="text-gray-500 mb-4">Get started with your free account.</p>
                        <GoogleButton/>
                        {/* Display unknown errors */}
                        <div className="unknownError text-[#ec3232] text-md mt-1 ml-1.5">{unknownError}</div>

                        <Formik
                            initialValues={{ userName: '', email: '', password: '', confirmPassword: '' }}
                            validateOnBlur={false}
                            validateOnChange={false}
                            validationSchema={Yup.object({
                                userName: Yup.string().required('User Name is Required!'),
                                email: Yup.string().email('Invalid email address').required('Email is Required!'),
                                password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is Required!'),
                                confirmPassword: Yup.string()
                                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                    .required('Confirm Password is Required!'),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                setUnknownError(""); // Reset any previous error message
                                const response = await userRegistration(values);
                                
                                if (!response.success) {
                                    setUnknownError(response.error); // Handle unknown errors
                                }

                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="flex flex-col text-white lg:w-[550px] md:w-[500px] sm:w-[400px] w-[400px] gap-5 p-6 rounded-4xl" >

                                    {/* User Name Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="userName">Username</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field className={`border-gray-500 border p-2 pl-10 w-full rounded-sm ${touched.userName && errors.userName ? 'border-red-500' : ''}`} type="text" name="userName" placeholder="Muhammad Bilal" />
                                        </div>
                                        <ErrorMessage className="text-[#f11f1fec] text-sm mt-1 ml-1.5" name="userName" component="div" />
                                    </div>

                                    {/* Email Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="email">Email</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field className={`border-gray-500 border p-2 pl-10 w-full rounded-sm ${touched.email && errors.email ? 'border-red-500' : ''}`} type="email" name="email" placeholder="bilal@example.com" />
                                        </div>
                                        <ErrorMessage className="text-[#f11f1fec] text-sm mt-1 ml-1.5" name="email" component="div" />
                                    </div>

                                    {/* Password Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="password">Password</label>
                                        <div className="relative">
                                            <RiLockPasswordFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field
                                                className={`border-gray-500 border p-2 pl-10 pr-10 w-full rounded-sm ${touched.password && errors.password ? 'border-red-500' : ''}`}
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <ErrorMessage className="text-[#f11f1fec] text-sm mt-1.5 ml-1.5" name="password" component="div" />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
                                        <div className="relative">
                                            <RiLockPasswordFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field
                                                className={`border-gray-500 border p-2 pl-10 pr-10 w-full rounded-sm ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}`}
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        <ErrorMessage className="text-[#f11f1fec] text-sm mt-1.5 ml-1.5" name="confirmPassword" component="div" />
                                    </div>

                                    {/* Submitting Button */}
                                    <div className="submitButton flex justify-center w-full">
                                        <button
                                            className={`btn w-full h-[50px] text-[18px] bg-gray-700 cursor-pointer active:scale-95 duration-100 text-white rounded-lg flex items-center justify-center gap-2 
    ${unknownError || errors.userName || errors.email || errors.password || errors.confirmPassword ? ' shadow-[0px_0px_5px_#ec3232] border-1 border-red-500 animate-shake' : ''}`}
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Sign up"}
                                        </button>
                                    </div>

                                    <div className="text-center mt-6">
                                        <p>Already have an account? <Link to={"/login"} className="text-[gray] font-bold hover:text-[#f77373]">Login</Link></p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="rightContainer lg:w-[50%] md:w-full sm:w-full flex items-center justify-center text-white mt-6 sm:mt-0">
                        <div className="text-center lg:w-[80%] sm:w-full lg:p-8 perfectCenter flex-col">
                            <img className='w-[350px]' src="/authenticationImages/registrationAnimation.gif" alt="" />
                            <h2 className="text-3xl font-bold mb-4">Join our Community</h2>
                            <p className="text-[#c4c4c4] w-full p-[10px]">
                                "Create an account to connect with friends, enjoy real-time messaging, and unlock exclusive features. Stay connected anytime, anywhere!"
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default Registration;
