import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Droplet, ShieldCheck, ClipboardList, Check, Search, Filter, Activity, Trash2 } from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import DataTable from '../components/DataTable';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();

    // Listen for view changes from Sidebar
    const handleViewChange = (e) => setActiveView(e.detail);
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, reqRes] = await Promise.all([
        api.get('/users/all'),
        api.get('/request/all')
      ]);
      setUsers(userRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.patch(`/users/verify/${userId}`);
      fetchData();
    } catch (err) {
      alert("Verification failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await api.delete(`/users/${userId}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(u =>
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeView === 'donors' ? u.role === 'donor' : activeView === 'hospitals' ? u.role === 'hospital' : true)
  );

  const renderStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12"
    >
      <div className="glass-card p-8 border-l-4 border-primary">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Users size={24} />
          </div>
          <span className="text-3xl font-bold">{users.length}</span>
        </div>
        <p className="text-sm font-medium text-text-muted">Total Users</p>
      </div>
      <div className="glass-card p-8 border-l-4 border-indigo-500">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Droplet size={24} />
          </div>
          <span className="text-3xl font-bold">{requests.length}</span>
        </div>
        <p className="text-sm font-medium text-text-muted">Total Requests</p>
      </div>
      <div className="glass-card p-8 border-l-4 border-success">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-success/10 rounded-xl text-success">
            <ShieldCheck size={24} />
          </div>
          <span className="text-3xl font-bold">{users.filter(u => u.isVerified).length}</span>
        </div>
        <p className="text-sm font-medium text-text-muted">Verified Entities</p>
      </div>
    </motion.div>
  );

  const renderManagementList = (title) => (
    <motion.section
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="relative w-full max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/5 border border-glass-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        headers={['Name', 'Email', 'Role', 'Status', 'Actions']}
        data={filteredUsers}
        emptyMessage="No users found matching your search."
        renderRow={(u) => (
          <>
            <td>
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${u.role === 'hospital' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-primary/20 text-primary'}`}>
                  {u.name[0]}
                </div>
                <span className="font-bold">{u.name}</span>
              </div>
            </td>
            <td className="text-sm text-text-muted">{u.email}</td>
            <td><span className="badge bg-white/5 text-text-muted">{u.role}</span></td>
            <td>
              {u.isVerified ? (
                <span className="badge badge-matched flex items-center gap-1 w-fit"><ShieldCheck size={10} /> Verified</span>
              ) : (
                <span className="badge badge-pending">Pending</span>
              )}
            </td>
            <td>
              <div className="flex items-center gap-2">
                {u.role === 'hospital' && !u.isVerified && (
                  <button
                    onClick={() => handleVerify(u._id)}
                    className="btn bg-success text-white hover:bg-success/80 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(16,185,129,0.4)] px-3 py-1.5 text-[10px] gap-1"
                  >
                    <ShieldCheck size={12} /> Verify Now
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="btn bg-danger text-white hover:bg-danger/80 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(239,68,68,0.4)] px-3 py-1.5 text-[10px] gap-1"
                >
                  <Trash2 size={12} /> Delete Now
                </button>
              </div>
            </td>
          </>
        )}
      />
    </motion.section>
  );

  const renderRequests = () => (
    <motion.section
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">System-wide Requests</h2>
      </div>
      <DataTable
        headers={['ID', 'Blood Group', 'Units', 'Hospital', 'Urgency', 'Status', 'Date']}
        data={requests}
        emptyMessage="No requests found in the system."
        renderRow={(req) => (
          <>
            <td className="font-mono text-[10px] text-text-muted uppercase">{req._id.slice(-8)}</td>
            <td className="font-black text-primary">{req.bloodGroup}</td>
            <td className="font-bold">{req.units}</td>
            <td className="text-sm">{req.hospitalId?.name}</td>
            <td><span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>{req.urgency}</span></td>
            <td><span className={`badge badge-${req.status}`}>{req.status}</span></td>
            <td className="text-[10px] text-text-muted">{new Date(req.createdAt).toLocaleDateString()}</td>
          </>
        )}
      />
    </motion.section>
  );

  return (
    <DashboardLayout user={user}>
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter uppercase">
          Admin Panel
        </h1>
        <p className="text-text-muted mt-2 text-lg">
          Centralized management and system monitoring
        </p>
      </header>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {activeView === 'dashboard' && (
              <>
                {renderStats()}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Activity size={20} className="text-primary" /> Recent System Requests
                    </h3>
                    {requests.slice(0, 5).map(req => (
                      <div key={req._id} className="flex items-center justify-between py-3 border-b border-glass-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                            {req.bloodGroup}
                          </div>
                          <span className="text-sm font-medium">{req.hospitalId?.name}</span>
                        </div>
                        <span className="text-[10px] text-text-muted">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Users size={20} className="text-indigo-500" /> New Registrations
                    </h3>
                    {users.slice(-5).reverse().map(u => (
                      <div key={u._id} className="flex items-center justify-between py-3 border-b border-glass-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs uppercase">
                            {u.name[0]}
                          </div>
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary uppercase">{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {activeView === 'donors' && renderManagementList("Donor Management")}
            {activeView === 'hospitals' && renderManagementList("Hospital Verification")}
            {activeView === 'requests' && renderRequests()}
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminDashboard;
