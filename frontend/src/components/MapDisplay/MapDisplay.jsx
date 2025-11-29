import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import hospitalIconImg from "../../assets/hospital-icon.png";
import { useGeocoding, useHospitalGeocoding } from "../../hooks/useGeocoding";
import { useRouting } from "../../hooks/useRouting";

// 🏥 Custom hospital icon
// 🏥 Custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  iconSize: [28, 28], // Smaller size
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// 🚨 Incident icon
const incidentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35], // Smaller size
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -35],
});

// ✅ Assigned Hospital Icon (Green/Highlighted)
const assignedHospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png",
  iconSize: [35, 35], // Smaller size
  iconAnchor: [17.5, 35],
  popupAnchor: [0, -35],
  className: 'assigned-hospital-marker'
});

// 🔄 Automatically fit map bounds
function AutoFitMap({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) map.fitBounds(points, { padding: [80, 80] });
  }, [points, map]);
  return null;
}

export default function MapDisplay({ incident = {}, assignments = [], assignedHospitalId = null }) {
  // 🧭 Step 1: Geocode incident if coordinates missing
  const incidentCoords = useGeocoding(incident);

  // 🏥 Step 2: Process hospital assignments
  const processed = useHospitalGeocoding(assignments);

  // 🚗 Step 3: Fetch precise routes
  // Only route to the assigned hospital if one is assigned
  const targetHospitals = assignedHospitalId
    ? processed.filter(h => h.hospital_id === assignedHospitalId)
    : processed;

  const routes = useRouting(incidentCoords, targetHospitals);

  // 📍 Step 4: Combine all map points
  const allPoints = [
    ...(incidentCoords.lat && incidentCoords.lon ? [[incidentCoords.lat, incidentCoords.lon]] : []),
    ...processed.map((h) => [h.lat, h.lon]),
  ];

  if (!incidentCoords.lat || !incidentCoords.lon) {
    return <div style={{ textAlign: "center", padding: "1rem" }}>🧭 Locating incident...</div>;
  }

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 0 12px rgba(0,0,0,0.15)",
        marginTop: "1rem",
      }}
    >
      <MapContainer
        center={[incidentCoords.lat, incidentCoords.lon]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🚨 Incident Marker */}
        <Marker
          position={[incidentCoords.lat, incidentCoords.lon]}
          icon={incidentIcon}
          ref={(ref) => {
            if (ref) ref.openPopup();
          }}
        >
          <Popup>
            🚨 <b>Incident Location</b>
            <br />
            {incident.name || "Unknown Location"}
          </Popup>
        </Marker>

        {/* 🏥 Hospital Markers */}
        {processed.map((h, i) => {
          const isAssigned = h.hospital_id === assignedHospitalId;
          return (
            <Marker
              key={i}
              position={[h.lat, h.lon]}
              icon={isAssigned ? assignedHospitalIcon : hospitalIcon}
              zIndexOffset={isAssigned ? 1000 : 0} // Bring assigned to front
              ref={(ref) => {
                if (ref && isAssigned) ref.openPopup();
              }}
            >
              <Popup>
                {isAssigned ? "✅ ASSIGNED: " : "🏥 "}
                <b>{h.hospital_name}</b>
                <br />
                Critical: {h.assigned_critical || 0} | Stable: {h.assigned_stable || 0}
              </Popup>
            </Marker>
          );
        })}

        {/* 🚗 Routes */}
        {routes.map((r, i) => (
          <Polyline
            key={i}
            positions={r.coords}
            color="#e11d48"
            weight={4}
            opacity={0.9}
            dashArray="6,10"
          />
        ))}

        <AutoFitMap points={allPoints} />
      </MapContainer>
    </div>
  );
}
