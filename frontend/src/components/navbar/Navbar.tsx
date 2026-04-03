'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { clearAuthTokens } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthTokens();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-700 font-medium">Welcome back</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
