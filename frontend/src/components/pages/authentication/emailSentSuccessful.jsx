import React from 'react';

const EmailSentSuccessful = () => {
    return (
        <main className="w-full h-screen flex justify-center items-center">
            <div className="w-[500px] text-center p-5 rounded-lg flex flex-col justify-center items-center gap-5 shadow-md">
                <img src="/authenticationImages/tick.png" alt="Success Icon" width="100px" />
                <h1 className="text-2xl font-bold">Email Sent Successfully</h1>
                <p className="text-gray-500">
                    We've sent a password reset link to your email. Please check your inbox to continue.
                </p>
            </div>
        </main>
    );
}

export default EmailSentSuccessful;
