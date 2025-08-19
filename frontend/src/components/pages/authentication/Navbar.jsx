import React from 'react'

const Navbar = () => {
    return (
        <div className="mainContainer select-none">
            <nav className='w-[100%] p-0.5  '>
                <div className="logo-mainHeading p-2 flex items-center m-3 ml-5">
                    <img className="h-[50px] invert" src="/logo.png" alt="this is main logo" />
                    <h1 className='text-2xl font-bold text-[rgb(228, 232, 231)]'>Whispr</h1>
                </div>
            </nav>
            <main></main>
        </div>
    )
}

export default Navbar
