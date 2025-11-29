import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function HospitalCard({ hospital, alerts, onUpdate }) {
    const [bedUpdate, setBedUpdate] = useState(hospital.bed_availability);
    const [staffUpdate, setStaffUpdate] = useState(hospital.staff_capacity);

    const handleUpdate = (type) => {
        const payload = type === 'beds'
            ? { bed_availability: parseInt(bedUpdate) }
            : { staff_capacity: parseInt(staffUpdate) };

        axios.post(`${API_URL}/api/hospital/${hospital.hospital_id}/update`, payload)
            .then(() => {
                alert(`${type === 'beds' ? 'Beds' : 'Staff'} updated for ${hospital.hospital_name}!`);
                if (onUpdate) onUpdate();
            })
            .catch(err => alert(`Error updating ${type}: ${err.message}`));
    };

    const hospitalAlerts = alerts.filter(a => a.hospital_id === hospital.hospital_id);

    return (
        <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{hospital.hospital_name}</h3>
                <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: hospital.status === 'Red' ? '#fee2e2' : hospital.status === 'Yellow' ? '#fef9c3' : '#dcfce7',
                    color: hospital.status === 'Red' ? '#991b1b' : hospital.status === 'Yellow' ? '#854d0e' : '#166534'
                }}>
                    {hospital.status}
                </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '4px' }}>
                    <div style={{ color: '#64748b' }}>Beds</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{hospital.bed_availability}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '4px' }}>
                    <div style={{ color: '#64748b' }}>Staff</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{hospital.staff_capacity}</div>
                </div>
            </div>

            {/* Alerts Preview */}
            <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', color: '#64748b' }}>Recent Alerts</h4>
                {hospitalAlerts.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No active alerts</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {hospitalAlerts.slice(0, 2).map(alert => (
                            <div key={alert.id} style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                background: alert.severity === 'Critical' ? '#fee2e2' : '#fef9c3',
                                borderRadius: '4px',
                                borderLeft: `3px solid ${alert.severity === 'Critical' ? '#ef4444' : '#eab308'}`
                            }}>
                                {alert.message}
                            </div>
                        ))}
                        {hospitalAlerts.length > 2 && <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>+ {hospitalAlerts.length - 2} more</div>}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="number"
                        value={bedUpdate}
                        onChange={(e) => setBedUpdate(e.target.value)}
                        placeholder="Beds"
                        style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <button
                        onClick={() => handleUpdate('beds')}
                        style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        Set Beds
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="number"
                        value={staffUpdate}
                        onChange={(e) => setStaffUpdate(e.target.value)}
                        placeholder="Staff"
                        style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <button
                        onClick={() => handleUpdate('staff')}
                        style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        Set Staff
                    </button>
                </div>
            </div>
        </div>
    );
}
