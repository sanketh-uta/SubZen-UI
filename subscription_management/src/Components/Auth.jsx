import styles from "./Header.module.css";
import React, { createContext, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import axios from "axios";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
const backend = "http://localhost:1010/";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
// preventing the configuration again if already configured
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const uiConfig = {
    signInFlow: "popup",
    //what ever we provide are shown
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authresult) => {
        setIsAuthModalOpen(false);

        const idToken = getToken(authresult);
        console.log(authresult.user.getIdToken());
        idToken
          .then((token) => {
            // Make API call to backend
            return axios
              .post(
                backend + "user",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  withCredentials: true,
                }
              )
              .then((user) => {
                console.log("User registered successfully", user);
                // After successful API call, navigate to subscription management
                navigate("/manage-subscriptions");
              })
              .catch((error) => {
                console.error("API error:", error);
                // Handle error appropriately
              });
          })
          .catch((error) => {
            console.error("Token error:", error);
            // Handle token error
          });

        return false; // Don't redirect
      },
    },
  };
  const getToken = async (authresult) => {
    try {
      const token = await authresult.user.getIdToken();
      console.log(token);
      return token;
    } catch (error) {
      return error;
    }
  };
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        user ? console.log(user.getIdToken()) : "";
        setUser(user);
      });

    // Cleanup subscription on unmount
    return () => unregisterAuthObserver();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    try {
      // Call the logout endpoint to clear the httpOnly cookie
      axios.post(backend + "user/logout", {}, { withCredentials: true });

      // Update your app state
      // For example:
      setUser(null);
      // navigate('/login');
      navigate("/");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      {user ? (
        <div className="flex items-center space-x-3">
          {/* <span className="text-gray-700 text-sm font-medium">
            {user.displayName || user.email}
          </span> */}
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
      )}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              onClick={toggleAuthModal}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>

            <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
              Sign in to your account
            </h2>

            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.auth()}
            />
          </div>
        </div>
      )}
    </>
  );
};
