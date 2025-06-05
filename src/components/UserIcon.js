import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../lib/utils';

const UserIcon = ({ type = 'user', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16 sm:w-20 sm:h-20',
    large: 'w-20 h-20 sm:w-24 sm:h-24'
  };

  const typeClasses = {
    user: 'bg-blue-500 border-blue-100',
    userGroup: 'bg-green-500 border-green-100',
    role: 'bg-purple-500 border-purple-100'
  };

  return (
    <div className={cn('relative z-10', sizeClasses[size])}>
      <div className={cn(
        'w-full h-full rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl',
        typeClasses[type]
      )}>
        <User className="w-1/2 h-1/2" />
      </div>
    </div>
  );
};

export default UserIcon; 