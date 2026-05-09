import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, ClipboardList, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const HospitalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    bloodGroup: '',
    units: 1,
    urgency: 'normal'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, patRes] = await Promise.all([
        api.get('/request/my'),
        api.get('/patients')
      ]);
      setRequests(reqRes.data);
      setPatients(patRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/request/create', formData);
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create request");
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Hospital Command Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage patients and blood requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          <Plus size={20} /> New Blood Request
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <section className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <Users color="#4f46e5" />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Registered Patients</h2>
          </div>
          
          {patients.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {patients.map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Age: {p.age} • Gender: {p.gender}</div>
                  </div>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{p.bloodGroup}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', py: '2rem' }}>No patients registered yet.</p>
          )}
        </section>

        <section className="glass-card" style={{ padding: '2rem', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <ClipboardList color="#10b981" />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Active Blood Requests</h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '1rem' }}>Patient</th>
                  <th style={{ padding: '1rem' }}>Group</th>
                  <th style={{ padding: '1rem' }}>Units</th>
                  <th style={{ padding: '1rem' }}>Urgency</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Donor</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem' }}>{req.patientId?.name || 'Unknown'}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{req.bloodGroup}</td>
                    <td style={{ padding: '1rem' }}>{req.units}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${req.status}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {req.donorId?.name || 'Searching...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              className="glass-card" 
              style={{ width: '90%', maxWidth: '500px', padding: '3rem', position: 'relative' }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 style={{ marginBottom: '2rem' }}>New Blood Request</h2>
              <form onSubmit={handleCreateRequest}>
                <div className="input-group">
                  <label>Select Patient</label>
                  <select 
                    value={formData.patientId} 
                    onChange={e => setFormData({...formData, patientId: e.target.value})}
                    required
                  >
                    <option value="">Choose Patient</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.bloodGroup})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="input-group">
                    <label>Blood Group</label>
                    <select 
                      value={formData.bloodGroup} 
                      onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
                      required
                    >
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Units Needed</label>
                    <input 
                      type="number" min="1" 
                      value={formData.units} 
                      onChange={e => setFormData({...formData, units: parseInt(e.target.value)})}
                      required 
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Urgency Level</label>
                  <select 
                    value={formData.urgency} 
                    onChange={e => setFormData({...formData, urgency: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
                  Post Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalDashboard;
