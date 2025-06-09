import React, { useState } from 'react';
import UserIcon from './UserIcon';
import { Button } from './ui/button';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

const ExpandableTreeNode = ({ 
  data, 
  children,
  onExpand,
  isExpanded = false,
  hasChildren = false,
  level = 0,
  onEdit,
  onDelete
}) => {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);

  const handleToggle = () => {
    const newExpanded = !localExpanded;
    setLocalExpanded(newExpanded);
    if (onExpand) {
      onExpand(data, newExpanded);
    }
  };

  const getNodeColor = (type) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 border-blue-300 hover:bg-blue-200';
      case 'userGroup':
        return 'bg-green-100 border-green-300 hover:bg-green-200';
      case 'role':
        return 'bg-purple-100 border-purple-300 hover:bg-purple-200';
      default:
        return 'bg-gray-100 border-gray-300 hover:bg-gray-200';
    }
  };

  const getConnectorColor = (type) => {
    switch (type) {
      case 'user':
        return 'bg-blue-400';
      case 'userGroup':
        return 'bg-green-400';
      case 'role':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Node */}
      <div className={cn(
        "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 group",
        getNodeColor(data.type)
      )}>
        <div className="flex items-center gap-2">
          <UserIcon type={data.type} />
          <div className="text-sm font-semibold text-gray-800">
            {data.name}
          </div>
          
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <Button
              size="icon"
              onClick={handleToggle}
              className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-800 text-white"
              title={localExpanded ? "Collapse" : "Expand"}
            >
              {localExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </Button>
          )}
        </div>
      </div>

      {/* Connection Line and Children */}
      {localExpanded && children && (
        <div className="flex flex-col items-center mt-4">
          {/* Vertical connector */}
          <div className={cn("w-1 h-8 rounded", getConnectorColor(data.type))}></div>
          
          {/* Children container */}
          <div className="relative">
            {/* Horizontal connector for multiple children */}
            {React.Children.count(children) > 1 && (
              <div className={cn("absolute top-4 left-0 right-0 h-1 rounded -z-10", getConnectorColor(data.type))}></div>
            )}
            
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableTreeNode; 