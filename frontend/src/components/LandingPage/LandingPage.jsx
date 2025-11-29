import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import '../../SharedStyles.css';

/* Add these styles to LandingPage.css or inline them */
const styles = `
.role-button {
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.role-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  filter: brightness(1.1);
}

.role-button:active {
  transform: translateY(-1px);
}

.role-button.admin { 
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.role-button.hospital { 
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
}

.role-button.dispatcher { 
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.39);
}

.role-button.patient { 
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.39);
}
`;

import AnimatedFeature from './AnimatedFeature'; // Import the new component

// IMPORTANT: Find 3 images and place them in an `assets` folder
// You can get great free illustrations from sites like undraw.co
import senseImage from '../../assets/sense.png';
import thinkImage from '../../assets/think.png';
import actImage from '../../assets/act.png';

const LandingPage = ({ systemStatus }) => {
  const navigate = useNavigate();

  const statusInfo = {
    operational: { text: 'System Operational', color: '#22c55e' },
    offline: { text: 'System Offline', color: '#ef4444' },
  };
  const currentStatus = statusInfo[systemStatus] || statusInfo.offline;

  return (
    <motion.div
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- Top Bar: Brand + System Status (No Change) --- */}
      <div className="top-bar">
        <motion.div
          className="brand-name"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="brand-highlight">Health</span>HIVE.<span className="ai">AI</span>
        </motion.div>

        <motion.div
          className="system-status-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="status-dot" style={{ backgroundColor: currentStatus.color }}></div>
          <span>{currentStatus.text}</span>
        </motion.div>
      </div>

      {/* --- Hero Section (Improved Text) --- */}
      <div className="hero-section">
        <motion.div
          className="heart-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
        >
          ❤️
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ background: 'none', textShadow: 'none' }} // Remove white background/shadow if any
        >
          From Chaos to Coordination
          <br />
          <span>AI-Powered Emergency Response</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Our agentic AI transforms city-wide hospital chaos into an intelligent, coordinated response during emergencies.
        </motion.p>

        {/* --- Dashboard Access Links --- */}
        <motion.div
          className="dashboard-links"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button onClick={() => navigate('/system-admin')} className="role-button admin">
            🛡️ System Admin
          </button>
          <button onClick={() => navigate('/hospital-admin')} className="role-button hospital">
            🏥 Hospital Admin
          </button>
          <button onClick={() => navigate('/dispatcher')} className="role-button dispatcher">
            🚑 Dispatcher
          </button>
          <button onClick={() => navigate('/patient')} className="role-button patient">
            🆘 Patient / Bystander
          </button>
        </motion.div>
      </div>

      {/* --- How It Works Section (New Animated Section) --- */}
      <div className="how-it-works-container">
        <AnimatedFeature
          icon="📡"
          title="Sense: The Digital Pulse"
          description="Our agent constantly monitors the entire hospital network, ingesting live data on bed occupancy, ICU availability, staff utilization, and incoming incident reports. It sees the complete picture in real-time."
          image={senseImage}
          imageSide="right"
        />
        <AnimatedFeature
          icon="🧠"
          title="Think: The Predictive Brain"
          description="This is where the magic happens. An XGBoost model predicts future surge and wait times, while our optimization algorithm calculates a unique 'Time-to-Treatment' score for every hospital. It doesn't just find the closest hospital—it finds the BEST one."
          image={thinkImage}
          imageSide="left"
        />
        <AnimatedFeature
          icon="⚡"
          title="Act: Coordinated Action Plan"
          description="Based on its analysis, the agent generates and dispatches a clear, actionable plan. It reroutes ambulances, sends alerts to hospitals to prepare ER teams, recommends resource mobilization, and even issues public advisories."
          image={actImage}
          imageSide="right"
        />
      </div>
    </motion.div>
  );
};

export default LandingPage;
