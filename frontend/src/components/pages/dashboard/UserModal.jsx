import { useState } from "react";
import { formatDateTime } from "../../../lib/formateTime";
import useAdminStore from "../../../store/adminStore";
import { MdWarningAmber } from "react-icons/md";
import { FaSkull } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdBlock, MdDelete } from "react-icons/md";

const UserModal = ({ modalUser, setModalUser, onlineUsers }) => {

    const { targetedUserAccountBlock, targetedUserAccountDelete } = useAdminStore();

    const isOnline = onlineUsers.includes(modalUser._id?.toString());

    // Confirmation States
    const [confirmAction, setConfirmAction] = useState(null); // 'block' or 'delete'

    // Finalize Action Handler (Replace with actual logic)
    const handleConfirm = async () => {
        if (confirmAction === "block") {
            await targetedUserAccountBlock(modalUser._id);
            // call blockUser(modalUser._id)
        } else if (confirmAction === "delete") {
            await targetedUserAccountDelete(modalUser._id);
        }
        setConfirmAction(null); // close confirmation
        setModalUser(null);     // close modal
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#1f2d40] w-full max-w-md rounded-xl shadow-xl p-5 text-white space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <h2 className="text-xl font-bold">{modalUser.userName}</h2>
                    <button
                        onClick={() => setModalUser(null)}
                        className="text-gray-300 hover:text-red-400 text-xl"
                    >
                        <IoMdClose />
                    </button>
                </div>

                {/* Account Info */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-medium">{modalUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Role:</span>
                        <span
                            className={`font-medium capitalize px-3 rounded-full text-xs py-1
                            ${modalUser.role === 'admin' ? 'bg-blue-500' :
                                    modalUser.role === 'master' ? 'bg-purple-600' :
                                        'bg-gray-600'}`}
                        >
                            {modalUser.role}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-medium ${modalUser.isBlocked ? "text-red-400" : "text-green-400"}`}>
                            {modalUser.isBlocked ? "Blocked" : "Active"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Currently:</span>
                        <span className="flex items-center gap-1 font-medium">
                            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400 mx-1" : "bg-gray-500 mx-1"}`}></span>
                            {isOnline ? "Online" : "Offline"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Registered at:</span>
                        <span>{formatDateTime(modalUser.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Last Login:</span>
                        <span>{modalUser.lastMessageTime ? formatDateTime(modalUser.lastMessageTime) : "N/A"}</span>
                    </div>
                </div>

                {/* Friends List */}
                <div>
                    <h4 className="text-sm font-semibold mb-1">Friends</h4>
                    <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                        {modalUser?.friends.length > 0 ? (
                            modalUser.friends.map((friend, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-700 text-xs px-2 py-1 rounded-full"
                                >
                                    {friend}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400">No friends available</span>
                        )}
                    </div>
                </div>

                {/* Confirmation Dialog */}
                {confirmAction && (
                    <div
                        className={`p-3 rounded-md text-xs space-y-2 flex items-start gap-2 ${confirmAction === "delete"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                    >

                        {/* Text and Buttons */}
                        <div className="flex-1 space-y-2">
                            {/* Icon */}
                            <div className="icons-message flex items-center gap-2">
                                <div className="text-lg mt-[2px]">
                                    {confirmAction === "delete" ? (
                                        <FaSkull className="text-red-600" />
                                    ) : (
                                        <MdWarningAmber className="text-yellow-600" />
                                    )}
                                </div>
                                <p>
                                    Are you sure you want to{" "}
                                    <strong>
                                        {modalUser.isBlocked && confirmAction === "block"
                                            ? "unblock"
                                            : confirmAction}
                                    </strong>{" "}
                                    this user?
                                </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="bg-gray-400 hover:bg-gray-500 px-3 py-1 rounded text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`px-3 py-1 rounded text-white ${confirmAction === "delete"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-yellow-500 hover:bg-yellow-600 text-black"
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Action Buttons */}
                {!confirmAction && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button
                            onClick={() => setConfirmAction("block")}
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-5 py-2 rounded-full text-xs font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                        >
                            <MdBlock className="text-base" />
                            {modalUser.isBlocked ? "Unblock" : "Block"}
                        </button>

                        <button
                            onClick={() => setConfirmAction("delete")}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-lg transition-all duration-200 hover:scale-105"
                        >
                            <MdDelete className="text-base" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserModal;
