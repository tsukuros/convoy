'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MapView } from '@/components/map/Map';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col bg-gray-900">
        <header className="border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-white">Convoy</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {user?.email} ({user?.role})
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <MapView />
        </main>
      </div>
    </ProtectedRoute>
  );
}
