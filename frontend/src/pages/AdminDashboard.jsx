import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Droplet, ShieldCheck, ClipboardList, Check, Search, Filter } from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

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
      className="glass-card p-8"
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

      <div className="space-y-4">
        {filteredUsers.map(user => (
          <div key={user._id} className="flex items-center justify-between rounded-2xl bg-white/5 p-5 border border-transparent hover:border-glass-border transition-all group">
            <div className="flex items-center gap-5">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${user.role === 'hospital' ? 'bg-indigo-500/20 text-indigo-500 shadow-indigo-500/10' : 'bg-primary/20 text-primary shadow-primary/10'}`}>
                {user.name[0]}
              </div>
              <div>
                <div className="font-bold text-lg group-hover:text-primary transition-colors">{user.name}</div>
                <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
                  <span className="uppercase font-bold tracking-wider px-2 py-0.5 bg-white/5 rounded-md">{user.role}</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user.role === 'hospital' && !user.isVerified && (
                <button 
                  onClick={() => handleVerify(user._id)}
                  className="btn btn-primary px-4 py-2 text-xs"
                >
                  <Check size={16} /> Verify
                </button>
              )}
              {user.isVerified ? (
                <div className="flex items-center gap-1.5 text-success font-bold text-sm bg-success/10 px-3 py-1.5 rounded-lg">
                  <ShieldCheck size={16} /> Verified
                </div>
              ) : (
                <div className="text-[10px] bg-warning/10 text-warning px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">Pending</div>
              )}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>No results found matching your search.</p>
          </div>
        )}
      </div>
    </motion.section>
  );

  const renderRequests = () => (
    <motion.section 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="glass-card p-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">System-wide Requests</h2>
        <div className="flex items-center gap-2 text-sm text-text-muted bg-white/5 px-4 py-2 rounded-lg">
          <Filter size={16} /> Filter by Status
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map(req => (
          <div key={req._id} className="rounded-2xl bg-white/5 p-6 border border-glass-border hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex flex-col items-center justify-center font-black text-primary border border-primary/20">
                <span className="text-lg leading-none">{req.bloodGroup}</span>
                <Droplet size={14} className="mt-1 fill-primary" />
              </div>
              <span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>
                {req.urgency} Urgency
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">{req.units} Units</div>
                  <div className="text-sm text-text-muted font-medium">{req.hospitalId?.name}</div>
                </div>
                <div className={`text-xs font-bold uppercase tracking-tighter px-3 py-1 rounded-md ${req.status === 'pending' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                  {req.status}
                </div>
              </div>
              <div className="text-[10px] text-text-muted pt-4 border-t border-glass-border flex justify-between">
                <span>REQUEST ID: {req._id.slice(-8).toUpperCase()}</span>
                <span>{new Date(req.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="col-span-full text-center py-20 text-text-muted">No requests found in the system.</p>}
      </div>
    </motion.section>
  );

  return (
    <DashboardLayout user={user}>
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter">
          {activeView === 'dashboard' && "Admin Overview"}
          {activeView === 'donors' && "Donor Directory"}
          {activeView === 'hospitals' && "Hospital Network"}
          {activeView === 'requests' && "Global Monitor"}
        </h1>
        <p className="text-text-muted mt-2 text-lg">
          {activeView === 'dashboard' && "Real-time system statistics and health"}
          {activeView === 'donors' && "Manage and monitor registered donors"}
          {activeView === 'hospitals' && "Verify and manage hospital accounts"}
          {activeView === 'requests' && "Track all active blood requests globally"}
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
                  <div className="glass-card p-8">
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
                  <div className="glass-card p-8">
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
