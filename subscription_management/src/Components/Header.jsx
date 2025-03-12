import styles from "./Header.module.css";
import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import axios from "axios";
import { auth } from "firebaseui";
import Auth from "./Auth";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const handleClick = (e, path) => {
    e.preventDefault(); // Prevent default anchor behavior
    navigate(path); // Use navigate to change routes
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-pink-50 to-purple-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section (Left) */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Replace with your company logo */}
                <img
                  className="h-8 w-auto"
                  src="/company-logo.jpeg"
                  alt="Company Logo"
                />
                <p>SubZen</p>
              </div>
            </div>

            {/* Desktop Navigation (Right) */}
            <div className="hidden md:flex items-center space-x-6">
              {/* {!user &&
                <a
                href="/"
                onClick={(e) => handleClick(e, '/Auth')}
                className="text-purple-800 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Manage Subscription
              </a>
} */}
              {!user && (
                <a
                  href="#aboutus"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("aboutus")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-purple-800 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About Us
                </a>
              )}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    .scrollIntoView({ behavior: "smooth" });
                }}
                className="text-purple-800 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact Us
              </a>
              {/* {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm font-medium">
                    {user.displayName || user.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={toggleAuthModal}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login/Signup
                </button>
              )} */}
              <Auth />
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open main menu</span>
                {/* Menu icon */}
                {!isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            >
              Manage Subscription
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            >
              About Us
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            >
              Contact Us
            </a>
            {/* {user ? (
              <>
                <div className="block px-3 py-2 text-gray-700 font-medium">
                  {user.displayName || user.email}
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={toggleAuthModal}
                className="w-full text-left block text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-3 py-2 rounded-md text-base font-medium"
              >
                Login/Signup
              </button>
            )} */}
            <Auth />
          </div>
        </div>
      </nav>
    </>
  );
}
