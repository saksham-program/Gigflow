import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">GigFlow</Link>
        <nav className="flex gap-4 items-center">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>Gigs</NavLink>
          {user && <NavLink to="/post" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>Post Gig</NavLink>}
          {user ? (
            <>
              <NavLink to="/notifications" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>Notifications</NavLink>
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                className="text-sm px-3 py-1 rounded bg-gray-900 text-white"
                onClick={() => dispatch(logoutUser())}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'font-semibold' : '')}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
