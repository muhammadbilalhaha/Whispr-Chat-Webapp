import React from 'react';
import { Link } from 'react-router-dom';

const ResetPasswordSuccessful = () => {
    return (
        <main className="w-full h-screen flex justify-center items-center">
            <div className="w-[500px] text-center p-5 rounded-lg flex flex-col justify-center items-center gap-5 shadow-md">
                <img src="/authenticationImages/tick.png" alt="Success Icon" width="100px" />
                <h1 className="text-2xl font-bold">Password Reset Successfully</h1>
                <p className="text-gray-500">
                    Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Link to="/login" className="px-20 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition">
                    Go to Login
                </Link>
            </div>
        </main>
    );
}

export default ResetPasswordSuccessful;
