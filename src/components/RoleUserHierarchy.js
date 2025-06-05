import React, { useState } from 'react';
import HierarchyNode from './HierarchyNode';
import AddModal from './AddModal';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Plus } from 'lucide-react';

const RoleUserHierarchy = ({ hierarchyData, setHierarchyData }) => {

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    editItem: null
  });

  const handleAdd = (type) => {
    setModalState({
      isOpen: true,
      type: type,
      editItem: null
    });
  };

  const handleEdit = (item) => {
    setModalState({
      isOpen: true,
      type: item.type,
      editItem: item
    });
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      setHierarchyData(prev => {
        const newData = { ...prev };
        if (type === 'userGroup') {
          newData.userGroups = newData.userGroups.filter(item => item.id !== id);
        } else if (type === 'role') {
          newData.roles = newData.roles.filter(item => item.id !== id);
        }
        return newData;
      });
    }
  };

  const handleSave = (formData) => {
    const { type, name, editItem } = formData;
    
    if (editItem) {
      // Edit existing item
      setHierarchyData(prev => {
        const newData = { ...prev };
        if (type === 'user') {
          newData.user = { ...newData.user, name };
        } else if (type === 'userGroup') {
          newData.userGroups = newData.userGroups.map(item => 
            item.id === editItem.id ? { ...item, name } : item
          );
        } else if (type === 'role') {
          newData.roles = newData.roles.map(item => 
            item.id === editItem.id ? { ...item, name } : item
          );
        }
        return newData;
      });
    } else {
      // Add new item
      const newId = `${type}-${Date.now()}`;
      const newItem = { id: newId, name, type };
      
      setHierarchyData(prev => {
        const newData = { ...prev };
        if (type === 'userGroup') {
          newData.userGroups = [...newData.userGroups, newItem];
        } else if (type === 'role') {
          newData.roles = [...newData.roles, newItem];
        }
        return newData;
      });
    }
    
    setModalState({ isOpen: false, type: '', editItem: null });
  };

  const handleCancel = () => {
    setModalState({ isOpen: false, type: '', editItem: null });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* Left sidebar with options */}
      <Card className="lg:w-64 p-4 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">View Options</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-800">
            View By User
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-800">
            View By Role
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-800">
            View By User Group
          </Button>
        </div>
      </Card>

      {/* Main hierarchy display */}
      <Card className="flex-1 p-6 lg:p-8 overflow-x-auto bg-white">
        <div className="flex flex-col items-center space-y-4 min-w-[600px]">
          {/* Top level - User */}
          <div className="flex flex-col items-center space-y-3">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">User</h2>
            <HierarchyNode 
              data={hierarchyData.user}
              onEdit={handleEdit}
              onAdd={() => handleAdd('userGroup')}
              showAddButton={true}
            />
          </div>

          {/* Connection line */}
          <div className="w-1 h-10 bg-gray-400 rounded"></div>

          {/* Second level - User Groups */}
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">User Groups</h2>
              <Button 
                size="sm"
                onClick={() => handleAdd('userGroup')}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Group
              </Button>
            </div>
            
            <div className="relative">
              {/* Horizontal connection line */}
              {hierarchyData.userGroups.length > 1 && (
                <div className="absolute top-10 left-0 right-0 h-1 bg-gray-400 rounded -z-10"></div>
              )}
              
              <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
                {hierarchyData.userGroups.map((userGroup, index) => (
                  <HierarchyNode 
                    key={userGroup.id}
                    data={userGroup}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => handleAdd('role')}
                    showAddButton={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Connection line */}
          <div className="w-1 h-10 bg-gray-400 rounded"></div>

          {/* Third level - Roles */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Roles</h2>
              <Button 
                size="sm"
                onClick={() => handleAdd('role')}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Role
              </Button>
            </div>
            
            <div className="relative">
              {/* Horizontal connection line */}
              {hierarchyData.roles.length > 1 && (
                <div className="absolute top-10 left-0 right-0 h-1 bg-gray-400 rounded -z-10"></div>
              )}
              
              <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
                {hierarchyData.roles.map((role) => (
                  <HierarchyNode 
                    key={role.id}
                    data={role}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showAddButton={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal for adding/editing */}
      <AddModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        editItem={modalState.editItem}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default RoleUserHierarchy; 