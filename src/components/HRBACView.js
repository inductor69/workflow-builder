import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Crown, 
  Users, 
  Shield, 
  UserCheck,
  ArrowDown,
  Info
} from 'lucide-react';

const HRBACView = ({ hierarchyData }) => {
  const [viewMode, setViewMode] = useState('User'); // 'User', 'User Group', 'Role'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
    setSelectedEntity(entity);
    setExpandedNodes(new Set());
    setDropdownOpen(false);
    setSearchQuery(entity.name);
  };

  // Handle node expansion
  const handleNodeExpand = (nodeId, nodeType) => {
    const newExpanded = new Set(expandedNodes);
    const nodeKey = `${nodeType}-${nodeId}`;
    
    if (newExpanded.has(nodeKey)) {
      newExpanded.delete(nodeKey);
    } else {
      newExpanded.add(nodeKey);
    }
    setExpandedNodes(newExpanded);
  };

  // Render circular node with + button
  const renderCircularNode = (entity, nodeType, hasChildren = false, level = 0) => {
    const nodeKey = `${nodeType}-${entity.id}`;
    const isExpanded = expandedNodes.has(nodeKey);
    
    // Determine colors based on entity type
    const getNodeColors = (type) => {
      switch (type) {
        case 'user':
          return 'bg-blue-600 border-blue-700 text-white';
        case 'userGroup':
          return 'bg-green-600 border-green-700 text-white';
        case 'role':
          return 'bg-purple-600 border-purple-700 text-white';
        default:
          return 'bg-gray-600 border-gray-700 text-white';
      }
    };

    return (
      <div className="flex flex-col items-center">
        {/* Circular Node */}
        <div className="relative">
          <div className={`
            w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center
            cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg
            ${getNodeColors(nodeType)}
          `}>
            <div className="text-xs font-semibold mb-1 uppercase">
              {nodeType === 'userGroup' ? 'User Group' : nodeType}
            </div>
            <div className="text-sm font-bold text-center px-2 leading-tight">
              {entity.name}
            </div>
          </div>
          
          {/* Plus Button */}
          {hasChildren && (
            <button
              onClick={() => handleNodeExpand(entity.id, nodeType)}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 
                       w-8 h-8 bg-white border-2 border-gray-400 rounded-full 
                       flex items-center justify-center hover:bg-gray-50 shadow-md
                       transition-all duration-200"
            >
              <Plus className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isExpanded ? 'rotate-45' : ''
              }`} />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render connection lines
  const renderConnectionLines = (childCount) => {
    if (childCount === 0) return null;

    return (
      <div className="flex justify-center my-4">
        <div className="flex flex-col items-center">
          {/* Vertical line down */}
          <div className="w-px h-8 bg-gray-400"></div>
          
          {childCount > 1 && (
            <>
              {/* Horizontal line */}
              <div className="h-px bg-gray-400" style={{ width: `${Math.max(200, childCount * 120)}px` }}></div>
              {/* Vertical lines to children */}
              <div className="flex justify-between" style={{ width: `${Math.max(200, childCount * 120)}px` }}>
                {Array.from({ length: childCount }).map((_, index) => (
                  <div key={index} className="w-px h-8 bg-gray-400"></div>
                ))}
              </div>
            </>
          )}
          
          {childCount === 1 && (
            <div className="w-px h-8 bg-gray-400"></div>
          )}
        </div>
      </div>
    );
  };

  // Render hierarchy based on view mode
  const renderHierarchy = () => {
    if (!selectedEntity) {
      return (
        <div className="text-center py-12 text-gray-500">
          <div className="text-lg font-semibold mb-2">Select a {viewMode.toLowerCase()}</div>
          <div className="text-sm">Choose from the dropdown above to explore the hierarchy</div>
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
    const isUserExpanded = expandedNodes.has(`user-${user.id}`);

    return (
      <div className="flex flex-col items-center space-y-6">
        {/* User Node */}
        {renderCircularNode(user, 'user', userUserGroups.length > 0)}
        
        {/* User Groups */}
        {isUserExpanded && userUserGroups.length > 0 && (
          <>
            {renderConnectionLines(userUserGroups.length)}
            <div className={`flex gap-8 ${userUserGroups.length > 1 ? 'justify-center' : ''}`}>
              {userUserGroups.map(userGroup => {
                const groupRoles = userGroup.roles?.map(roleId => getEntityById(roleId, 'role')).filter(Boolean) || [];
                const isGroupExpanded = expandedNodes.has(`userGroup-${userGroup.id}`);
                
                return (
                  <div key={userGroup.id} className="flex flex-col items-center space-y-6">
                    {/* User Group Node */}
                    {renderCircularNode(userGroup, 'userGroup', groupRoles.length > 0)}
                    
                    {/* Roles */}
                    {isGroupExpanded && groupRoles.length > 0 && (
                      <>
                        {renderConnectionLines(groupRoles.length)}
                        <div className={`flex gap-8 ${groupRoles.length > 1 ? 'justify-center' : ''}`}>
                          {groupRoles.map(role => (
                            <div key={role.id}>
                              {renderCircularNode(role, 'role', false)}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render User Group → Users & Roles hierarchy
  const renderUserGroupHierarchy = (userGroup) => {
    const groupUsers = userGroup.users?.map(userId => getEntityById(userId, 'user')).filter(Boolean) || [];
    const groupRoles = userGroup.roles?.map(roleId => getEntityById(roleId, 'role')).filter(Boolean) || [];
    const isGroupExpanded = expandedNodes.has(`userGroup-${userGroup.id}`);
    const totalChildren = groupUsers.length + groupRoles.length;

    return (
      <div className="flex flex-col items-center space-y-6">
        {/* User Group Node */}
        {renderCircularNode(userGroup, 'userGroup', totalChildren > 0)}
        
        {/* Users and Roles */}
        {isGroupExpanded && totalChildren > 0 && (
          <>
            {renderConnectionLines(totalChildren)}
            <div className={`flex gap-8 ${totalChildren > 1 ? 'justify-center' : ''}`}>
              {/* Users */}
              {groupUsers.map(user => (
                <div key={`user-${user.id}`}>
                  {renderCircularNode(user, 'user', false)}
                </div>
              ))}
              
              {/* Roles */}
              {groupRoles.map(role => (
                <div key={`role-${role.id}`}>
                  {renderCircularNode(role, 'role', false)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render Role → User Groups → Users hierarchy
  const renderRoleHierarchy = (role) => {
    const roleUserGroups = role.userGroups?.map(ugId => getEntityById(ugId, 'userGroup')).filter(Boolean) || [];
    const isRoleExpanded = expandedNodes.has(`role-${role.id}`);

    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Role Node */}
        {renderCircularNode(role, 'role', roleUserGroups.length > 0)}
        
        {/* User Groups */}
        {isRoleExpanded && roleUserGroups.length > 0 && (
          <>
            {renderConnectionLines(roleUserGroups.length)}
            <div className={`flex gap-8 ${roleUserGroups.length > 1 ? 'justify-center' : ''}`}>
              {roleUserGroups.map(userGroup => {
                const groupUsers = userGroup.users?.map(userId => getEntityById(userId, 'user')).filter(Boolean) || [];
                const isGroupExpanded = expandedNodes.has(`userGroup-${userGroup.id}`);
                
                return (
                  <div key={userGroup.id} className="flex flex-col items-center space-y-6">
                    {/* User Group Node */}
                    {renderCircularNode(userGroup, 'userGroup', groupUsers.length > 0)}
                    
                    {/* Users */}
                    {isGroupExpanded && groupUsers.length > 0 && (
                      <>
                        {renderConnectionLines(groupUsers.length)}
                        <div className={`flex gap-8 ${groupUsers.length > 1 ? 'justify-center' : ''}`}>
                          {groupUsers.map(user => (
                            <div key={user.id}>
                              {renderCircularNode(user, 'user', false)}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

     return (
     <div className="space-y-6">
       {/* Header */}
       <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
             <Crown className="w-6 h-6 text-indigo-600" />
             <h2 className="text-2xl font-bold text-gray-900">Hierarchical Role-Based Access Control</h2>
           </div>
           <Button
             onClick={() => setShowPermissions(!showPermissions)}
             variant="outline"
             size="sm"
             className="flex items-center gap-2"
           >
             <Info className="w-4 h-4" />
             {showPermissions ? 'Hide' : 'Show'} Details
           </Button>
         </div>
         <p className="text-gray-600">
           Explore the dynamic relationship between roles, user groups, and users. 
           Select an entity and click the "+" buttons to expand the hierarchy.
         </p>
       </Card>

       {/* Controls */}
       <Card className="p-6 bg-white">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">
           ***View By {viewMode}***
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* View Mode Selector */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">View By</label>
             <select
               value={viewMode}
               onChange={(e) => {
                 setViewMode(e.target.value);
                 setSelectedEntity(null);
                 setSearchQuery('');
                 setExpandedNodes(new Set());
                 setDropdownOpen(false);
               }}
               className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
             >
               <option value="User">User</option>
               <option value="User Group">User Group</option>
               <option value="Role">Role</option>
             </select>
           </div>

          {/* Entity Selection */}
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
                  setDropdownOpen(true);
                }}
                                 onFocus={() => setDropdownOpen(true)}
                 placeholder={`Search ${viewMode.toLowerCase()}...`}
                 className="w-full p-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="absolute right-2 top-1 bottom-1 px-2 flex items-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-r border-l border-gray-300"
              >
                {dropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {/* Entity Selection Dropdown */}
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
                          onClick={() => handleEntitySelect(entity)}
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
               className="bg-purple-600 hover:bg-purple-700"
             >
               Go
             </Button>
           </div>
        )}
      </Card>

             {/* Hierarchy Visualization */}
       <Card className="p-8 bg-white min-h-96">
         <div className="flex justify-center">
           {renderHierarchy()}
         </div>
       </Card>

       {/* Entity Details Panel */}
       {selectedEntity && showPermissions && (
         <Card className="p-6 bg-white border-2 border-indigo-200">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Entity Information */}
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 {viewMode} Details: {selectedEntity.name}
               </h3>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   {viewMode === 'User' && <UserCheck className="w-4 h-4 text-blue-600" />}
                   {viewMode === 'User Group' && <Users className="w-4 h-4 text-green-600" />}
                   {viewMode === 'Role' && <Shield className="w-4 h-4 text-purple-600" />}
                   <span className="text-sm font-medium">Type:</span>
                   <span className="text-sm">{viewMode}</span>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <ArrowDown className="w-4 h-4 text-gray-600" />
                   <span className="text-sm font-medium">Connected to:</span>
                   <span className="text-sm">
                     {viewMode === 'User' && `${selectedEntity.userGroups?.length || 0} User Groups`}
                     {viewMode === 'User Group' && `${selectedEntity.users?.length || 0} Users, ${selectedEntity.roles?.length || 0} Roles`}
                     {viewMode === 'Role' && `${selectedEntity.userGroups?.length || 0} User Groups`}
                   </span>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <Crown className="w-4 h-4 text-gray-600" />
                   <span className="text-sm font-medium">ID:</span>
                   <span className="text-sm font-mono">{selectedEntity.id}</span>
                 </div>
               </div>
             </div>

             {/* Relationships */}
             <div>
               <h4 className="text-lg font-semibold text-gray-900 mb-4">Relationships</h4>
               
               <div className="space-y-4">
                 {/* Connected Entities */}
                 {viewMode === 'User' && selectedEntity.userGroups && (
                   <div>
                     <h5 className="font-medium text-green-700 mb-2">User Groups</h5>
                     <div className="flex flex-wrap gap-1">
                       {selectedEntity.userGroups.map(ugId => {
                         const ug = hierarchyData.userGroups.find(u => u.id === ugId);
                         return ug ? (
                           <span 
                             key={ugId}
                             className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                           >
                             {ug.name}
                           </span>
                         ) : null;
                       })}
                     </div>
                   </div>
                 )}

                 {viewMode === 'User Group' && (
                   <>
                     {selectedEntity.users && (
                       <div>
                         <h5 className="font-medium text-blue-700 mb-2">Users</h5>
                         <div className="flex flex-wrap gap-1">
                           {selectedEntity.users.map(userId => {
                             const user = hierarchyData.users.find(u => u.id === userId);
                             return user ? (
                               <span 
                                 key={userId}
                                 className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                               >
                                 {user.name}
                               </span>
                             ) : null;
                           })}
                         </div>
                       </div>
                     )}
                     {selectedEntity.roles && (
                       <div>
                         <h5 className="font-medium text-purple-700 mb-2">Roles</h5>
                         <div className="flex flex-wrap gap-1">
                           {selectedEntity.roles.map(roleId => {
                             const role = hierarchyData.roles.find(r => r.id === roleId);
                             return role ? (
                               <span 
                                 key={roleId}
                                 className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                               >
                                 {role.name}
                               </span>
                             ) : null;
                           })}
                         </div>
                       </div>
                     )}
                   </>
                 )}

                 {viewMode === 'Role' && selectedEntity.userGroups && (
                   <div>
                     <h5 className="font-medium text-green-700 mb-2">User Groups</h5>
                     <div className="flex flex-wrap gap-1">
                       {selectedEntity.userGroups.map(ugId => {
                         const ug = hierarchyData.userGroups.find(u => u.id === ugId);
                         return ug ? (
                           <span 
                             key={ugId}
                             className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                           >
                             {ug.name}
                           </span>
                         ) : null;
                       })}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </Card>
       )}

             {/* Instructions */}
       {selectedEntity && (
         <Card className="p-4 bg-purple-50 border-purple-200">
           <p className="text-sm text-purple-800">
             Once clicked on '+' sign, it will open further hierarchy as below to show 
             that this {viewMode.toLowerCase()} is connected to which {
               viewMode === 'User' ? 'User Groups and their Roles' :
               viewMode === 'User Group' ? 'Users and Roles' :
               'User Groups and their Users'
             }
           </p>
         </Card>
       )}

       {/* Legend */}
       <Card className="p-4 bg-gray-50 border-gray-200">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-blue-600"></div>
               <span className="text-sm">Users</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-green-600"></div>
               <span className="text-sm">User Groups</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-purple-600"></div>
               <span className="text-sm">Roles</span>
             </div>
           </div>
           <div className="text-sm text-gray-600">
             Click '+' to expand hierarchy • Toggle 'Show Details' for more information
           </div>
         </div>
       </Card>
     </div>
   );
 };

export default HRBACView; 