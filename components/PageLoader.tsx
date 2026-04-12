import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-brand-600">
      <Loader2 size={48} className="animate-spin mb-4" />
      <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default PageLoader;