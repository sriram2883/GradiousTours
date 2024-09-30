import React, { useState } from 'react';
import { Button, Grid, Typography, Paper } from '@mui/material';
import { Tour, AdminPanelSettings, People, Explore } from '@mui/icons-material';
import Operations from './operations';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const handleSelect = (model) => {
    setSelectedModel(model);
  };

  return (
    <>
    <Navbar/>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Admin Dashboard
          </Typography>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            startIcon={<Explore />}
            onClick={() => handleSelect("tours")}
          >
            Tours
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<People />}
            onClick={() => handleSelect("guides")}
          >
            Guides
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<People />}
            onClick={() => handleSelect("travellers")}
          >
            Travellers
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AdminPanelSettings />}
            onClick={() => handleSelect("admins")}
          >
            Admins
          </Button>
        </Grid>

        {selectedModel && (
          <Grid item xs={12}>
            <Paper style={{ padding: 20 }}>
              <Operations model={selectedModel} />
            </Paper>
          </Grid>
        )}
      </Grid>
      
    </>
  );
};

export default AdminDashboard;
