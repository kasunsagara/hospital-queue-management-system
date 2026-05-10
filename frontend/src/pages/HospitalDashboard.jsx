import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, ClipboardList, UserPlus } from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

const HospitalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    patientId: '',
    bloodGroup: '',
    units: 1,
    urgency: 'normal'
  });

  const [patientFormData, setPatientFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    bloodGroup: ''
  });

  useEffect(() => {
    fetchData();
    
    const handleViewChange = (e) => setActiveView(e.detail);
    window.addEventListener('change-view', handleViewChange);
    return () => window.removeEventListener('change-view', handleViewChange);
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
    const payload = { ...formData, location: user.location };

    try {
      await api.post('/request/create', payload);
      setShowModal(false);
      setFormData({ patientId: '', bloodGroup: '', units: 1, urgency: 'normal' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create request");
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients', patientFormData);
      setShowPatientModal(false);
      setPatientFormData({ name: '', age: '', gender: 'male', bloodGroup: '' });
      fetchData();
    } catch (err) {
      alert("Failed to add patient");
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <section className="glass-card p-8 lg:col-span-1">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold">Quick Patient List</h2>
        </div>
        <div className="space-y-4">
          {patients.slice(0, 5).map(p => (
            <div key={p._id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-glass-border">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-text-muted">{p.bloodGroup}</div>
              </div>
              <div className="text-[10px] uppercase font-bold text-text-muted">ID: {p._id.slice(-4)}</div>
            </div>
          ))}
          <button onClick={() => setActiveView('patients')} className="w-full py-2 text-sm font-bold text-primary hover:underline">View All Patients</button>
        </div>
      </section>

      <section className="glass-card p-8 lg:col-span-2">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <ClipboardList size={20} />
          </div>
          <h2 className="text-xl font-bold">Recent Requests</h2>
        </div>
        <div className="space-y-4">
          {requests.slice(0, 5).map(req => (
            <div key={req._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-glass-border">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">{req.bloodGroup}</div>
                <div>
                  <div className="font-bold">{req.units} Units</div>
                  <div className="text-xs text-text-muted">{req.patientId?.name}</div>
                </div>
              </div>
              <span className={`badge badge-${req.status}`}>{req.status}</span>
            </div>
          ))}
          <button onClick={() => setActiveView('requests')} className="w-full py-2 text-sm font-bold text-primary hover:underline">Manage All Requests</button>
        </div>
      </section>
    </div>
  );

  return (
    <DashboardLayout user={user}>
      <header className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Hospital Command Center</h1>
          <p className="text-text-muted mt-2">Manage patients and blood requests</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowPatientModal(true)} className="btn btn-outline border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white">
            <UserPlus size={20} /> Add Patient
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={20} /> New Blood Request
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'patients' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Patient Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map(p => (
                <div key={p._id} className="glass-card p-6 border border-glass-border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg">{p.name[0]}</div>
                    <span className="font-black text-primary text-xl">{p.bloodGroup}</span>
                  </div>
                  <div className="font-bold text-lg">{p.name}</div>
                  <div className="text-sm text-text-muted mt-1">Age: {p.age} • Gender: {p.gender}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {activeView === 'requests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Blood Requests</h2>
            <div className="glass-card overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm text-text-muted bg-white/5">
                    <th className="p-4 font-medium">Patient</th>
                    <th className="p-4 font-medium">Group</th>
                    <th className="p-4 font-medium">Units</th>
                    <th className="p-4 font-medium">Urgency</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Donor</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req._id} className="border-t border-glass-border hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold">{req.patientId?.name || 'Unknown'}</td>
                      <td className="p-4 font-black text-primary">{req.bloodGroup}</td>
                      <td className="p-4 font-medium">{req.units}</td>
                      <td className="p-4"><span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>{req.urgency}</span></td>
                      <td className="p-4"><span className={`badge badge-${req.status}`}>{req.status.replace('_', ' ')}</span></td>
                      <td className="p-4 text-sm text-text-muted">{req.donorId?.name || 'Searching...'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {requests.length === 0 && <p className="py-20 text-center text-text-muted">No requests found.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Blood Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div className="glass-card relative w-full max-w-[500px] p-12" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="mb-8 text-2xl font-bold">New Blood Request</h2>
              {patients.length > 0 ? (
                <form onSubmit={handleCreateRequest}>
                  <div className="input-group"><label>Select Patient</label><select className="cursor-pointer" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} required><option value="">Choose Patient</option>{patients.map(p => (<option key={p._id} value={p._id}>{p.name} ({p.bloodGroup})</option>))}</select></div>
                  <div className="grid grid-cols-2 gap-6"><div className="input-group"><label>Blood Group</label><select className="cursor-pointer" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} required><option value="">Select</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (<option key={g} value={g}>{g}</option>))}</select></div><div className="input-group"><label>Units Needed</label><input type="number" min="1" value={formData.units} onChange={e => setFormData({...formData, units: parseInt(e.target.value)})} required /></div></div>
                  <div className="input-group"><label>Urgency Level</label><select className="cursor-pointer" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}><option value="normal">Normal</option><option value="high">High (Urgent)</option></select></div>
                  <button type="submit" className="btn btn-primary mt-4 w-full justify-center py-4">Post Request</button>
                </form>
              ) : (
                <div className="text-center py-8"><p className="text-text-muted mb-6">You need to register a patient first.</p><button onClick={() => { setShowModal(false); setShowPatientModal(true); }} className="btn btn-outline">Add a Patient</button></div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showPatientModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPatientModal(false)} />
            <motion.div className="glass-card relative w-full max-w-[500px] p-12" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="mb-8 text-2xl font-bold">Register New Patient</h2>
              <form onSubmit={handleAddPatient}>
                <div className="input-group"><label>Patient Name</label><input type="text" placeholder="Enter full name" value={patientFormData.name} onChange={e => setPatientFormData({...patientFormData, name: e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-6"><div className="input-group"><label>Age</label><input type="number" placeholder="Age" value={patientFormData.age} onChange={e => setPatientFormData({...patientFormData, age: e.target.value})} required /></div><div className="input-group"><label>Gender</label><select value={patientFormData.gender} onChange={e => setPatientFormData({...patientFormData, gender: e.target.value})}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div></div>
                <div className="input-group"><label>Blood Group</label><select value={patientFormData.bloodGroup} onChange={e => setPatientFormData({...patientFormData, bloodGroup: e.target.value})} required><option value="">Select Blood Group</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (<option key={g} value={g}>{g}</option>))}</select></div>
                <button type="submit" className="btn btn-primary mt-4 w-full justify-center py-4">Add Patient</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
