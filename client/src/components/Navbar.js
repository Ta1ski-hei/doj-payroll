import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">DOJ Payroll</Link>
        <div className="space-x-4">
          <Link to="/employees">Zaměstnanci</Link>
          <Link to="/payroll">Výplaty</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;