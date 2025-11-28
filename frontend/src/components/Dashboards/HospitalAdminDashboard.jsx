import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function HospitalAdminDashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // Fetch list of hospitals to let user "login" as one
        axios.get(`${API_URL}/api/hospitals`).then(res => {
            setHospitals(res.data);
            if (res.data.length > 0) setSelectedHospital(res.data[0]);
        });
    }, []);

    useEffect(() => {
        if (!selectedHospital) return;

        const fetchAlerts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/hospital/${selectedHospital.hospital_id}/alerts`);
                setAlerts(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 3000); // Poll for alerts
        return () => clearInterval(interval);
    }, [selectedHospital]);

    if (!selectedHospital) return <div>Loading...</div>;

    return (
        <div className="dashboard-view">
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'white', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Managing Hospital:</label>
                    <select
                        value={selectedHospital.hospital_id}
                        onChange={(e) => setSelectedHospital(hospitals.find(h => h.hospital_id === e.target.value))}
                        style={{ padding: '0.5rem', borderRadius: '4px' }}
                    >
                        {hospitals.map(h => (
                            <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Status</div>
                        <div style={{ fontWeight: 'bold', color: selectedHospital.status === 'Red' ? '#ef4444' : '#22c55e' }}>{selectedHospital.status}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Beds</div>
                        <div style={{ fontWeight: 'bold' }}>{selectedHospital.bed_availability}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Incoming Alerts */}
                <div>
                    <h3>🚨 Incoming Alerts</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {alerts.length === 0 ? <p style={{ color: '#64748b' }}>No active alerts</p> : alerts.map(alert => (
                            <div key={alert.id} style={{
                                padding: '1rem',
                                background: alert.severity === 'Critical' ? '#fee2e2' : '#fef9c3',
                                borderLeft: `4px solid ${alert.severity === 'Critical' ? '#ef4444' : '#eab308'}`,
                                borderRadius: '6px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong style={{ color: alert.severity === 'Critical' ? '#991b1b' : '#854d0e' }}>{alert.severity.toUpperCase()} ALERT</strong>
                                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div>{alert.message}</div>
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Acknowledge</button>
                                    <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Prepare ER</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resource Management */}
                <div>
                    <h3>Resource Management</h3>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Update Bed Availability</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="number" defaultValue={selectedHospital.bed_availability} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }} />
                                <button style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Update Staff Capacity</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="number" defaultValue={selectedHospital.staff_capacity} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100px' }} />
                                <button style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
