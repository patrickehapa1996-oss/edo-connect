import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';

export function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Active connections</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-sm text-gray-500">Unread messages</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">0</p>
          <p className="text-sm text-gray-500">New notifications</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      </div>
    </div>
  );
}
