import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, ClipboardList, UserPlus } from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';
import DataTable from '../components/DataTable';

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

  const renderStats = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-12"
    >
      <div className="glass-card p-8 border-l-4 border-indigo-500">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Users size={24} />
          </div>
          <span className="text-3xl font-bold">{patients.length}</span>
        </div>
        <p className="text-sm font-medium text-text-muted">Registered Patients</p>
      </div>
      <div className="glass-card p-8 border-l-4 border-primary">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <ClipboardList size={24} />
          </div>
          <span className="text-3xl font-bold">{requests.length}</span>
        </div>
        <p className="text-sm font-medium text-text-muted">Blood Requests</p>
      </div>
    </motion.div>
  );

  const renderDashboard = () => (
    <>
      {renderStats()}
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
  </>
  );

  return (
    <DashboardLayout user={user}>
      <header className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Hospital Command Center</h1>
          <p className="text-text-muted mt-2">Manage patients and blood requests</p>
        </div>
        <div className="flex gap-4">
          {activeView === 'patients' && (
            <button onClick={() => setShowPatientModal(true)} className="btn bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(37,99,235,0.4)]">
              <UserPlus size={20} /> Add Patient
            </button>
          )}
          {activeView === 'requests' && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={20} /> New Blood Request
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'patients' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Patient Management</h2>
            <DataTable 
              headers={['ID', 'Name', 'Age', 'Gender', 'Blood Group']}
              data={patients}
              emptyMessage="No patients registered yet."
              renderRow={(p) => (
                <>
                  <td className="font-mono text-xs text-text-muted">#{p._id.slice(-6).toUpperCase()}</td>
                  <td className="font-bold">{p.name}</td>
                  <td>{p.age}</td>
                  <td className="capitalize">{p.gender}</td>
                  <td><span className="font-black text-primary">{p.bloodGroup}</span></td>
                </>
              )}
            />
          </motion.div>
        )}
        {activeView === 'requests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6">Blood Requests</h2>
            <DataTable 
              headers={['Patient', 'Blood Group', 'Units', 'Urgency', 'Status', 'Donor']}
              data={requests}
              emptyMessage="No blood requests found."
              renderRow={(req) => (
                <>
                  <td className="font-bold">{req.patientId?.name || 'Unknown'}</td>
                  <td className="font-black text-primary">{req.bloodGroup}</td>
                  <td className="font-medium">{req.units}</td>
                  <td><span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>{req.urgency}</span></td>
                  <td><span className={`badge badge-${req.status}`}>{req.status.replace('_', ' ')}</span></td>
                  <td className="text-sm text-text-muted">{req.donorId?.name || 'Searching...'}</td>
                </>
              )}
            />
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
