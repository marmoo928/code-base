import React from 'react';

// Define the component props using a TypeScript interface for clarity
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div 
    className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl transition-colors duration-300
               hover:border-green-500 hover:shadow-green-900/50" // Added a subtle hover shadow
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-neutral-400 text-base">{description}</p>
  </div>
);

export default FeatureCard;