import React from 'react';
import PropTypes from 'prop-types';
import { Package } from 'lucide-react';

function StatsCard({ title, value, icon: Icon }) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <div className="rounded-md bg-blue-50 p-3">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }
  
  export function DashboardStats({ stats }) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Products" value={stats.totalProducts} icon={Package} />
      </div>
    );
  }
  
  StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
  };