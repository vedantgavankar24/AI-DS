import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/manager">Manager Dashboard</Link>
        </li>
        <li>
          <Link to="/pantry">Pantry Dashboard</Link>
        </li>
        <li>
          <Link to="/delivery">Delivery Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
