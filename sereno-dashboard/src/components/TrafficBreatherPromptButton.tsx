import React from 'react';
import { motion } from 'framer-motion';

interface TrafficBreatherPromptButtonProps {
  onClick: () => void;
}

const TrafficBreatherPromptButton: React.FC<TrafficBreatherPromptButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
    >
      Take a Breather
    </motion.button>
  );
};

export default TrafficBreatherPromptButton; 