import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaRecycle, FaSearch, FaClipboardList, FaDollarSign, FaChartBar } from 'react-icons/fa';
import WasteHeader from './WasteHeader';

const CollectedWasteDashboard = () => {

  const cardData = [
    {
      title: 'Record Waste Lot',
      description: 'Record details of collected waste lots.',
      link: '/collectedWaste',
      icon: <FaClipboardList className="text-green-500 text-3xl mb-4" />,
    },
    {
      title: 'Request Recycling',
      description: 'Request recycling for collected waste.',
      link: '/RecycleForm',
      icon: <FaRecycle className="text-blue-500 text-3xl mb-4" />,
    },
    {
      title: 'Search Details',
      description: 'Notify management about waste collection.',
      link: '/GarbageStationSummary',
      icon: <FaSearch className="text-orange-500 text-3xl mb-4" />,
    },
    {
      title: 'Collected Waste Details',
      description: 'View details of collected waste.',
      link: '/viewCollectedWaste',
      icon: <FaTrashAlt className="text-red-500 text-3xl mb-4" />,
    },
    {
      title: 'Paid Recycled Details',
      description: 'View paid recycling details.',
      link: '/viewRecycledDetails',
      icon: <FaDollarSign className="text-yellow-500 text-3xl mb-4" />,
    },
    {
      title: 'Reports',
      description: 'Generate waste collection and recycling reports.',
      link: '/GarbageStationSummary',
      icon: <FaChartBar className="text-purple-500 text-3xl mb-4" />,
    },
  ];

  return (
    <div>
      <WasteHeader h1="Waste Management Dashboard" />

      <div className="min-h-screen flex flex-col items-center mb-10 bg-gray-100">
        {/* Body */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-8 lg:px-12 w-full">
          {cardData.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                {card.icon}
                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>


        {/* Footer */}
        <footer className="mt-auto py-6 text-center">
          <p className="text-gray-600">&copy; 2024 Waste Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default CollectedWasteDashboard;
