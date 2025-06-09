import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Users, UserCheck, Shield, ChevronRight, Search } from 'lucide-react';

const RoleHierarchyView = ({ hierarchyData }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return hierarchyData.roles;
    return hierarchyData.roles.filter(role => 
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [hierarchyData.roles, searchQuery]);

  // Get user groups for selected role
  const userGroupsForRole = useMemo(() => {
    if (!selectedRole) return [];
    return selectedRole.userGroups?.map(ugId => getEntityById(ugId, 'userGroup')).filter(Boolean) || [];
  }, [selectedRole]);

  // Get users for selected user group
  const usersForUserGroup = useMemo(() => {
    if (!selectedUserGroup) return [];
    return selectedUserGroup.users?.map(userId => getEntityById(userId, 'user')).filter(Boolean) || [];
  }, [selectedUserGroup]);

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSelectedUserGroup(null); // Reset user group selection
  };

  // Handle user group selection
  const handleUserGroupSelect = (userGroup) => {
    setSelectedUserGroup(userGroup);
  };

  // Get stats for a role
  const getRoleStats = (role) => {
    const userGroups = role.userGroups?.length || 0;
    const totalUsers = role.userGroups?.reduce((count, ugId) => {
      const ug = getEntityById(ugId, 'userGroup');
      return count + (ug?.users?.length || 0);
    }, 0) || 0;
    return { userGroups, totalUsers };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Role Hierarchy Explorer</h2>
        </div>
        <p className="text-gray-600">
          Explore how roles are distributed across user groups and their members. 
          Select a role to see its user groups, then select a user group to see its users.
        </p>
      </Card>

      {/* Search */}
      <Card className="p-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </Card>

      {/* Breadcrumb */}
      {(selectedRole || selectedUserGroup) && (
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {selectedRole ? selectedRole.name : 'Select a role'}
            </span>
            {selectedRole && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Users className="w-4 h-4" />
                <span className="text-gray-900 font-medium">
                  {selectedUserGroup ? selectedUserGroup.name : 'Select a user group'}
                </span>
              </>
            )}
            {selectedUserGroup && (
              <>
                <ChevronRight className="w-4 h-4" />
                <UserCheck className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Users</span>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Roles */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Roles</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {filteredRoles.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredRoles.map(role => {
              const stats = getRoleStats(role);
              const isSelected = selectedRole?.id === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-purple-50 border-purple-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{role.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.userGroups} groups • {stats.totalUsers} users
                  </div>
                </button>
              );
            })}
            
            {filteredRoles.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No roles found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Column 2: User Groups */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">User Groups</h3>
            {selectedRole && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {userGroupsForRole.length}
              </span>
            )}
          </div>
          
          {!selectedRole ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Select a role</p>
              <p className="text-sm">to see its user groups</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {userGroupsForRole.map(userGroup => {
                const isSelected = selectedUserGroup?.id === userGroup.id;
                const userCount = userGroup.users?.length || 0;
                
                return (
                  <button
                    key={userGroup.id}
                    onClick={() => handleUserGroupSelect(userGroup)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200 shadow-sm' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{userGroup.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {userCount} {userCount === 1 ? 'user' : 'users'}
                    </div>
                  </button>
                );
              })}
              
              {userGroupsForRole.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No user groups assigned</p>
                  <p className="text-xs">to this role</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Column 3: Users */}
        <Card className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Users</h3>
            {selectedUserGroup && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {usersForUserGroup.length}
              </span>
            )}
          </div>
          
          {!selectedRole ? (
            <div className="text-center py-12 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Select a role</p>
              <p className="text-sm">and user group to see users</p>
            </div>
          ) : !selectedUserGroup ? (
            <div className="text-center py-12 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Select a user group</p>
              <p className="text-sm">to see its users</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {usersForUserGroup.map(user => (
                <div
                  key={user.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Member of {user.userGroups?.length || 0} groups
                  </div>
                </div>
              ))}
              
              {usersForUserGroup.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No users in this group</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Summary Stats */}
      {selectedRole && (
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Summary for "{selectedRole.name}"</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userGroupsForRole.length}</div>
              <div className="text-sm text-gray-600">User Groups</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userGroupsForRole.reduce((total, ug) => total + (ug.users?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedUserGroup ? usersForUserGroup.length : '-'}
              </div>
              <div className="text-sm text-gray-600">Selected Group Users</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoleHierarchyView; 