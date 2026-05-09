import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Shield, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Saving Lives with <span style={{ color: 'var(--primary)' }}>Smart</span> <br /> Blood Donation
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            A real-time platform connecting donors with hospitals. Fast, secure, and location-aware matching to ensure blood reaches those in need, instantly.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Become a Donor
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Hospital Portal
            </Link>
          </div>
        </motion.div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
        {[
          { icon: <Zap size={32} />, title: "Real-time Alerts", desc: "Instant notifications for urgent blood requests in your vicinity." },
          { icon: <Shield size={32} />, title: "Verified Network", desc: "Every hospital and donor is verified for a safe and secure experience." },
          { icon: <Heart size={32} />, title: "Track Impact", desc: "See how your donations are helping people and saving lives." }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            className="glass-card" 
            style={{ padding: '2.5rem', textAlign: 'center' }}
            whileHover={{ y: -10, borderColor: 'var(--primary)' }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              {feature.icon}
            </div>
            <h3 style={{ marginBottom: '1rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="glass-card" style={{ padding: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem', marginBottom: '6rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Join BloodSync?</h2>
          <ul style={{ listStyle: 'none' }}>
            {[
              "Automated matching based on blood group and GPS location.",
              "End-to-end encryption for all medical and personal data.",
              "Seamless communication between donors and hospitals.",
              "Mobile-first design for donation on the go."
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', height: '300px', background: 'linear-gradient(45deg, var(--primary), #4f46e5)', borderRadius: '20px', opacity: 0.2 }}></div>
          <Droplet size={120} color="var(--primary)" fill="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 0 20px rgba(255, 77, 77, 0.5))' }} />
        </div>
      </section>
    </div>
  );
};

export default Home;
