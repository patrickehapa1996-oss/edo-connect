import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@store/slices/authSlice';
import { toggleSidebar } from '@store/slices/uiSlice';
import type { RootState } from '@store/index';

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <span className="text-sm text-gray-700">
            {user?.firstName} {user?.lastName}
          </span>
          <button onClick={handleLogout} className="btn-outline text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
