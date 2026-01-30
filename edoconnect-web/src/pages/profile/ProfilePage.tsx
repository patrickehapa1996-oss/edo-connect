import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';

export function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-2xl text-primary-600">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">First Name</dt>
            <dd className="text-gray-900">{user?.firstName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
            <dd className="text-gray-900">{user?.lastName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-gray-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Member Since</dt>
            <dd className="text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
