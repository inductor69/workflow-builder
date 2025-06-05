import React, { useState } from 'react';
import RoleUserHierarchy from './components/RoleUserHierarchy';
import StatsPanel from './components/StatsPanel';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

function App() {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [hierarchyData, setHierarchyData] = useState({
    user: {
      id: 'user-1',
      name: 'Admin User',
      type: 'user'
    },
    userGroups: [
      { id: 'ug-1', name: 'Managers', type: 'userGroup' },
      { id: 'ug-2', name: 'Developers', type: 'userGroup' },
      { id: 'ug-3', name: 'Analysts', type: 'userGroup' }
    ],
    roles: [
      { id: 'role-1', name: 'Admin', type: 'role' },
      { id: 'role-2', name: 'Editor', type: 'role' },
      { id: 'role-3', name: 'Viewer', type: 'role' }
    ]
  });

  const renderContent = () => {
    switch(activeTab) {
      case 'hierarchy':
        return <RoleUserHierarchy hierarchyData={hierarchyData} setHierarchyData={setHierarchyData} />;
      case 'stats':
        return <StatsPanel hierarchyData={hierarchyData} />;
      default:
        return <div className="text-center py-12 text-gray-500 text-lg">Coming Soon...</div>;
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
              variant={activeTab === 'roles' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('roles')}
              className={activeTab === 'roles' 
                ? "text-gray-900 bg-white/90 hover:bg-white" 
                : "text-white hover:text-white hover:bg-white/20"
              }
            >
              Manage Roles
            </Button>
            <Button 
              variant={activeTab === 'groups' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('groups')}
              className={activeTab === 'groups' 
                ? "text-gray-900 bg-white/90 hover:bg-white" 
                : "text-white hover:text-white hover:bg-white/20"
              }
            >
              Manage User Groups
            </Button>
            <Button 
              variant={activeTab === 'hierarchy' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('hierarchy')}
              className={activeTab === 'hierarchy' 
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