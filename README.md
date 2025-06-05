# Role-User Hierarchy React App

This React.js application creates a hierarchical visualization of users, user groups, and roles similar to the image you provided.

## Features

- **Hierarchical Structure**: Displays a clear hierarchy from User → User Groups → Roles
- **Interactive UI**: Hover effects on user icons and add buttons
- **Responsive Design**: Clean, modern interface with proper spacing and layout
- **Sidebar Navigation**: Options to view by User, Role, or User Group
- **Tab Navigation**: Multiple management tabs (currently showing Role-User Hierarchy)

## Project Structure

```
src/
├── components/
│   ├── RoleUserHierarchy.js    # Main hierarchy component
│   ├── HierarchyNode.js        # Individual node component
│   ├── UserIcon.js             # User avatar component
│   └── *.css                   # Component styles
├── App.js                      # Main app component
└── index.js                    # Entry point
```

## Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## How it Works

- **User Level**: Shows a single admin user at the top
- **User Group Level**: Displays three user groups (Managers, Developers, Analysts)
- **Role Level**: Shows three roles (Admin, Editor, Viewer)
- **Connection Lines**: Visual lines connect the hierarchy levels
- **Add Buttons**: Circular "+" buttons for adding new items

## Customization

You can easily modify the hierarchy data in `RoleUserHierarchy.js` by updating the `hierarchyData` state object to add/remove users, groups, or roles.

## Technologies Used

- React.js 18.2.0
- CSS3 (Flexbox, Grid)
- SVG Icons 