import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../store/AuthSlice';

const LoginModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const isAdminRef = useRef(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const DATABASE_URL = process.env.REACT_APP_FIREBASE_DB_URL;
  const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

  const handleAuth = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    let isAdmin = isAdminRef.current?.checked || false;
  
    if (email && password) {
      const url = isSignUp
        ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
        : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        });
        const data = await response.json();
        console.log('Auth response data:', data);
  
        if (response.ok) {
          const userId = data.localId;
          const token = data.idToken;
          if (isSignUp) {
            await fetch(`${DATABASE_URL}/users/${userId}.json?auth=${token}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                isAdmin,
                createdAt: new Date().toISOString(),
              }),
            });
          } else { 
            const userResponse = await fetch(
              `${DATABASE_URL}/users/${userId}.json?auth=${token}`
            );
            const userData = await userResponse.json();
            isAdmin = userData.isAdmin || false;
          }
          dispatch(setIsAuthenticated({ token, isAdmin, userId }));
  
          closeModal();
        } else {
          console.error('Authentication error:', data.error.message);
          setError(data.error.message || 'Failed to authenticate');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        setError('An error occurred during authentication.');
      }
    } else {
      setError('Email and password are required.');
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="mb-2 w-full p-2 border border-gray-300 rounded"
          ref={emailRef}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full p-2 border border-gray-300 rounded"
          ref={passwordRef}
        />
        {isSignUp && (
          <div className="mb-4">
            <input
              type="checkbox"
              id="isAdmin"
              ref={isAdminRef}
              className="mr-2"
            />
            <label htmlFor="isAdmin">Is Admin</label>
          </div>
        )}
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleAuth}
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <button
          className="mt-2 w-full bg-gray-500 text-white p-2 rounded"
          onClick={closeModal}
        >
          Cancel
        </button>
        <div className="mt-4 text-center">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              className="text-blue-500 ml-2 underline"
              onClick={() => setIsSignUp((prev) => !prev)}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
