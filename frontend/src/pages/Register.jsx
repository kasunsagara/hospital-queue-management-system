import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Loader2, Droplet } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor',
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

    const payload = {
      ...formData,
      location: formData.latitude ? {
        type: 'Point',
        coordinates: [formData.longitude, formData.latitude]
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
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
      <motion.div 
        className="glass-card" 
        style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join the life-saving network today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="with-icon"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="with-icon"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="with-icon"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="+1 234 567 890" 
                  className="with-icon"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  required 
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Join as</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="donor">Donor</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            {formData.role === 'donor' && (
              <div className="input-group">
                <label>Blood Group</label>
                <select 
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
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

          <div className="input-group" style={{ opacity: formData.latitude ? 1 : 0.5 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} /> Location Status
            </label>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.875rem' }}>
              {formData.latitude ? `Location Captured (${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)})` : 'Detecting Location...'}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
        </p>
      </motion.div>
      
      <style>{`
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        input.with-icon {
          padding-left: 3rem !rem;
        }
        select {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Register;
