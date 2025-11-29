import { useState, useEffect } from 'react';
import axios from 'axios';
import HospitalCard from './HospitalCard';

const API_URL = import.meta.env.VITE_API_URL;

export default function HospitalAdminDashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [resHospitals, resAlerts] = await Promise.all([
                axios.get(`${API_URL}/api/hospitals`),
                axios.get(`${API_URL}/api/alerts/recent`)
            ]);
            setHospitals(resHospitals.data);
            setAlerts(resAlerts.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div className="dashboard-view" style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>🏥 Hospital Administration</h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>
                        Managing {hospitals.length} facilities across Mumbai
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                >
                    🔄 Refresh
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {hospitals.map(hospital => (
                    <HospitalCard
                        key={hospital.hospital_id}
                        hospital={hospital}
                        alerts={alerts}
                        onUpdate={fetchData}
                    />
                ))}
            </div>
        </div>
    );
}
