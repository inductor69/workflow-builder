import React, { useState } from 'react';
import HRBACView from './components/HRBACView';
import StatsPanel from './components/StatsPanel';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

function App() {
  const [activeTab, setActiveTab] = useState('hrbac');
  
  // Enhanced data structure with relationships
  const [hierarchyData, setHierarchyData] = useState({
    users: [
      { 
        id: 'user-1', 
        name: 'ABC', 
        type: 'user',
                 userGroups: ['ug-1', 'ug-2'], // User groups this user belongs to
         roles: ['role-1', 'role-2'] // Direct roles assigned to user
      },
      { 
        id: 'user-2', 
        name: 'DEF', 
        type: 'user',
        userGroups: ['ug-2', 'ug-3'],
        roles: ['role-2', 'role-3']
      },
      { 
        id: 'user-3', 
        name: 'GHI', 
        type: 'user',
        userGroups: ['ug-1'],
        roles: ['role-1']
      }
    ],
    userGroups: [
      { 
        id: 'ug-1', 
        name: 'Finance - I', 
        type: 'userGroup',
        users: ['user-1', 'user-3'], // Users in this group
        roles: ['role-1', 'role-2'] // Roles assigned to this group
      },
      { 
        id: 'ug-2', 
        name: 'Finance - II', 
        type: 'userGroup',
        users: ['user-1', 'user-2'],
        roles: ['role-2', 'role-3']
      },
      { 
        id: 'ug-3', 
        name: 'Payroll - I', 
        type: 'userGroup',
        users: ['user-2'],
        roles: ['role-3']
      }
    ],
    roles: [
      { 
        id: 'role-1', 
        name: 'Admin', 
        type: 'role',
        users: ['user-1', 'user-3'], // Users with this role
        userGroups: ['ug-1'] // User groups with this role
      },
      { 
        id: 'role-2', 
        name: 'Developer', 
        type: 'role',
        users: ['user-1', 'user-2'],
        userGroups: ['ug-1', 'ug-2']
      },
      { 
        id: 'role-3', 
        name: 'Team Lead', 
        type: 'role',
        users: ['user-2'],
        userGroups: ['ug-2', 'ug-3']
      }
    ]
  });

  const renderContent = () => {
    switch(activeTab) {
      case 'hrbac':
        return <HRBACView hierarchyData={hierarchyData} />;
      case 'stats':
        return <StatsPanel hierarchyData={hierarchyData} />;
      default:
        return <HRBACView hierarchyData={hierarchyData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-7xl mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            Role-User Management System
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button 
              variant={activeTab === 'hrbac' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('hrbac')}
              className={activeTab === 'hrbac' 
                ? "text-gray-900 bg-white/90 hover:bg-white" 
                : "text-white hover:text-white hover:bg-white/20"
              }
            >
              Role-User Hierarchy
            </Button>
            <Button 
              variant={activeTab === 'stats' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('stats')}
              className={activeTab === 'stats' 
                ? "text-gray-900 bg-white/90 hover:bg-white" 
                : "text-white hover:text-white hover:bg-white/20"
              }
            >
              Statistics
            </Button>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </Card>
    </div>
  );
}

export default App; 