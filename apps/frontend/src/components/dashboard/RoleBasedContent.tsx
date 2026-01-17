'use client';

import { useAuth } from '@/hooks/use-auth';
import { Role } from '@/types/auth';

export function RoleBasedContent() {
  const { user } = useAuth();

  if (!user) return null;

  const capabilities = {
    [Role.VIEWER]: [
      'View real-time asset positions on map',
      'See asset details and history',
      'View active routes and geofences',
      'Monitor alerts (read-only)',
    ],
    [Role.OPERATOR]: [
      'All VIEWER capabilities',
      'Update asset positions and status',
      'Create and modify routes',
      'Acknowledge and manage alerts',
      'Field operations management',
    ],
    [Role.ADMIN]: [
      'All OPERATOR capabilities',
      'Manage users and permissions',
      'Create and delete assets',
      'Configure geofences',
      'Access system settings and logs',
      'Full system administration',
    ],
  };

  const features = capabilities[user.role];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg bg-gray-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Your Role: {user.role}</h3>
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {user.role}
          </span>
        </div>

        <p className="mb-4 text-sm text-gray-400">Logged in as: {user.email}</p>

        <div className="border-t border-gray-700 pt-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-300">Your Capabilities:</h4>
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start text-sm text-gray-400">
                <svg
                  className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>Checkmark</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {user.role === Role.VIEWER && (
          <div className="mt-4 rounded-md bg-yellow-900/20 p-3">
            <p className="text-xs text-yellow-400">
              ⓘ You have read-only access. Contact an admin for elevated permissions.
            </p>
          </div>
        )}

        <div className="mt-6 rounded-md bg-gray-900 p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-300">Coming Soon:</h4>
          <ul className="space-y-1 text-xs text-gray-500">
            <li>• Interactive map with MapLibre GL JS</li>
            <li>• Real-time asset tracking via WebSockets</li>
            <li>• Route planning and geofencing</li>
            <li>• Alert management system</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
