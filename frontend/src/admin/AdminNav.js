import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();

  const getLinkClassName = (path) => {
    return location.pathname === path
      ? 'block py-2 px-6 bg-green-600' // Active link style
      : 'block py-2 px-6 hover:bg-green-600'; // Inactive link style
  };

  return (
    <div className="min-h-screen bg-green-800 text-white w-64 flex flex-col">
      <div className="text-2xl font-bold py-4 px-6 bg-green-700">
        EcoSmart
      </div>
      <nav className="mt-10 flex-grow">
        <ul className="flex flex-col">
          <li className="mb-4">
            <Link to="/AdminHome" className={getLinkClassName("/AdminHome")}>Home</Link>
          </li>
          <li className="mb-4">
            <Link to="/requestPage" className={getLinkClassName("/requestPage")}>Requests</Link>
          </li>
          <li className="mb-4">
            <Link to="/manageVehicles" className={getLinkClassName("/manageVehicles")}>Manage Vehicles</Link>
          </li>
          <li className="mb-4">
            <Link to="/manageCollectors" className={getLinkClassName("/manageCollectors")}>Manage Collectors</Link>
          </li>
          <li className="mb-4">
            <Link to="/dataAnalytics" className={getLinkClassName("/dataAnalytics")}>Data & Analytics</Link>
          </li>
          <li className="mb-4">
            <Link to="/logout" className={getLinkClassName("/logout")}>Log out</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminNav;
