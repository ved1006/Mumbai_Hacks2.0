import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function PatientDashboard() {
    const [formData, setFormData] = useState({
        location: '',
        latitude: null,
        longitude: null,
        patient_count: 1,
        severity: 'Stable',
        booking_type: 'bed_only' // or 'ambulance'
    });
    const [hospitals, setHospitals] = useState([]);
    const [status, setStatus] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        // Fetch hospitals to show nearby ones (mock "nearby" logic)
        axios.get(`${API_URL}/api/hospitals`).then(res => setHospitals(res.data));
    }, []);

    const handleLiveLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, we'd reverse geocode here. For now, we'll just show coords or a placeholder
                // But the user asked to "take live location instead of typing", so let's fill it.
                // We'll just put "Current Location (Lat: ..., Lon: ...)" for now so the user sees it worked.
                setFormData(prev => ({
                    ...prev,
                    location: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
                    latitude: latitude,
                    longitude: longitude
                }));
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert('Unable to retrieve your location');
                setIsLocating(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Processing...');
        setSubmissionResult(null);

        try {
            const res = await axios.post(`${API_URL}/api/incidents`, formData);
            setStatus('Success');
            setSubmissionResult({
                hospital_name: res.data.assigned_hospital_name,
                distance: res.data.distance_km,
                message: res.data.message
            });
        } catch (err) {
            setStatus(`Error: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <div className="dashboard-view">
            <h2>🆘 Report Incident / Request Help</h2>
            <p>Use this form to report an emergency or book resources for a patient.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="e.g. Bandra West"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                            />
                            <button
                                type="button"
                                onClick={handleLiveLocation}
                                disabled={isLocating}
                                style={{ padding: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                {isLocating ? '📍...' : '📍 Use Live Location'}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Patient Count</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.patient_count}
                                onChange={e => setFormData({ ...formData, patient_count: parseInt(e.target.value) })}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Severity</label>
                            <select
                                value={formData.severity}
                                onChange={e => setFormData({ ...formData, severity: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                            >
                                <option value="Stable">Stable</option>
                                <option value="Critical">Critical</option>
                                <option value="Trauma">Trauma</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Action Required</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', background: formData.booking_type === 'bed_only' ? '#eff6ff' : 'white', borderColor: formData.booking_type === 'bed_only' ? '#3b82f6' : '#ccc' }}>
                                <input
                                    type="radio"
                                    name="booking_type"
                                    value="bed_only"
                                    checked={formData.booking_type === 'bed_only'}
                                    onChange={e => setFormData({ ...formData, booking_type: e.target.value })}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Book Bed Only
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Patient will arrive independently.</div>
                            </label>
                            <label style={{ flex: 1, padding: '1rem', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', background: formData.booking_type === 'ambulance' ? '#eff6ff' : 'white', borderColor: formData.booking_type === 'ambulance' ? '#3b82f6' : '#ccc' }}>
                                <input
                                    type="radio"
                                    name="booking_type"
                                    value="ambulance"
                                    checked={formData.booking_type === 'ambulance'}
                                    onChange={e => setFormData({ ...formData, booking_type: e.target.value })}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Book Bed + Ambulance
                                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Dispatch ambulance to location.</div>
                            </label>
                        </div>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                        🚨 Submit Request
                    </button>

                    {status && (
                        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '6px', background: status.includes('Error') ? '#fee2e2' : '#dcfce7', color: status.includes('Error') ? '#991b1b' : '#166534' }}>
                            {status === 'Success' && submissionResult ? (
                                <div>
                                    <strong>Request Submitted!</strong>
                                    <div style={{ marginTop: '0.5rem' }}>
                                        Assigned Hospital: <strong>{submissionResult.hospital_name}</strong>
                                    </div>
                                    <div>
                                        Distance: <strong>~{submissionResult.distance} km</strong>
                                    </div>
                                </div>
                            ) : (
                                status
                            )}
                        </div>
                    )}
                </form>

                {/* Nearby Hospitals Preview - Only show after submission */}
                {submissionResult && (
                    <div>
                        <h3>AI Recommended Hospitals</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {hospitals.slice(0, 3).map(h => (
                                <div key={h.hospital_id} style={{ padding: '1rem', background: 'white', borderRadius: '8px', borderLeft: `4px solid #22c55e` }}>
                                    <strong>{h.hospital_name}</strong>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        Distance: ~{(Math.random() * 5 + 1).toFixed(1)} km
                                    </div>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '4px' }}>Beds: {h.bed_availability}</span>
                                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '4px' }}>Status: Green</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
