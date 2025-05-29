import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TrafficCard = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckTraffic = async () => {
    try {
      setIsLoading(true);
      setError('');
      setShowVideo(false); // Reset video state
      
      // First get video info
      const response = await fetch('http://localhost:8000/api/fetch_video.php?type=rain&info=1');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('PHP Response:', data); // Debug log
      
      if (data.success) {
        // Use the video URL directly from PHP
        setVideoUrl(`http://localhost:8000${data.videoUrl}`);
        setShowVideo(true);
      } else {
        setError(data.error || 'Failed to load traffic video');
        console.error('Failed to fetch video:', data.error);
      }
    } catch (error) {
      setError('Could not connect to traffic server');
      console.error('Error fetching video:', error);
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Loading...' : 'Check Traffic'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <AnimatePresence>
          {showVideo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                className="w-[200px] h-[120px] rounded-md"
                onError={(e) => {
                  console.error('Video error:', e);
                  setError('Failed to load video');
                  setShowVideo(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TrafficCard; 