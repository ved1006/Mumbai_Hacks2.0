import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function SystemAdminDashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [retraining, setRetraining] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [hRes, lRes] = await Promise.all([
                axios.get(`${API_URL}/api/hospitals`),
                axios.get(`${API_URL}/api/logs`)
            ]);
            setHospitals(hRes.data);
            setLogs(lRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetrain = async () => {
        setRetraining(true);
        try {
            await axios.post(`${API_URL}/api/admin/retrain`);
            alert("Model retraining started!");
        } catch (err) {
            alert("Error retraining model: " + err.message);
        } finally {
            setRetraining(false);
        }
    };

    const handleDeleteHospital = async (id) => {
        if (!confirm("Are you sure you want to delete this hospital?")) return;
        try {
            await axios.delete(`${API_URL}/api/admin/hospitals/${id}`);
            fetchData();
        } catch (err) {
            alert("Error deleting hospital: " + err.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>System Administration</h2>
                <button
                    onClick={handleRetrain}
                    disabled={retraining}
                    style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    {retraining ? 'Retraining...' : '🔄 Retrain AI Model'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Hospital Management */}
                <div>
                    <h3>Hospital Network ({hospitals.length})</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {hospitals.map(h => (
                            <div key={h.hospital_id} style={{
                                padding: '1rem', background: 'white', borderRadius: '8px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderLeft: `4px solid ${h.status === 'Red' ? '#ef4444' : h.status === 'Yellow' ? '#eab308' : '#22c55e'}`
                            }}>
                                <div>
                                    <strong>{h.hospital_name}</strong>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        ID: {h.hospital_id} | Beds: {h.bed_availability}/{h.total_beds} | Staff: {h.staff_capacity}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteHospital(h.hospital_id)}
                                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Logs */}
                <div>
                    <h3>System Logs</h3>
                    <div style={{ background: '#1e293b', color: '#94a3b8', padding: '1rem', borderRadius: '8px', height: '400px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {logs.map((log, i) => (
                            <div key={i} style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: '#64748b' }}>[{log.timestamp.split('T')[1].split('.')[0]}]</span>{' '}
                                <span style={{ color: log.level === 'ERROR' ? '#ef4444' : '#22c55e' }}>{log.level}</span>:{' '}
                                {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
