import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from './Navbar';
import { userAuthenticationStore } from '../../../store/userAuthenticationStore.js';
import GoogleButton from './googleButton.jsx';

// icons
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';


const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [unknownError, setUnknownError] = useState("")
    const { userLogin } = userAuthenticationStore();

    return (
        <>
            <Navbar />
            <div className=" w-full lg:h-[88vh]  perfectCenter select-none ">
                <div className="lg:w-[80%] md:w-[100%] sm:w-[100%] flex flex-col sm:flex-row items-center justify-between">
                    <div className="leftContainer lg:w-[50%] md:w-full sm:w-full perfectCenter flex-col p-6">
                        <h2 className="text-3xl font-bold mb-4">Login</h2>
                        <p className="text-gray-500 mb-4">Enter your credentials to join the conversation.</p>
                        <GoogleButton/>
                        <div className="unknownError text-[#ec3232] text-md mt-1 ml-1.5">{unknownError}</div>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validateOnBlur={false}
                            validateOnChange={false}
                            validationSchema={Yup.object({
                                email: Yup.string().email('Invalid email address').required('Email is Required!'),
                                password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is Required!'),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                setUnknownError("");
                                const response = await userLogin(values);


                                if (!response.success) {
                                    setUnknownError(response.error);
                                }

                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, errors }) => (
                                <Form className="flex flex-col text-white lg:w-[550px] md:w-[500px] sm:w-[400px] w-[400px] gap-5 p-6 rounded-4xl" >

                                    {/* Email Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="email">Email</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field className="border-gray-500 border p-2 pl-10 w-full rounded-sm" type="email" name="email" placeholder="bilal@example.com" />
                                        </div>
                                        <ErrorMessage className="text-[#f11f1fec] text-sm mt-1 ml-1.5" name="email" component="div" />
                                    </div>

                                    {/* Password Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="password">Password</label>
                                        <div className="relative">
                                            <RiLockPasswordFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field
                                                className="border-gray-500 border p-2 pl-10 pr-10 w-full rounded-sm"
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

                                    <div className="text-center mt-6 w-full flex justify-start">
                                        <Link to={"/forgetPassword"} className="text-[gray] font-bold hover:text-[#f77373]">Forget Password?</Link>
                                    </div>

                                    {/* Submitting Button */}
                                    <div className="submitButton flex justify-center w-full">
                                        <button
                                            className={`btn w-full h-[50px] text-[18px] bg-gray-700 cursor-pointer active:scale-95 duration-100 text-white rounded-lg flex items-center justify-center gap-2 
    ${unknownError || errors.email || errors.password ? ' shadow-[0px_0px_5px_#ec3232] border-1 border-red-500 animate-shake' : ''}`}
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Login"}
                                        </button>

                                    </div>

                                    <div className="text-center mt-6">
                                        <p>Don't have an account? <Link to={"/registration"} className="text-[gray] font-bold hover:text-[#f77373]">Create account</Link></p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="rightContainer lg:w-[50%] md:w-full sm:w-full flex items-center justify-center text-white mt-6 sm:mt-0">
                        <div className="text-center lg:w-[80%] sm:w-full lg:p-8 perfectCenter flex-col">
                            <img className='w-[350px]' src="/authenticationImages/registrationAnimation.gif" alt="" />
                            <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
                            <p className="text-[#c4c4c4] w-full p-[10px] ">
                                "Enter your credentials to pick up where you left off and keep the conversation going."
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default Login;
