'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleBasedContent } from '@/components/dashboard/RoleBasedContent';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gray-900">
        <header className="border-b border-gray-800 bg-gray-950">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <h1 className="text-2xl font-bold text-white">Convoy</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {user?.email} ({user?.role})
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white">Welcome to Convoy</h2>
              <p className="mt-2 text-gray-400">Real-Time Logistics Tracking System</p>
            </div>
            <RoleBasedContent />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
