import React, { useContext } from 'react';
import HomeContext from '../../../homeContext/homeContext';

const UserProfile = () => {

    const { userProfileDetails } = useContext(HomeContext);

    const user = {
        name: userProfileDetails.userName,
        email: userProfileDetails.email,
        image: userProfileDetails.profilePicture,
    };

    return (
        <div className="mainContainer w-full p-3 select-none flex flex-col justify-center gap-12">
            <h1 className="text-[20px] font-bold mb-4">Profile</h1>

            <div className="userProfileParent perfectCenter">
                <div className="userPicture perfectCenter h-[200px] w-[200px] rounded-full overflow-hidden bg-gray-200 text-white text-[60px] font-bold">
                    <img
                        src={user?.image || "/defaultImage.png"}
                        alt="User"
                        className={`h-full w-full rounded-full object-cover `}
                        onError={(e) => {
                            e.currentTarget.onerror = null; // Prevent infinite loop if default also fails
                            e.currentTarget.src = "/defaultImage.png";
                        }}
                    />

                </div>
            </div>

            <div className="userName mt-5">
                <label htmlFor="userName" className="block text-red-400 text-md">Your name</label>
                <p className='text-sm'>{user.name}</p>
            </div>

            <div className="userEmail mt-3">
                <label htmlFor="userEmail" className="block text-red-400 text-md">Your email</label>
                <p className='text-sm'>{user.email}</p>
            </div>
        </div>
    );
};

export default UserProfile;
