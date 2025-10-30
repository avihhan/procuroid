import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Calendar as CalendarIcon,
  Plus,
  Bell,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';
import PlaceOrderModal from './PlaceOrderModal';
import NotificationCenter from './NotificationCenter';
import { supabase } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [initials, setInitials] = useState('');
  const location = useLocation();

  // Fetch user's display name on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Try to get display name from user metadata first
        const metaDisplayName = user.user_metadata?.display_name;
        const firstName = user.user_metadata?.first_name;
        const lastName = user.user_metadata?.last_name;
        
        if (metaDisplayName) {
          setDisplayName(metaDisplayName);
          // Generate initials from display name
          const names = metaDisplayName.split(' ');
          const userInitials = names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
          setInitials(userInitials);
        } else if (firstName || lastName) {
          // Fallback to constructing from first/last name
          const name = `${firstName || ''} ${lastName || ''}`.trim();
          setDisplayName(name);
          const userInitials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
          setInitials(userInitials);
        } else {
          // If using profiles table, fetch from there
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.display_name) {
            setDisplayName(profile.display_name);
            const names = profile.display_name.split(' ');
            const userInitials = names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
            setInitials(userInitials);
          } else if (profile?.first_name || profile?.last_name) {
            const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            setDisplayName(name);
            const userInitials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
            setInitials(userInitials);
          } else {
            // Final fallback to email
            setDisplayName(user.email || 'User');
            setInitials(user.email?.[0].toUpperCase() || 'U');
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">Procuroid</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaceOrderOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Place New Order</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                {isNotificationOpen && <NotificationCenter onClose={() => setIsNotificationOpen(false)} />}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {initials || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {displayName || 'Loading...'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="mr-3 h-4 w-4" />
                      Account Settings
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={async () => { await supabase.auth.signOut(); }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Modals */}
      {isPlaceOrderOpen && (
        <PlaceOrderModal onClose={() => setIsPlaceOrderOpen(false)} />
      )}
    </div>
  );
};

export default Layout;