import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import GigsPage from './pages/GigsPage';
import PostGigPage from './pages/PostGigPage';
import GigDetailPage from './pages/GigDetailPage';
import BidsPage from './pages/BidsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotificationsPage from './pages/NotificationsPage';

import { fetchMe } from './features/auth/authSlice';

function Protected({ children }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<GigsPage />} />

        <Route
          path="/post"
          element={
            <Protected>
              <PostGigPage />
            </Protected>
          }
        />

        <Route path="/gigs/:id" element={<GigDetailPage />} />

        <Route
          path="/gigs/:id/bids"
          element={
            <Protected>
              <BidsPage />
            </Protected>
          }
        />

        <Route
          path="/notifications"
          element={
            <Protected>
              <NotificationsPage />
            </Protected>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}
