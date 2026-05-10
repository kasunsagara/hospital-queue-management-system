import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaSpinner, FaTint } from 'react-icons/fa';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    bloodGroup: '',
    contactNumber: '',
    latitude: null,
    longitude: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { latitude, longitude, ...rest } = formData;
    const payload = {
      ...rest,
      location: latitude ? {
        type: 'Point',
        coordinates: [longitude, latitude]
      } : undefined
    };

    try {
      await api.post('/auth/register', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center py-16">
      <motion.div
        className="glass-card w-full max-w-[600px] p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Create Account</h2>
          <p className="text-text-muted">Join the life-saving network today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="input-group">
              <label>Full Name</label>
              <div className="relative">
                <FaUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="pl-12"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="relative">
                <FaEnvelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="pl-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="input-group">
              <label>Password</label>
              <div className="relative">
                <FaLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <div className="relative">
                <FaPhone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="0771234567"
                  className="pl-12"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="input-group">
              <label>Join as</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="">Select Role</option>
                <option value="donor">Donor</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            {formData.role === 'donor' && (
              <div className="input-group">
                <label>Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  required
                >
                  <option value="">Select Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={`input-group transition-opacity duration-300 ${formData.latitude ? 'opacity-100' : 'opacity-50'}`}>
            <label className="flex items-center gap-2">
              <FaMapMarkerAlt size={14} /> Location Status
            </label>
            <div className="rounded-lg bg-white/5 p-3 text-sm">
              {formData.latitude ? `Location Captured (${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)})` : 'Detecting Location...'}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-4 w-full justify-center py-4"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="font-semibold text-primary">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
