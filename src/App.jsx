import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import './assets/globle.scss';
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        const session = await authService.getSession();

        if (userData && session) {
          dispatch(rehydrateUser({ userData, session }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return !loading ? (
    <div className='body_color min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
