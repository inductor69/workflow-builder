import React, { useState, useMemo, useEffect, useRef } from 'react';
import ExpandableTreeNode from './ExpandableTreeNode';
import AddModal from './AddModal';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RoleUserHierarchy = ({ hierarchyData, setHierarchyData }) => {
  const [viewMode, setViewMode] = useState('User'); // 'User', 'User Group', 'Role'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    editItem: null
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Add a small delay to allow button clicks to complete
        setTimeout(() => {
          setDropdownOpen(false);
        }, 100);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get all entities for current view mode
  const allEntities = useMemo(() => {
    switch (viewMode) {
      case 'User':
        return hierarchyData.users;
      case 'User Group':
        return hierarchyData.userGroups;
      case 'Role':
        return hierarchyData.roles;
      default:
        return [];
    }
  }, [viewMode, hierarchyData]);

  // Filter entities based on search query
  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return allEntities;
    
    return allEntities.filter(entity => 
      entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEntities, searchQuery]);

  // Get entity by ID
  const getEntityById = (id, type) => {
    switch (type) {
      case 'user':
        return hierarchyData.users.find(u => u.id === id);
      case 'userGroup':
        return hierarchyData.userGroups.find(ug => ug.id === id);
      case 'role':
        return hierarchyData.roles.find(r => r.id === id);
      default:
        return null;
    }
  };

  // Handle entity selection from dropdown
  const handleEntitySelect = (entity) => {
    console.log('Entity selected:', entity);
    setSelectedEntity(entity);
    setExpandedNodes(new Set()); // Reset expanded nodes
    setDropdownOpen(false); // Close dropdown after selection
    setSearchQuery(entity.name); // Set search query to selected entity name
  };

  // Handle node expansion
  const handleNodeExpand = (nodeData, isExpanded) => {
    const newExpanded = new Set(expandedNodes);
    if (isExpanded) {
      newExpanded.add(nodeData.id);
    } else {
      newExpanded.delete(nodeData.id);
    }
    setExpandedNodes(newExpanded);
  };

  // Render tree based on view mode and selected entity
  const renderHierarchyTree = () => {
    if (!selectedEntity) {
      return (
        <div className="text-center py-12 text-gray-500">
          Select an entity to view its hierarchy
        </div>
      );
    }

    switch (viewMode) {
      case 'User':
        return renderUserHierarchy(selectedEntity);
      case 'User Group':
        return renderUserGroupHierarchy(selectedEntity);
      case 'Role':
        return renderRoleHierarchy(selectedEntity);
      default:
        return null;
    }
  };

  // Render User → User Groups → Roles hierarchy
  const renderUserHierarchy = (user) => {
    const userUserGroups = user.userGroups?.map(ugId => getEntityById(ugId, 'userGroup')).filter(Boolean) || [];
    
    return (
      <ExpandableTreeNode
        data={user}
        hasChildren={userUserGroups.length > 0}
        isExpanded={expandedNodes.has(user.id)}
        onExpand={handleNodeExpand}
      >
        {userUserGroups.map(userGroup => (
          <ExpandableTreeNode
            key={userGroup.id}
            data={userGroup}
            hasChildren={userGroup.roles && userGroup.roles.length > 0}
            isExpanded={expandedNodes.has(userGroup.id)}
            onExpand={handleNodeExpand}
          >
            {userGroup.roles?.map(roleId => {
              const role = getEntityById(roleId, 'role');
              return role ? (
                <ExpandableTreeNode
                  key={role.id}
                  data={role}
                  hasChildren={false}
                  isExpanded={false}
                />
              ) : null;
            })}
          </ExpandableTreeNode>
        ))}
      </ExpandableTreeNode>
    );
  };

  // Render User Group → Users & Roles hierarchy
  const renderUserGroupHierarchy = (userGroup) => {
    const groupUsers = userGroup.users?.map(userId => getEntityById(userId, 'user')).filter(Boolean) || [];
    const groupRoles = userGroup.roles?.map(roleId => getEntityById(roleId, 'role')).filter(Boolean) || [];
    
    return (
      <ExpandableTreeNode
        data={userGroup}
        hasChildren={groupUsers.length > 0 || groupRoles.length > 0}
        isExpanded={expandedNodes.has(userGroup.id)}
        onExpand={handleNodeExpand}
      >
        {/* Users in this group */}
        {groupUsers.map(user => (
          <ExpandableTreeNode
            key={`user-${user.id}`}
            data={user}
            hasChildren={false}
            isExpanded={false}
          />
        ))}
        
        {/* Roles in this group */}
        {groupRoles.map(role => (
          <ExpandableTreeNode
            key={`role-${role.id}`}
            data={role}
            hasChildren={false}
            isExpanded={false}
          />
        ))}
      </ExpandableTreeNode>
    );
  };

  // Render Role → User Groups → Users hierarchy
  const renderRoleHierarchy = (role) => {
    const roleUserGroups = role.userGroups?.map(ugId => getEntityById(ugId, 'userGroup')).filter(Boolean) || [];
    
    return (
      <ExpandableTreeNode
        data={role}
        hasChildren={roleUserGroups.length > 0}
        isExpanded={expandedNodes.has(role.id)}
        onExpand={handleNodeExpand}
      >
        {/* User groups that have this role */}
        {roleUserGroups.map(userGroup => {
          // Get users in this user group
          const usersInGroup = userGroup.users?.map(userId => getEntityById(userId, 'user')).filter(Boolean) || [];
          
          return (
            <ExpandableTreeNode
              key={`userGroup-${userGroup.id}`}
              data={userGroup}
              hasChildren={usersInGroup.length > 0}
              isExpanded={expandedNodes.has(userGroup.id)}
              onExpand={handleNodeExpand}
            >
              {/* Users within this user group */}
              {usersInGroup.map(user => (
                <ExpandableTreeNode
                  key={`user-${user.id}`}
                  data={user}
                  hasChildren={false}
                  isExpanded={false}
                />
              ))}
            </ExpandableTreeNode>
          );
        })}
      </ExpandableTreeNode>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Selection and Search */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ***View By {viewMode}****
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* View Mode Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">View By</label>
            <div className="relative">
              <select
                value={viewMode}
                                 onChange={(e) => {
                   setViewMode(e.target.value);
                   setSelectedEntity(null);
                   setSearchQuery('');
                   setDropdownOpen(false);
                 }}
                className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="User">User</option>
                <option value="User Group">User Group</option>
                <option value="Role">Role</option>
              </select>
            </div>
          </div>

                     {/* Search/Entity Selection */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">
               {viewMode === 'User' && 'Enter Username:'}
               {viewMode === 'User Group' && 'Enter User Group Name:'}
               {viewMode === 'Role' && 'Enter Role Name:'}
             </label>
             <div className="relative" ref={dropdownRef}>
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => {
                   setSearchQuery(e.target.value);
                   setDropdownOpen(true); // Open dropdown when typing
                 }}
                 onFocus={() => setDropdownOpen(true)}
                 placeholder={`Search ${viewMode.toLowerCase()}...`}
                 className="w-full p-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               />
               <button
                 type="button"
                 onClick={() => setDropdownOpen(!dropdownOpen)}
                 className="absolute right-2 top-1 bottom-1 px-2 flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-r border-l border-gray-300"
               >
                 {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
               </button>
               
               {/* Entity Selection Dropdown - Positioned relative to input */}
               {dropdownOpen && allEntities.length > 0 && (
                 <div className="absolute top-full left-0 right-0 z-50 mt-1">
                   <label className="text-sm font-medium text-gray-700 mb-2 block bg-white px-1">
                     Select {viewMode}:
                   </label>
                   <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-lg">
                     {filteredEntities.length > 0 ? (
                       filteredEntities.map(entity => (
                         <button
                           key={entity.id}
                           onClick={() => {
                             console.log('Button clicked for:', entity.name);
                             handleEntitySelect(entity);
                           }}
                           className={`w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer ${
                             selectedEntity?.id === entity.id ? 'bg-blue-100 border-l-4 border-blue-500 font-medium' : ''
                           }`}
                         >
                           <div className="font-medium text-gray-900">{entity.name}</div>
                           <div className="text-sm text-gray-500 capitalize">{entity.type.replace('userGroup', 'user group')}</div>
                         </button>
                       ))
                     ) : (
                       <div className="p-3 text-gray-500 text-sm text-center">
                         No {viewMode.toLowerCase()}s found{searchQuery.trim() && ` matching "${searchQuery}"`}
                       </div>
                     )}
                   </div>
                 </div>
               )}
             </div>
           </div>
                 </div>

         

        {/* Go Button */}
        {selectedEntity && (
          <div className="mt-4">
            <Button 
              onClick={() => setExpandedNodes(new Set())}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go
            </Button>
          </div>
        )}
      </Card>

      {/* Hierarchy Visualization */}
      <Card className="p-8 bg-white min-h-96">
        <div className="flex justify-center">
          {renderHierarchyTree()}
        </div>
      </Card>

      {/* Instruction Text */}
      {selectedEntity && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            Once clicked on '+' sign, it will open further hierarchy as below to show 
            that this {viewMode.toLowerCase()} is connected to which {
              viewMode === 'User' ? 'User Groups and their Roles' :
              viewMode === 'User Group' ? 'Users and Roles' :
              'User Groups and their Users'
            }
          </p>
        </Card>
      )}

      {/* Modal for adding/editing */}
      <AddModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        editItem={modalState.editItem}
        onSave={() => {}} // TODO: Implement save functionality
        onCancel={() => setModalState({ isOpen: false, type: '', editItem: null })}
      />
    </div>
  );
};

export default RoleUserHierarchy; 