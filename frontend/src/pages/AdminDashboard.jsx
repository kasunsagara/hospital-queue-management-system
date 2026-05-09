import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Droplet, ShieldCheck, ClipboardList, LogOut, Check, X, Search } from 'lucide-react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Admin Control Center</h1>
          <p className="text-text-muted">Global system management & verification</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline border-danger text-danger hover:bg-danger hover:text-white p-4">
          <LogOut size={20} />
        </button>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <Users className="text-primary" />
            <span className="text-2xl font-bold">{users.length}</span>
          </div>
          <p className="text-sm text-text-muted">Total Users</p>
        </div>
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <Droplet className="text-primary" />
            <span className="text-2xl font-bold">{requests.length}</span>
          </div>
          <p className="text-sm text-text-muted">Total Requests</p>
        </div>
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <ShieldCheck className="text-success" />
            <span className="text-2xl font-bold">{users.filter(u => u.isVerified).length}</span>
          </div>
          <p className="text-sm text-text-muted">Verified Entities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* User Management Section */}
        <section className="glass-card p-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-white/5 border border-glass-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map(user => (
              <div key={user._id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-transparent hover:border-glass-border transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${user.role === 'hospital' ? 'bg-indigo-500/20 text-indigo-500' : 'bg-primary/20 text-primary'}`}>
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-text-muted uppercase">{user.role} • {user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {user.role === 'hospital' && !user.isVerified && (
                    <button 
                      onClick={() => handleVerify(user._id)}
                      className="p-2 bg-success/20 text-success rounded-lg hover:bg-success hover:text-white transition-all"
                      title="Verify Hospital"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  {user.isVerified ? (
                    <ShieldCheck size={20} className="text-success" />
                  ) : (
                    <span className="text-[10px] bg-warning/10 text-warning px-2 py-1 rounded-full font-bold uppercase">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Request Monitor */}
        <section className="glass-card p-8">
          <h2 className="mb-8 text-xl font-bold">System-wide Requests</h2>
          <div className="space-y-4">
            {requests.slice(0, 10).map(req => (
              <div key={req._id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <div className="font-semibold">{req.units} Units Required</div>
                    <div className="text-xs text-text-muted">
                      {req.hospitalId?.name} • <span className={`capitalize ${req.status === 'pending' ? 'text-warning' : 'text-success'}`}>{req.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-text-muted">
                  {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {requests.length === 0 && <p className="text-center py-8 text-text-muted">No requests found in the system.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
