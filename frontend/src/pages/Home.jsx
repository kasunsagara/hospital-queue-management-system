import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTint, FaHeart, FaShieldAlt, FaBolt } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="container pt-16">
      <section className="mb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-6xl font-bold leading-[1.1]">
            Saving Lives with <span className="text-primary">Smart</span> <br /> Blood Donation
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-text-muted">
            A real-time platform connecting donors with hospitals. Fast, secure, and location-aware matching to ensure blood reaches those in need, instantly.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/register" className="btn btn-primary px-10 py-4 text-lg">
              Become a Donor
            </Link>
            <Link to="/login" className="btn btn-outline px-10 py-4 text-lg">
              Hospital Portal
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { icon: <FaBolt size={32} />, title: "Real-time Alerts", desc: "Instant notifications for urgent blood requests in your vicinity." },
          { icon: <FaShieldAlt size={32} />, title: "Verified Network", desc: "Every hospital and donor is verified for a safe and secure experience." },
          { icon: <FaHeart size={32} />, title: "Track Impact", desc: "See how your donations are helping people and saving lives." }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            className="glass-card flex flex-col items-center p-10 text-center"
            whileHover={{ y: -10, borderColor: 'var(--color-primary)' }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex justify-center text-primary">
              {feature.icon}
            </div>
            <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
            <p className="text-text-muted">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="glass-card mb-24 grid grid-cols-1 items-center gap-16 p-16 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-bold">Why Join BloodSync?</h2>
          <ul className="space-y-4">
            {[
              "Automated matching based on blood group and GPS location.",
              "End-to-end encryption for all medical and personal data.",
              "Seamless communication between donors and hospitals.",
              "Mobile-first design for donation on the go."
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-text-muted">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex justify-center">
          <div className="h-[300px] w-full rounded-[20px] bg-gradient-to-br from-primary to-indigo-600 opacity-20"></div>
          <FaTint 
            size={120} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-[0_0_20px_rgba(255,77,77,0.5)]"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
