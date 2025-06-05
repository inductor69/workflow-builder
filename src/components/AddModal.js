import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AddModal = ({ isOpen, type, editItem, onSave, onCancel }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
    } else {
      setName('');
    }
  }, [editItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        type,
        name: name.trim(),
        editItem
      });
    }
  };

  const getTitle = () => {
    const action = editItem ? 'Edit' : 'Add';
    const typeLabel = type === 'userGroup' ? 'User Group' : 
                     type === 'role' ? 'Role' : 'User';
    return `${action} ${typeLabel}`;
  };

  const getPlaceholder = () => {
    return type === 'userGroup' ? 'Enter group name' :
           type === 'role' ? 'Enter role name' : 'Enter user name';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name:
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={getPlaceholder()}
              required
              autoFocus
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {editItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal; 