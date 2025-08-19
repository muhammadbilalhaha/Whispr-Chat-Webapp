import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from "yup"
import { IoArrowBack, IoEye, IoEyeOff } from 'react-icons/io5'
import { RiLockPasswordFill } from "react-icons/ri";

const PasswordSetting = ({ passwordSetting, setPasswordSetting }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Formik Validation Schema
    const validationSchema = Yup.object({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
    })

    // handle form submit
    const handleSubmit = (values) => {
        console.log(values);
    }

    return (
        <div className={`mainContainer absolute top-0  w-full bg-[#111b21] p-3 select-none flex flex-col justify-center gap-12 transition-all duration-300 
            ${passwordSetting ? "left-[100%]" : "left-[100%]"}`}>
            <div className="backArrow-heading flex items-center gap-5">
                <div className="backArrow perfectCenter cursor-pointer" onClick={() => setPasswordSetting(false)}><IoArrowBack size={"25px"} /></div>
                <h1 className="text-[20px]">Password</h1>
            </div>

            <Formik initialValues={{ password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="flex flex-col gap-8 mt-10">
                        <div className="passwordIcon perfectCenter text-center"><RiLockPasswordFill size={"40px"} /></div>
                        <p className="text-gray-400 text-md text-center">Update your password to keep your account secure and private. A strong password helps protect your personal information from unauthorized access.</p>

                        {/* Password Field */}
                        <div className="relative">
                            <label htmlFor="password" className="text-red-400 text-md">New Password</label>
                            <Field
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="w-full h-10 px-3 pr-10 bg-gray-700 text-white rounded-sm outline-none"
                            />
                            <span
                                className="absolute top-[36px] right-3 text-white cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOff /> : <IoEye />}
                            </span>
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="text-red-400 text-md">Confirm Password</label>
                            <Field
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                className="w-full h-10 px-3 pr-10 bg-gray-700 text-white rounded-sm outline-none"
                            />
                            <span
                                className="absolute top-[36px] right-3 text-white cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                            </span>
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <button type="submit" className="mt-3 p-3 cursor-pointer bg-red-500 rounded-full text-white active:scale-[0.98] duration-300">
                            Change Password
                        </button>
                    </Form>
                )}
            </Formik>

        </div>
    )
}

export default PasswordSetting
