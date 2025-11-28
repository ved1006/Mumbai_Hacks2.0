import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/hospitals`);
                setHospitals(res.data);
            } catch (err) {
                console.error("Error fetching hospitals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-view">
            <h2>Hospital Status Overview</h2>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {hospitals.map(h => (
                    <div key={h.hospital_id} className={`card ${h.status.toLowerCase()}`} style={{
                        padding: '1.5rem',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        borderLeft: `5px solid ${h.status === 'Red' ? '#ef4444' : h.status === 'Yellow' ? '#eab308' : '#22c55e'}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>{h.hospital_name}</h3>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                backgroundColor: h.status === 'Red' ? '#fee2e2' : h.status === 'Yellow' ? '#fef9c3' : '#dcfce7',
                                color: h.status === 'Red' ? '#991b1b' : h.status === 'Yellow' ? '#854d0e' : '#166534'
                            }}>
                                {h.status}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <div>
                                <span style={{ color: '#64748b' }}>ER Admissions:</span>
                                <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{h.er_admissions}</div>
                            </div>
                            <div>
                                <span style={{ color: '#64748b' }}>Beds Available:</span>
                                <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{h.bed_availability}</div>
                            </div>
                            <div>
                                <span style={{ color: '#64748b' }}>Ambulances:</span>
                                <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{h.ambulance_arrivals}</div>
                            </div>
                            <div>
                                <span style={{ color: '#64748b' }}>Staff Capacity:</span>
                                <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{h.staff_capacity}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
