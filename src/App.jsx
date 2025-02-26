import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import './assets/globle.scss';
import authService from "./appwrite/auth";
import { logout, rehydrateUser } from "./store/authSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();

        if (userData) {
          dispatch(rehydrateUser({ userData, session: userData.$id }));
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

export default App;