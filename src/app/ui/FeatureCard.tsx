import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string | React.ReactNode;
  icon?: string; 
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="p-4 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl transition-all duration-300 hover:border-neutral-600 hover:shadow-2xl hover:scale-[1.02]">
    {icon && <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>}
    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white text-center">{title}</h3>
    <div className="text-neutral-400 text-sm sm:text-base">{description}</div>
  </div>
);

export default FeatureCard;