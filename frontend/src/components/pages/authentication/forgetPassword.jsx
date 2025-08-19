import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from './Navbar';
import { MdEmail } from "react-icons/md";
import { Link, replace, useNavigate } from 'react-router-dom';
import { userAuthenticationStore } from '../../../store/userAuthenticationStore';

const ForgetPassword = () => {
    const [unknownError, setUnknownError] = useState(""); // State for unknown error messages

    const { userForgetPassword } = userAuthenticationStore();

    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="w-full lg:h-[88vh] perfectCenter select-none">
                <div className="lg:w-[80%] md:w-[100%] sm:w-[100%] flex flex-col sm:flex-row items-center justify-between">
                    <div className="leftContainer lg:w-[50%] md:w-full sm:w-full perfectCenter flex-col p-6">
                        <h2 className="text-3xl font-bold mb-4">Forget Password</h2>
                        <p className="text-gray-500 mb-4">Enter email & get reset password link.</p>
                        {/* Display any unknown errors */}
                        <div className="unknownError text-[#ec3232] text-md mt-1 ml-1.5">{unknownError}</div>

                        <Formik
                            initialValues={{ email: '' }}
                            validateOnBlur={false}
                            validateOnChange={false}
                            validationSchema={Yup.object({
                                email: Yup.string().email('Invalid email address').required('Email is Required!'),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                setUnknownError(""); // Reset previous errors
                                try {
                                    const response = await userForgetPassword(values);
                                    if (response.success) {
                                        navigate('/emailSentSuccessfull', {replace: true});
                                    }
                                } catch (error) {
                                    setUnknownError("An unexpected error occurred. Please try again later.");
                                }
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="flex flex-col text-white lg:w-[550px] md:w-[500px] sm:w-[400px] w-[400px] gap-5 p-6 rounded-4xl">

                                    {/* Email Field */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium" htmlFor="email">Email</label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Field
                                                className={`border-gray-500 border p-2 pl-10 w-full rounded-sm ${touched.email && errors.email ? 'border-red-500' : ''}`}
                                                type="email"
                                                name="email"
                                                placeholder="bilal@example.com"
                                            />
                                        </div>
                                        <ErrorMessage className="text-[#f11f1fec] text-sm mt-1 ml-1.5" name="email" component="div" />
                                    </div>

                                    {/* Submitting Button */}
                                    <div className="submitButton flex justify-center w-full">
                                        <button
                                            className={`btn w-full h-[50px] text-[18px] bg-gray-700 cursor-pointer active:scale-95 duration-100 text-white rounded-lg flex items-center justify-center gap-2 
                                            ${unknownError || errors.email ? 'shadow-[0px_0px_5px_#ec3232] border-1 border-red-500 animate-shake' : ''}`}
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Send Email"}
                                        </button>
                                    </div>

                                    {/* Link to login page */}
                                    <Link to="/login"
                                        className="btn w-full h-[50px] text-[18px] bg-black cursor-pointer active:scale-95 duration-100 text-white rounded-lg flex items-center justify-center gap-2">
                                        Login
                                    </Link>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="rightContainer lg:w-[50%] md:w-full sm:w-full flex items-center justify-center text-white mt-6 sm:mt-0">
                        <div className="text-center lg:w-[80%] sm:w-full lg:p-8 perfectCenter flex-col">
                            <img className='w-[300px] rounded-4xl' src="/authenticationImages/forgetPassword.gif" alt="" />
                            <h2 className="text-3xl font-bold mb-2 mt-2">Forget Password</h2>
                            <p className="text-[#c4c4c4] w-full p-[10px] ">
                                "No worries! Simply enter your registered email address below, and we'll send you instructions to reset your password. Regain access to your account and continue enjoying all the features."
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ForgetPassword;
