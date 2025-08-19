import React, { useContext } from 'react'
import HomeContext from '../../../../homeContext/homeContext';
import { loggedinUserStore } from '../../../../../../../store/loggedinUserStore';

const FriendDeleteOption = ({ setShowDeleteFriendModal }) => {

    const { activeFriend, setActiveFriend } = useContext(HomeContext);

    const { deleteFriend, fetchUserFriendList } = loggedinUserStore();

    const handleDeleteFriend = async () => {
        await deleteFriend(activeFriend._id);
        setShowDeleteFriendModal(false);
        await fetchUserFriendList();
        setActiveFriend(null);
    }

    return (
        <div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000c5]">
                <div className="bg-[#202c33] text-white rounded-[20px] shadow-lg p-6 w-[90%] max-w-md">
                    <h2 className="text-xl font-semibold mb-4 text-white">
                        Confirm Deletion
                    </h2>
                    <p className="text-gray-300 text-[14px] mb-1">
                        This action will permanently remove the following friend from your contacts:
                    </p>
                    <p className="text-white text-[16px] font-bold bg-[#2a3942] border-1 border-red-500 rounded-full p-2 m-2 text-center shadow-inner tracking-wide">
                        {activeFriend?.userName}
                    </p>


                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowDeleteFriendModal(false)}
                            className="px-4 py-2 cursor-pointer rounded-full border border-gray-500 text-gray-300 hover:text-white hover:border-white transition duration-150"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteFriend}
                            className="px-4 py-2 cursor-pointer rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-150"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );



}

export default FriendDeleteOption
