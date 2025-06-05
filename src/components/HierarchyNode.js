import React from 'react';
import UserIcon from './UserIcon';
import { Button } from './ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const HierarchyNode = ({ 
  data, 
  showAddButton = false, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  return (
    <div className="relative z-20 flex flex-col items-center">
      <div className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 group">
        <div className="relative">
          <UserIcon type={data.type} />
          
          {showAddButton && onAdd && (
            <Button
              size="icon"
              onClick={onAdd}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 border-2 border-white shadow-lg"
              title="Add new item"
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-800 max-w-24 sm:max-w-32 truncate">
            {data.name}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onEdit(data)}
              className="w-6 h-6 bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
              title="Edit"
            >
              <Edit className="w-3 h-3" />
            </Button>
            {data.type !== 'user' && (
              <Button
                size="icon"
                variant="outline"
                onClick={() => onDelete(data.id, data.type)}
                className="w-6 h-6 bg-red-400 hover:bg-red-500 border-red-400"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyNode; 