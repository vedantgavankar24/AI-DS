import axios from 'axios';

export const getPatients = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:5000/api/patients', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
