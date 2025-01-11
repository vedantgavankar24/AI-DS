import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { token, role } = await login({ email, password });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (role === 'Manager') navigate('/manager');
    else if (role === 'Pantry') navigate('/pantry');
    else if (role === 'Delivery') navigate('/delivery');
  } catch (error) {
    setError('Login failed: ' + error.response?.data?.message || error.message);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <h1>Login</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit">Login</button>
  </form>
);
}

export default Login;
