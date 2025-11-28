import { useState, useEffect } from 'react';
import axios from 'axios';
import MapDisplay from '../MapDisplay/MapDisplay';

const API_URL = import.meta.env.VITE_API_URL;

export default function DispatcherDashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [incident, setIncident] = useState({
        name: "Waiting for Incident...",
        lat: null,
        lon: null,
        assigned_hospital_id: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Hospitals
                const resHospitals = await axios.get(`${API_URL}/api/hospitals`);
                const mapData = resHospitals.data.map(h => ({
                    hospital_id: h.hospital_id, // Ensure ID is passed
                    hospital_name: h.hospital_name,
                    lat: h.latitude,
                    lon: h.longitude,
                    assigned_critical: h.er_admissions,
                    assigned_stable: h.bed_availability
                }));
                setHospitals(mapData);

                // Fetch Latest Incident
                const resIncident = await axios.get(`${API_URL}/api/incidents/latest`);
                if (resIncident.data) {
                    setIncident({
                        name: `Incident #${resIncident.data.id}`,
                        lat: resIncident.data.latitude,
                        lon: resIncident.data.longitude,
                        assigned_hospital_id: resIncident.data.assigned_hospital_id
                    });
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard-view" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>🚑 Live Dispatch Map</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                        <span>Optimal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eab308' }}></span>
                        <span>Busy</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                        <span>Overloaded</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <MapDisplay
                    incident={incident}
                    assignments={hospitals}
                    assignedHospitalId={incident.assigned_hospital_id}
                />
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>Active Routes</h3>
                <p>Tracking {hospitals.length} hospitals. Map updates in real-time.</p>
            </div>
        </div>
    );
}
