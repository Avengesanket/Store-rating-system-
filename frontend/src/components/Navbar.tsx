import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { LogOut, User as Lock } from 'lucide-react'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand */}
          <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => navigate('/')}>
            <span className="font-bold text-xl tracking-tight">StoreRatings</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Role-Based Dashboard Links */}
                {user.role === UserRole.ADMIN && (
                  <Link 
                    to="/admin/dashboard" 
                    className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === UserRole.STORE_OWNER && (
                  <Link 
                    to="/owner/dashboard" 
                    className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    My Store
                  </Link>
                )}
                {/* Normal Users AND Admins can browse stores */}
                {(user.role === UserRole.NORMAL_USER || user.role === UserRole.ADMIN) && (
                  <Link 
                    to="/stores" 
                    className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Browse Stores
                  </Link>
                )}

                {/* Common Settings */}
                <Link 
                    to="/change-password" 
                    className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                    title="Change Password"
                  >
                    <Lock size={16} />
                    <span className="hidden md:inline">Password</span>
                </Link>

                {/* User Info & Logout Section */}
                <div className="flex items-center ml-4 space-x-3 border-l border-indigo-500 pl-4">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold leading-none">{user.name}</span>
                    <span className="text-xs text-indigo-200 capitalize mt-1">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="p-2 bg-indigo-700 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              /* Guest View */
              <>
                <Link 
                  to="/login" 
                  className="hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;