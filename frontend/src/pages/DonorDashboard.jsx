import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplet, MapPin, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import api from '../api/axios';

const DonorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchData();
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
      fetchData(); // Refresh
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user.name}</h1>
          <p className="text-text-muted">
            Donor Dashboard • Blood Group: <span className="font-bold text-primary">{user.bloodGroup}</span>
          </p>
        </div>
        <div className="glass-card flex items-center gap-4 px-8 py-4">
          <div className={`h-3 w-3 rounded-full ${user.availability ? 'bg-success' : 'bg-text-muted'}`}></div>
          <span className="font-semibold">{user.availability ? 'Available for Donation' : 'Currently Unavailable'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <AlertCircle className="text-primary" /> Urgent Requests Nearby
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
                      <Droplet className="mb-1 text-primary fill-primary" />
                      <div className="text-lg font-bold">{req.bloodGroup}</div>
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg font-bold">{req.units} Units Required</h4>
                      <div className="flex gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1"><MapPin size={14} /> Hospital Location</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {req.urgency === 'high' ? 'Urgent' : 'Normal'}
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
              <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
              <p>No urgent requests for your blood group right now.</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <Calendar className="text-primary" /> My Activities
          </h2>
          <div className="glass-card p-6">
            {myResponses.length > 0 ? (
              <div className="space-y-6">
                {myResponses.map((res) => (
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
    </div>
  );
};

export default DonorDashboard;
