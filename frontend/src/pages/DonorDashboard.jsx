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
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Donor Dashboard • Blood Group: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user.bloodGroup}</span></p>
        </div>
        <div className="glass-card" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: user.availability ? 'var(--success)' : 'var(--text-muted)' }}></div>
          <span style={{ fontWeight: '600' }}>{user.availability ? 'Available for Donation' : 'Currently Unavailable'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle color="var(--primary)" /> Urgent Requests Nearby
          </h2>
          
          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {requests.map((req) => (
                <motion.div 
                  key={req._id}
                  className="glass-card" 
                  style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 77, 77, 0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                      <Droplet color="var(--primary)" fill="var(--primary)" style={{ marginBottom: '0.25rem' }} />
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{req.bloodGroup}</div>
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '0.25rem' }}>{req.units} Units Required</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> Hospital Location</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {req.urgency === 'high' ? 'Urgent' : 'Normal'}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleAccept(req._id)} className="btn btn-primary">Accept Request</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No urgent requests for your blood group right now.</p>
            </div>
          )}
        </section>

        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar color="var(--primary)" /> My Activities
          </h2>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            {myResponses.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myResponses.map((res) => (
                  <div key={res._id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', lastChild: { borderBottom: 'none' } }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600' }}>{res.bloodGroup} Donation</span>
                      <span className={`badge badge-${res.status}`}>{res.status}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(res.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>No recent activities.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DonorDashboard;
