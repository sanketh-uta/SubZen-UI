import { createContext, useState, useEffect,useContext } from 'react';
import { auth } from '../config/firebase'; // Adjust this import to match your firebase setup

// Create the context
export const UserContext = createContext();

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  }

// Create a provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // User is signed in
        console.log("authenticated user is ",authUser)
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName || authUser.email.split('@')[0],
          photoURL:authUser.photoURL
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Create a value object with the state and any functions you want to expose
  const value = {
    user,
    loading,
    // You can add more functions here like signOut, updateProfile, etc.
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}
export default UserProvider;