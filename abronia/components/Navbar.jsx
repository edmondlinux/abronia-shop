"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 border-b border-gray-200 bg-white shadow-sm">
      <Image
        className="cursor-pointer w-28 md:w-32 hover:scale-105 transition-transform duration-300"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Navigation Links */}
      <div className="flex items-center gap-2 lg:gap-4 max-md:hidden">
        <Link 
          href="/" 
          className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
        >
          <span className="relative z-10">Home</span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </Link>
        <Link 
          href="/all-products" 
          className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
        >
          <span className="relative z-10">Shop</span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </Link>
        <Link 
          href="/blog" 
          className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
        >
          <span className="relative z-10">Blog</span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </Link>
        <Link 
          href="/about" 
          className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
        >
          <span className="relative z-10">About Us</span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </Link>
        <Link 
          href="/contact" 
          className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
        >
          <span className="relative z-10">Contact</span>
          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </Link>
        {isSeller && 
          <button 
            onClick={() => router.push('/seller')} 
            className="relative px-4 py-2 text-xs font-semibold text-emerald-700 border-2 border-emerald-200 bg-emerald-50 rounded-full hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group"
          >
            <span className="relative z-10">Seller Dashboard</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-300"></span>
          </button>
        }
      </div>

      {/* Desktop Right Side */}
      <div className="hidden md:flex items-center gap-4">
        <div className="relative group">
          <Image 
            className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform" 
            src={assets.search_icon} 
            alt="search icon" 
          />
          <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300"></div>
        </div>
        {
          user
            ? <div className="relative">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 hover:shadow-lg transition-shadow duration-300 ring-2 ring-emerald-100 hover:ring-emerald-200",
                      userButtonPopoverCard: "shadow-xl border border-gray-100",
                      userButtonPopoverActionButton: "hover:bg-emerald-50 transition-colors duration-200"
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            : <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.push('/blog')} 
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
                >
                  <span className="relative z-10">Blog</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
                </button>
                <button 
                  onClick={openSignIn} 
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Image className="relative z-10 w-4 h-4 brightness-0 invert" src={assets.user_icon} alt="user icon" />
                  <span className="relative z-10">Sign In</span>
                </button>
              </div>
        }
      </div>

      {/* Mobile Right Side */}
      <div className="flex items-center md:hidden gap-2">
        {isSeller && 
          <button 
            onClick={() => router.push('/seller')} 
            className="relative px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-full hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all duration-300 group"
          >
            <span className="relative z-10">Seller</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-300"></span>
          </button>
        }
        {
          user
            ? <div className="relative">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 hover:shadow-md transition-shadow duration-300 ring-2 ring-emerald-100 hover:ring-emerald-200",
                      userButtonPopoverCard: "shadow-xl border border-gray-100",
                      userButtonPopoverActionButton: "hover:bg-emerald-50 transition-colors duration-200"
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action label="Products" labelIcon={<BoxIcon />} onClick={() => router.push('/all-products')} />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                  </UserButton.MenuItems>
                  <UserButton.MenuItems>
                    <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            : <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push('/blog')} 
                  className="relative px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-md hover:bg-emerald-50 group"
                >
                  <span className="relative z-10">Blog</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300"></span>
                </button>
                <button 
                  onClick={openSignIn} 
                  className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md hover:shadow-md hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Image className="relative z-10 w-3 h-3 brightness-0 invert" src={assets.user_icon} alt="user icon" />
                  <span className="relative z-10">Sign In</span>
                </button>
              </div>
        }
      </div>
    </nav>
  );
};

export default Navbar;