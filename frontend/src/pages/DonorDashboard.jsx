import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTint, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import DataTable from '../components/DataTable';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchData();
    
    const handleViewChange = (e) => setActiveView(e.detail);
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/request/all'),
        api.get('/request/my')
      ]);
      setRequests(allRes.data.filter(r => r.status === 'pending' && r.bloodGroup === user.bloodGroup));
      setMyResponses(myRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.patch(`/request/accept/${id}`);
      toast.success('Donation request accepted!');
      fetchData(); // Refresh
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <FaExclamationCircle className="text-primary" /> Urgent Requests Nearby
        </h2>
        
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <motion.div 
                key={req._id}
                className="glass-card flex items-center justify-between p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-6">
                  <div className="min-w-[70px] rounded-xl bg-primary/10 p-4 text-center">
                    <FaTint className="mb-1 text-primary" />
                    <div className="text-lg font-bold">{req.bloodGroup}</div>
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-bold">{req.units} Units Required</h4>
                    <div className="flex gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt size={14} /> Hospital Location</span>
                      <span className="flex items-center gap-1">
                        <FaClock size={14} /> {req.urgency === 'high' ? 'Urgent' : 'Normal'}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleAccept(req._id)} className="btn btn-primary">
                  Accept Request
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card py-12 text-center text-text-muted">
            <FaCheckCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No urgent requests for your blood group right now.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <FaCalendarAlt className="text-primary" /> Recent Activity
        </h2>
        <div className="glass-card p-6">
          {myResponses.length > 0 ? (
            <div className="space-y-6">
              {myResponses.slice(0, 5).map((res) => (
                <div key={res._id} className="border-b border-glass-border pb-4 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{res.bloodGroup} Donation</span>
                    <span className={`badge badge-${res.status}`}>{res.status}</span>
                  </div>
                  <div className="text-xs text-text-muted">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-text-muted">No recent activities.</p>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <DashboardLayout user={user}>
      <header className="mb-12">
        <h1 className="text-4xl font-bold">Welcome, {user.name}</h1>
        <p className="text-text-muted mt-2">
          Blood Group: <span className="font-bold text-primary">{user.bloodGroup}</span> • 
          Status: <span className={user.availability ? 'text-success font-bold' : 'text-text-muted'}>
            {user.availability ? ' Available' : ' Unavailable'}
          </span>
        </p>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'requests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Available Requests</h2>
            <DataTable 
              headers={['Blood Group', 'Units', 'Urgency', 'Action']}
              data={requests}
              emptyMessage="No urgent requests for your blood group right now."
              renderRow={(req) => (
                <>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FaTint size={14} className="text-primary" />
                      </div>
                      <span className="font-bold">{req.bloodGroup}</span>
                    </div>
                  </td>
                  <td className="font-bold">{req.units} Units</td>
                  <td>
                    <span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleAccept(req._id)} className="btn btn-primary px-4 py-2 text-xs">
                      Accept
                    </button>
                  </td>
                </>
              )}
            />
          </motion.div>
        )}
        {activeView === 'activities' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">My Donation History</h2>
            <DataTable 
              headers={['Date', 'Type', 'Status']}
              data={myResponses}
              emptyMessage="No history found."
              renderRow={(res) => (
                <>
                  <td className="text-sm text-text-muted">{new Date(res.createdAt).toLocaleString()}</td>
                  <td className="font-bold">{res.bloodGroup} Donation</td>
                  <td><span className={`badge badge-${res.status}`}>{res.status}</span></td>
                </>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DonorDashboard;
