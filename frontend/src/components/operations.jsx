import React from 'react';
import { Button, Grid } from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import TourOperations from './tours';
import GuideOperations from './guides';
import TravellerOperations from './travellers';
import AdminOperations from './admins';

const Operations = ({ model }) => {
  const renderOperationsComponent = () => {
    switch (model) {
      case 'tours':
        return <TourOperations />;
      case 'guides':
        return <GuideOperations />;
      case 'travellers':
        return <TravellerOperations />;
      case 'admins':
        return <AdminOperations />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderOperationsComponent()}
    </div>
  );
};

const handleOperationClick = (operation) => {
  console.log(`Performing ${operation} operation`);
};

export default Operations;
