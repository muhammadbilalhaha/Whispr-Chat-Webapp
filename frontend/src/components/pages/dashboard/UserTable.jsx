import { useEffect, useState } from "react";
import { formatDateTime } from "../../../lib/formateTime";
import { userAuthenticationStore } from "../../../store/userAuthenticationStore";
import { MdInfoOutline } from "react-icons/md";
import useAdminStore from "../../../store/adminStore";

const UserTable = ({ users, setModalUser, selectedUserId, setSelectedUserId }) => {
    const authenticationUser = userAuthenticationStore((state) => state.authenticationUser);
    const { targetedUserAccountRoleChange } = useAdminStore();
    const [roleChangeRequest, setRoleChangeRequest] = useState(null);

    const confirmRoleChange = async() => {
        await targetedUserAccountRoleChange(roleChangeRequest.userId, roleChangeRequest.newRole)
        setRoleChangeRequest(null);
    };

    return (
        <>
            <div className="bg-[#1f2d40] rounded shadow max-h-[685px] overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#26364c] sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Total Messages</th>
                            <th className="p-3 text-left">Activity</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={index}
                                className={`border-t border-gray-700 hover:bg-[#2b3a4e] ${selectedUserId === user._id ? "bg-[#2b3a4e]" : ""
                                    }`}
                                onClick={() => {
                                    setSelectedUserId(user.id);
                                    setModalUser(user);
                                }}
                            >
                                <td className="p-3">
                                    <div className="font-semibold">
                                        {user.userName}
                                        {user._id === authenticationUser?._id && (
                                            <span className="text-green-400 text-[13px] font-semibold ml-1">(YOU)</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Registered at: {formatDateTime(user.createdAt)}
                                    </div>
                                </td>
                                <td className="p-3 capitalize">
                                    <select
                                        value={user.role}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                            const newRole = e.target.value;
                                            if (user.role !== newRole) {
                                                e.stopPropagation();
                                                setRoleChangeRequest({ userId: user._id, newRole, userName: user.userName });
                                            }
                                        }}
                                        className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="master">Master</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <div className="h-full w-[50%] flex items-center justify-center text-sm font-medium">
                                        {user.totalMessages}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="text-xs text-gray-300">Last login</div>
                                    <div className="text-sm">
                                        {user.lastMessageTime
                                            ? formatDateTime(user.lastMessageTime)
                                            : "Not Yet"}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className="text-blue-400 text-xs">View Actions</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {roleChangeRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#1f2d40] text-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 border border-blue-500">

                        {/* Header with Icon */}
                        <div className="flex items-center gap-3 border-b border-gray-600 pb-3">
                            <div className="bg-blue-500 p-2 rounded-full">
                                <MdInfoOutline className="text-white text-xl" />
                            </div>
                            <h3 className="text-lg font-bold whitespace-nowrap">Confirm Role Change</h3>
                        </div>

                        {/* Message */}
                        <div className="text-sm space-y-3">
                            <p className="flex flex-wrap items-center gap-1 text-sm leading-relaxed">
                                Do you really want to change the role of
                                <span className="text-red-500 rounded-full font-bold whitespace-nowrap">
                                    {roleChangeRequest.userName}
                                </span>
                                to
                                <span className="text-yellow-400 font-semibold whitespace-nowrap">
                                    {roleChangeRequest.newRole}
                                </span>
                                ?
                            </p>
                            <p className="text-xs text-gray-400">
                                This change will update the user's access level and permissions.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-700">
                            <button
                                onClick={() => setRoleChangeRequest(null)}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRoleChange}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-medium transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default UserTable;
