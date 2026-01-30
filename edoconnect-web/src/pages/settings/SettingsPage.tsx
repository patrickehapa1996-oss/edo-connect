import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@store/slices/uiSlice';
import type { RootState } from '@store/index';

export function SettingsPage() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Theme</p>
            <p className="text-sm text-gray-500">Select your preferred theme</p>
          </div>
          <select
            value={theme}
            onChange={e => dispatch(setTheme(e.target.value as 'light' | 'dark'))}
            className="input w-32"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-primary-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-primary-600 rounded" defaultChecked />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-500">Make profile visible to others</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-primary-600 rounded" defaultChecked />
          </div>
        </div>
      </div>

      <div className="card border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Delete Account</p>
            <p className="text-sm text-gray-500">Permanently delete your account and data</p>
          </div>
          <button className="btn bg-red-600 text-white hover:bg-red-700">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
