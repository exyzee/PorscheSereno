import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LocationInputCardProps {
  onSubmit: (from: string, to: string) => void;
}

const LocationInputCard: React.FC<LocationInputCardProps> = ({ onSubmit }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(fromLocation, toLocation);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            From
          </label>
          <input
            type="text"
            id="from"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter starting location"
            required
          />
        </div>
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            To
          </label>
          <input
            type="text"
            id="to"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter destination"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Get Route
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LocationInputCard; 