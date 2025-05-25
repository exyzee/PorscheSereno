import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TrafficCard = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleCheckTraffic = () => {
    // Simulate traffic check
    const duration = 12; // Hardcoded duration
    if (duration > 10) {
      setShowVideo(true);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Traffic Check</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
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
          />
        </div>
        <button
          onClick={handleCheckTraffic}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Check Traffic
        </button>

        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <video
                src="/api/fetch_video.php?type=rain"
                autoPlay
                loop
                muted
                className="w-[200px] h-[120px] rounded-md"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TrafficCard; 