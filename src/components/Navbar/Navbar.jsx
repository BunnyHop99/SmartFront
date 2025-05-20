import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-[#0d4b6d] h-16 flex items-center justify-end px-6 shadow-md">
      <div className="flex items-center space-x-3 text-white">
        <div className="text-right">
          <p className="font-semibold leading-none">Elena Cruz</p>
          <p className="text-sm text-gray-200">ElenaCruz@gmail.com</p>
        </div>
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg" // Reemplaza con tu avatar
          alt="Elena Cruz"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </nav>
  )
}

export default Navbar
