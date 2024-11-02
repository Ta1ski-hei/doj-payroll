import React from 'react';

function Employees() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Správa zaměstnanců</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Přidat zaměstnance
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left">Jméno</th>
              <th className="px-6 py-3 text-left">Discord ID</th>
              <th className="px-6 py-3 text-left">Pozice</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Akce</th>
            </tr>
          </thead>
          <tbody>
            {/* Zde budou zaměstnanci */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;