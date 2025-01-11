import React, { useEffect, useState } from 'react';
import { getPatients } from '../services/patientService';

function ManagerDashboard() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients().then(setPatients).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Manager Dashboard</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id}>
            {patient.name} - Room {patient.roomNumber}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManagerDashboard;
