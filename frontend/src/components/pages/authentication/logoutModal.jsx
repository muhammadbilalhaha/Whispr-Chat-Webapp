import React from 'react'

const LogoutModal = ({setShowLogoutModal, userLogout}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000a6]">
            <div className="bg-[#3b4a54] text-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-white">Confirm Logout</h2>
                <p className="mb-6 text-gray-300">Are you sure you want to log out?</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowLogoutModal(false)}
                        className="px-4 py-2 cursor-pointer rounded-full border border-gray-400 text-gray-300 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            userLogout();
                            setShowLogoutModal(false);
                        }}
                        className="px-4 py-2 cursor-pointer rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutModal
