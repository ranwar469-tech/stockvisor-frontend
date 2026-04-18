import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, ExternalLink, RefreshCw, ShieldAlert, Trash2, Users, Flag } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actingUserId, setActingUserId] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState('');
  const [deletingReportId, setDeletingReportId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load users.';
      setError(typeof msg === 'string' ? msg : 'Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    setReportsError('');

    try {
      const { data } = await api.get('/admin/reports');
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load reports.';
      setReportsError(typeof msg === 'string' ? msg : 'Failed to load reports.');
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, [fetchUsers, fetchReports]);

  const isBanned = (bannedUntil) => {
    if (!bannedUntil) return false;
    const parsed = new Date(bannedUntil);
    if (Number.isNaN(parsed.getTime())) return false;
    return parsed.getTime() > Date.now();
  };

  const handleBanToggle = async (targetUserId, currentlyBanned) => {
    setActingUserId(targetUserId);
    setError('');

    try {
      if (currentlyBanned) {
        await api.delete(`/admin/users/${targetUserId}/ban`);
      } else {
        await api.post(`/admin/users/${targetUserId}/ban`, {
          ban_duration: '876000h',
        });
      }
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update ban status.';
      setError(typeof msg === 'string' ? msg : 'Failed to update ban status.');
    } finally {
      setActingUserId(null);
    }
  };

  const handleDeleteUser = async (targetUserId, username) => {
    const confirmed = window.confirm(`Delete user ${username}? This cannot be undone.`);
    if (!confirmed) return;

    setActingUserId(targetUserId);
    setError('');

    try {
      await api.delete(`/admin/users/${targetUserId}`);
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete user account.';
      setError(typeof msg === 'string' ? msg : 'Failed to delete user account.');
    } finally {
      setActingUserId(null);
    }
  };

  const handleDeleteReport = async (reportId) => {
    const confirmed = window.confirm('Delete this report from the moderation queue?');
    if (!confirmed) return;

    setDeletingReportId(reportId);
    setReportsError('');

    try {
      await api.delete(`/admin/reports/${reportId}`);
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete report.';
      setReportsError(typeof msg === 'string' ? msg : 'Failed to delete report.');
    } finally {
      setDeletingReportId(null);
    }
  };

  const resolveThreadIdFromReport = (report) => {
    const candidates = [
      report?.thread_id,
      report?.discussion_thread_id,
      report?.parent_thread_id,
      report?.related_thread_id,
      report?.target_thread_id,
    ];
    const threadId = candidates.find((value) => value !== null && value !== undefined && value !== '');

    if (threadId !== null && threadId !== undefined && threadId !== '') return threadId;
    if (String(report?.target_type || '').toLowerCase() === 'thread') return report?.target_id;
    return null;
  };

  const getReportTargetLabel = (report) => {
    const targetType = String(report?.target_type || '').toLowerCase();
    const targetId = report?.target_id;

    if (targetType === 'thread') {
      const threadName = [
        report?.thread_title,
        report?.target_title,
        report?.title,
        report?.target_name,
      ].find((value) => typeof value === 'string' && value.trim().length > 0);

      return threadName || `THREAD #${targetId}`;
    }

    return `${targetType.toUpperCase()} #${targetId}`;
  };

  const handleViewReportTarget = (report) => {
    const targetType = String(report?.target_type || '').toLowerCase();
    const threadId = resolveThreadIdFromReport(report);

    if (!threadId) {
      setReportsError('Unable to locate a thread for this report.');
      return;
    }

    if (targetType === 'post') {
      navigate(`/community/threads/${threadId}?postId=${report.target_id}&source=adminReport&highlightTarget=post`);
      return;
    }

    navigate(`/community/threads/${threadId}?source=adminReport&highlightTarget=thread`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h2>
        <span className="text-slate-600 mb-5 dark:text-slate-400 inline-block border-[#2ebd85] border-b-2">
          Manage community moderation and user accounts
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-[#2ebd85] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="w-5 h-5 text-[#2ebd85]" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Community Moderation</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
            Review discussions and remove any thread or post when needed.
          </p>
          <button
            type="button"
            onClick={() => navigate('/community?adminManage=1')}
            className="w-full px-4 py-2 rounded-lg bg-[#2ebd85] hover:bg-[#26a070] text-white text-sm font-semibold transition-colors"
          >
            Manage Community
          </button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-[#2ebd85] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2ebd85]" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All Users</h3>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-600"
              title="Refresh users"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {error && (
            <div className="mx-5 mt-4 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
              {error}
            </div>
          )}

          {loading && users.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-gray-400">Loading users...</div>
          )}

          {!loading && users.length === 0 && !error && (
            <div className="py-12 text-center text-slate-500 dark:text-gray-400">No users found.</div>
          )}

          {users.length > 0 && (
            <div className="max-h-120 overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                <thead className="bg-slate-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">User</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Role</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                  {users.map((entry) => {
                    const currentlyBanned = isBanned(entry.banned_until);
                    const isSelf = String(entry.id) === String(user?.id);
                    const busy = actingUserId === entry.id;

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-5 py-3 align-top">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.username}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">{entry.email}</p>
                        </td>
                        <td className="px-5 py-3 align-top">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${entry.role === 'admin' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {entry.role || 'user'}
                          </span>
                        </td>
                        <td className="px-5 py-3 align-top">
                          <span className={`text-xs font-semibold ${currentlyBanned ? 'text-rose-600 dark:text-rose-300' : 'text-[#2ebd85]'}`}>
                            {currentlyBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-5 py-3 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleBanToggle(entry.id, currentlyBanned)}
                              disabled={busy || isSelf}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 ${currentlyBanned ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600' : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'}`}
                              title={isSelf ? 'You cannot ban your own account' : currentlyBanned ? 'Unban user' : 'Ban user'}
                            >
                              {busy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Ban className="w-3 h-3" />}
                              {currentlyBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(entry.id, entry.username)}
                              disabled={busy || isSelf}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 disabled:opacity-50"
                              title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                            >
                              {busy ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#2ebd85] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#2ebd85]" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Reported Content</h3>
          </div>
          <button
            onClick={fetchReports}
            disabled={reportsLoading}
            className="p-2 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-600"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${reportsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {reportsError && (
          <div className="mx-5 mt-4 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
            {reportsError}
          </div>
        )}

        {reportsLoading && reports.length === 0 && (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400">Loading reports...</div>
        )}

        {!reportsLoading && reports.length === 0 && !reportsError && (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400">No reports found.</div>
        )}

        {reports.length > 0 && (
          <div className="max-h-120 overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
              <thead className="bg-slate-50 dark:bg-gray-700/60">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Target</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Reason</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Reported By</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Created</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-slate-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-5 py-3 align-top">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {getReportTargetLabel(report)}
                      </p>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <p className="text-sm text-slate-900 dark:text-white">{report.reason}</p>
                      {report.details && (
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 whitespace-pre-wrap">{report.details}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 align-top">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.reported_by_username || report.reported_by}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{report.reported_by}</p>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {report.created_at ? new Date(report.created_at).toLocaleString() : '-'}
                      </p>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewReportTarget(report)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50"
                          title="View reported content"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(report.id)}
                          disabled={deletingReportId === report.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 disabled:opacity-50"
                          title="Delete report"
                        >
                          {deletingReportId === report.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
