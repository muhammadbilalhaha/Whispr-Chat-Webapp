import React from "react";

const Loader = () => {
    return (
        <div className="flex justify-center items-center w-[100%] h-[100vh]">
            <div className="w-[75px] h-[75px] border-[15px] border-[#dddddd] border-t-[#fa5656] rounded-full animate-spin" />
        </div>
    );
};

export default Loader;
