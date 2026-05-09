import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, ClipboardList, CheckCircle2, XCircle, Clock, AlertCircle, UserPlus } from 'lucide-react';
import api from '../api/axios';

const HospitalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
      setFormData({ patientId: '', bloodGroup: '', units: 1, urgency: 'normal' });
      fetchData();
    } catch (err) {
      alert("Failed to create request");
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

  return (
    <div className="container py-8">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Hospital Command Center</h1>
          <p className="text-text-muted">Manage patients and blood requests</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowPatientModal(true)} 
            className="btn btn-outline px-6 py-4"
          >
            <UserPlus size={20} /> Add Patient
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn btn-primary px-8 py-4"
          >
            <Plus size={20} /> New Blood Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="glass-card p-8 lg:col-span-1">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-xl bg-indigo-500/10 p-3">
              <Users className="text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold">Registered Patients</h2>
          </div>
          
          {patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map(p => (
                <div key={p._id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-text-muted">Age: {p.age} • Gender: {p.gender}</div>
                  </div>
                  <div className="font-bold text-primary">{p.bloodGroup}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-text-muted">No patients registered yet. Use "Add Patient" to get started.</p>
          )}
        </section>

        <section className="glass-card p-8 lg:col-span-2">
          <div className="mb-8 flex items-center gap-4">
            <div className="rounded-xl bg-success/10 p-3">
              <ClipboardList className="text-success" />
            </div>
            <h2 className="text-xl font-bold">Active Blood Requests</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-sm text-text-muted">
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
                  <tr key={req._id} className="border-t border-glass-border transition-colors hover:bg-white/5">
                    <td className="p-4">{req.patientId?.name || 'Unknown'}</td>
                    <td className="p-4 font-bold">{req.bloodGroup}</td>
                    <td className="p-4">{req.units}</td>
                    <td className="p-4">
                      <span className={`badge ${req.urgency === 'high' ? 'badge-urgent' : 'badge-pending'}`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`badge badge-${req.status}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">
                      {req.donorId?.name || 'Searching...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* New Blood Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              className="glass-card relative w-full max-w-[500px] p-12"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="mb-8 text-2xl font-bold">New Blood Request</h2>
              {patients.length > 0 ? (
                <form onSubmit={handleCreateRequest}>
                  <div className="input-group">
                    <label>Select Patient</label>
                    <select 
                      className="cursor-pointer"
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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="input-group">
                      <label>Blood Group</label>
                      <select 
                        className="cursor-pointer"
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
                      className="cursor-pointer"
                      value={formData.urgency} 
                      onChange={e => setFormData({...formData, urgency: e.target.value})}
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High (Urgent)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary mt-4 w-full justify-center py-4">
                    Post Request
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-muted mb-6">You need to register a patient first.</p>
                  <button 
                    onClick={() => { setShowModal(false); setShowPatientModal(true); }}
                    className="btn btn-outline"
                  >
                    Add a Patient
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showPatientModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowPatientModal(false)}
            />
            <motion.div 
              className="glass-card relative w-full max-w-[500px] p-12"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="mb-8 text-2xl font-bold">Register New Patient</h2>
              <form onSubmit={handleAddPatient}>
                <div className="input-group">
                  <label>Patient Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    value={patientFormData.name} 
                    onChange={e => setPatientFormData({...patientFormData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="input-group">
                    <label>Age</label>
                    <input 
                      type="number" 
                      placeholder="Age"
                      value={patientFormData.age} 
                      onChange={e => setPatientFormData({...patientFormData, age: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Gender</label>
                    <select 
                      value={patientFormData.gender} 
                      onChange={e => setPatientFormData({...patientFormData, gender: e.target.value})}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Blood Group</label>
                  <select 
                    value={patientFormData.bloodGroup} 
                    onChange={e => setPatientFormData({...patientFormData, bloodGroup: e.target.value})}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary mt-4 w-full justify-center py-4">
                  Add Patient
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
