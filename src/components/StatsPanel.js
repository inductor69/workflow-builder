import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, UserCheck, Shield, BarChart3 } from 'lucide-react';

const StatsPanel = ({ hierarchyData }) => {
  const stats = {
    totalUsers: 1, // Currently only one user supported
    totalUserGroups: hierarchyData.userGroups.length,
    totalRoles: hierarchyData.roles.length,
    totalItems: 1 + hierarchyData.userGroups.length + hierarchyData.roles.length
  };

  const StatCard = ({ icon: Icon, label, value, className = "" }) => (
    <Card className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-600 uppercase tracking-wide">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Users"
              value={stats.totalUsers}
              className="border-l-4 border-blue-500"
            />
            <StatCard
              icon={UserCheck}
              label="User Groups"
              value={stats.totalUserGroups}
              className="border-l-4 border-green-500"
            />
            <StatCard
              icon={Shield}
              label="Roles"
              value={stats.totalRoles}
              className="border-l-4 border-purple-500"
            />
            <StatCard
              icon={BarChart3}
              label="Total Items"
              value={stats.totalItems}
              className="border-l-4 border-indigo-500 bg-gradient-to-r from-blue-50 to-purple-50"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent User Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hierarchyData.userGroups.slice(-3).map(group => (
                <div key={group.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-green-800">Group:</span>
                    <span className="ml-2 text-sm text-gray-700">{group.name}</span>
                  </div>
                </div>
              ))}
              {hierarchyData.userGroups.length === 0 && (
                <p className="text-gray-500 text-sm">No user groups created yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hierarchyData.roles.slice(-3).map(role => (
                <div key={role.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="text-sm font-medium text-purple-800">Role:</span>
                    <span className="ml-2 text-sm text-gray-700">{role.name}</span>
                  </div>
                </div>
              ))}
              {hierarchyData.roles.length === 0 && (
                <p className="text-gray-500 text-sm">No roles created yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPanel; 