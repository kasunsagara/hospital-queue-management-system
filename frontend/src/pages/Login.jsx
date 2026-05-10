import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Login Successful!');
      const role = response.data.user.role;
      if (role === 'donor') navigate('/donor-dashboard');
      else if (role === 'hospital') navigate('/hospital-dashboard');
      else if (role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <motion.div 
        className="glass-card w-full max-w-[450px] p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">Welcome Back</h2>
          <p className="text-text-muted">Login to manage your blood donations</p>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="relative">
              <FaEnvelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                className="pl-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="relative">
              <FaLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full justify-center py-4"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/register" className="font-semibold text-primary">Register now</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
