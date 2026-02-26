import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Lock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
const navigate = useNavigate();

  const initial = (user?.username || user?.email || '?')[0].toUpperCase();

  const handleSaveProfile =async (e) => {
    e.preventDefault();
    if (name !== user.username || email !== user.email) {
    await api.patch('/auth/profile', { username: name, email: email });
    updateUser({ username: name, email: email });
    alert('Profile updated');
    }
  };

  const handleChangePassword =async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword !== currentPassword) {
        await api.patch('/auth/password', { current_password: currentPassword, new_password: newPassword });
    alert('Password changed');
    }
    else{
        alert('New password cannot be the same as current password');
    }
  };

  const handleDeleteAccount =async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await api.delete('/auth/account');
        alert('Account deleted');
        navigate('/login');
      } catch (error) {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header with avatar */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-20 h-20 rounded-full bg-[#2ebd85] flex items-center justify-center text-white text-3xl font-bold shadow-lg select-none">
          {initial}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Profile Info */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#2ebd85]" />
          Profile Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
            />
          </div>

          <div>
            <label className="flex text-sm font-medium text-slate-700 dark:text-gray-300 mb-1 items-center gap-1">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 px-6 py-2.5 bg-[#2ebd85] hover:bg-[#26a674] text-white font-medium rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#2ebd85]" />
          Change Password
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 px-6 py-2.5 bg-[#2ebd85] hover:bg-[#26a674] text-white font-medium rounded-lg transition-colors"
        >
          Update Password
        </button>
      </form>

      {/* Delete Account */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-rose-200 dark:border-rose-800/50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Delete Account
        </h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
          Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-5 py-2.5 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-medium rounded-lg transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
