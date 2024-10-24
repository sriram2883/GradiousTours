import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const AdminPage = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [coordinatorData, setCoordinatorData] = useState({
    name: "",
    guide_id:'',
    email: "",
    password: "",
    tour: "",
  });
  const [tourData, setTourData] = useState({
    tourname: "",
    tourid: "",
    included: [],
    rating: "",
    cost: "",
    location: "",
    timespent: "",
    starting_date: "",
    starting_time: "",
    return_time: "",
    carousel: [""],
    stops: [
      { day: "", loc: "", notes: "", image: "", pros: [""], duration: "" },
    ],
  });

  // Mock data for admins, coordinators, and tours
  const [admins, setAdmins] = useState([
    { name: "Admin 1", email: "admin1@example.com", password: "password1" },
    { name: "Admin 2", email: "admin2@example.com", password: "password2" },
  ]);

  const [coordinators, setCoordinators] = useState([
    {
      name: "Coordinator 1",
      email: "coordinator1@example.com",
      password: "password1",
      tour: "Tour A",
    },
    {
      name: "Coordinator 2",
      email: "coordinator2@example.com",
      password: "password2",
      tour: "Tour B",
    },
  ]);

  const [tours, setTours] = useState([
    {
      tourname: "Tour A",
      tourid: "001",
      included: ["Breakfast", "Guide"],
      rating: "4.5",
      cost: "200",
      location: "Location A",
      timespent: "3 days",
      starting_date: "2024-01-01",
      starting_time: "09:00",
      return_time: "18:00",
      carousel: ["image1.jpg", "image2.jpg"],
      stops: [
        {
          day: "Day 1",
          loc: "Location A",
          notes: "Nice view",
          image: "day1.jpg",
          pros: ["Scenic"],
          duration: "5 hours",
        },
      ],
    },
    {
      tourname: "Tour B",
      tourid: "002",
      included: ["Lunch", "Guide"],
      rating: "4.7",
      cost: "250",
      location: "Location B",
      timespent: "2 days",
      starting_date: "2024-02-01",
      starting_time: "08:00",
      return_time: "19:00",
      carousel: ["image3.jpg"],
      stops: [
        {
          day: "Day 1",
          loc: "Location B",
          notes: "Historical site",
          image: "day1.jpg",
          pros: ["Cultural"],
          duration: "4 hours",
        },
      ],
    },
  ]);
  useEffect(()=>{
    fetch('https://project-tour-management-server.onrender.com/user/tours' , {method: 'GET'} , {headers: {'Content-Type': 'application/json'}}).then(res => res.json()).then(data=>{
      // console.log(data)
      const tour = data.map((tour)=> { 
        return tour.details
        
    })
    setTours(tour);
  })
  fetch(
    "https://project-tour-management-server.onrender.com/admin/coadmins",
    { method: "GET" ,
    
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    }
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      setAdmins(data);
    });
    fetch('https://project-tour-management-server.onrender.com/admin/guides', 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).then(res => res.json()).then(data => {
      // console.log(data)
      setCoordinators(data)
    }
    )
    
  },[])
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCoordinatorChange = (e) => {
    const { name, value } = e.target;
    setCoordinatorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTourChange = (e) => {
    const { name, value } = e.target;
    setTourData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Carousel and Stops management functions
  const addCarouselImage = () => {
    setTourData((prevData) => ({
      ...prevData,
      carousel: [...prevData.carousel, ""],
    }));
  };

  const removeCarouselImage = (index) => {
    setTourData((prevData) => ({
      ...prevData,
      carousel: prevData.carousel.filter((_, i) => i !== index),
    }));
  };

  const addStop = () => {
    setTourData((prevData) => ({
      ...prevData,
      stops: [
        ...prevData.stops,
        { day: "", loc: "", notes: "", image: "", pros: [""], duration: "" },
      ],
    }));
  };

  const removeStop = (index) => {
    setTourData((prevData) => ({
      ...prevData,
      stops: prevData.stops.filter((_, i) => i !== index),
    }));
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...tourData.stops];
    updatedStops[index][field] = value;
    setTourData((prevData) => ({
      ...prevData,
      stops: updatedStops,
    }));
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setAdmins((prev) => [...prev, adminData]);
    // console.log("New Admin Data:", adminData);
    setAdminData({ name: "", email: "", password: "" }); // Reset form
  };

  const handleCoordinatorSubmit = (e) => {
    e.preventDefault();
    setCoordinators((prev) => [...prev, coordinatorData]);
    // console.log("New Coordinator Data:", coordinatorData);
    setCoordinatorData({ name: "", email: "", password: "", tour: "" }); // Reset form
  };

  const handleTourSubmit = (e) => {
    e.preventDefault();
    setTours((prev) => [...prev, tourData]);
    // console.log("New Tour Data:", tourData);
    setTourData({
      tourname: "",
      tourid: "",
      included: [],
      rating: "",
      cost: "",
      location: "",
      timespent: "",
      starting_date: "",
      starting_time: "",
      return_time: "",
      carousel: [""],
      stops: [
        { day: "", loc: "", notes: "", image: "", pros: [""], duration: "" },
      ],
    }); // Reset form
  };

  const removeTour = (tourid) => {
    fetch(`https://project-tour-management-server.onrender.com/admin/tour/${tourid}` , 
      {
        method:"DELETE" , 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).then(res =>{
      if(res.ok) {
        alert('ok')
      }else{
        alert('error')
      }
    })
    setTours((prev) => prev.filter((tour) => tour.tourid !== tourid));
  };

  const removeCoordinator = (id) => {
    fetch(`https://project-tour-management-server.onrender.com/admin/guide/${id}` , 
      {
        method:'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).then(res =>{
      if(res.ok){
        alert('ok')
      }
      else{
        alert('error')
      }
    }
    )
    setCoordinators((prev) =>
      prev.filter((coordinator) => coordinator.guide_id !== id),
    );
  };

  const removeAdmin = (username) => {
    fetch(`https://project-tour-management-server.onrender.com/admin/coadmin/${username}` ,
      {
        method: 'DELETE' , 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).then(res =>{
      if(res.ok){
        alert('ok')
      }
      else{
        alert('error')
      }
    })
    setAdmins((prev) => prev.filter((admin) => admin.username !== username));
  };

  const populateTourData = (tour) => {
    const newtour = {
      tourname: tour.tourname,
      tourid: tour.tourid,
      included: tour.included,
      rating:   tour.rating,
      cost: tour.cost,
      location: tour.location,
      timespent: tour.timespent,
      starting_date: tour.starting_date,
      starting_time: tour.starting_time,
      return_time: tour.return_time,
      carousel: tour.carousel,
      stops: tour.stops,
    };
    setTourData(newtour);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Page
      </Typography>

      <Box
        component="form"
        onSubmit={handleAdminSubmit}
        sx={{ marginBottom: 4 }}
      >
        <Typography variant="h6" gutterBottom>
          Create New Admin
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={adminData.name}
          onChange={handleAdminChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          value={adminData.email}
          onChange={handleAdminChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={adminData.password}
          onChange={handleAdminChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            fetch(`https://project-tour-management-server.onrender.com/admin/coadmin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                username: adminData.name,
                email: adminData.email,
                password: adminData.password,
              }),
            })
              .then((res) => {
                if (res.ok) {
                  alert("created ok");
                }
              })
              .catch(() => {
                alert("error");
              });
          }}
        >
          Create Admin
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleCoordinatorSubmit}
        sx={{ marginBottom: 4 }}
      >
        <Typography variant="h6" gutterBottom>
          Create New Coordinator
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={coordinatorData.name}
          onChange={handleCoordinatorChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="guideid"
          name="guide_id"
          value={coordinatorData.guide_id}
          onChange={handleCoordinatorChange }
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          name="email"
          value={coordinatorData.email}
          onChange={handleCoordinatorChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={coordinatorData.password}
          onChange={handleCoordinatorChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
          <TextField
          label="tour"
          name="tour"
          value={coordinatorData.tour}
          onChange={handleCoordinatorChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            // console.log({
            //   username: coordinatorData.name,
            //   email: coordinatorData.email,
            //   password: coordinatorData.password,
            //   guide_id: coordinatorData.guide_id,
            //   tours: {
            //     assigned_tours: [coordinatorData.tour],
            //   },
            // });
            fetch(`https://project-tour-management-server.onrender.com/admin/guide`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                username: coordinatorData.name,
                email: coordinatorData.email,
                password: coordinatorData.password,
                guide_id: coordinatorData.guide_id,
                tours: {
                   assigned_tours:[coordinatorData.tour]
                },
              }),
            })
              .then((res) => {
                if (res.ok) {
                  alert("created ok");
                }
              })
              .catch(() => {
                alert("error");
              });
          }}
        >
          Create Coordinator
        </Button>
      </Box>

      <Box component="form" onSubmit={handleTourSubmit}>
        <Typography variant="h6" gutterBottom>
          Create New Tour
        </Typography>
        <TextField
          label="Tour Name"
          name="tourname"
          value={tourData.tourname}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Tour ID"
          name="tourid"
          value={tourData.tourid}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Included Items"
          name="included"
          value={tourData.included.join(", ")}
          onChange={(e) =>
            handleTourChange({
              target: { name: "included", value: e.target.value.split(", ") },
            })
          }
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Rating"
          name="rating"
          value={tourData.rating}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Cost"
          name="cost"
          value={tourData.cost}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Location"
          name="location"
          value={tourData.location}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Time Spent"
          name="timespent"
          value={tourData.timespent}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Starting Date"
          name="starting_date"
          type="date"
          value={tourData.starting_date}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Starting Time"
          name="starting_time"
          type="time"
          value={tourData.starting_time}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Return Time"
          name="return_time"
          type="time"
          value={tourData.return_time}
          onChange={handleTourChange}
          required
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Typography variant="h6" gutterBottom>
          Carousel Images
        </Typography>
        {tourData.carousel.map((image, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
          >
            <TextField
              label={`Image URL ${index + 1}`}
              value={image}
              onChange={(e) => {
                const updatedCarousel = [...tourData.carousel];
                updatedCarousel[index] = e.target.value;
                setTourData((prev) => ({ ...prev, carousel: updatedCarousel }));
              }}
              fullWidth
              sx={{ marginRight: 1 }}
            />
            <IconButton onClick={() => removeCarouselImage(index)}>
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          onClick={addCarouselImage}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        >
          Add Image
        </Button>

        <Typography variant="h6" gutterBottom>
          Stops
        </Typography>
        {tourData.stops.map((stop, index) => (
          <Box key={index} sx={{ marginBottom: 2 }}>
            <TextField
              label="Day"
              value={stop.day}
              onChange={(e) => handleStopChange(index, "day", e.target.value)}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Location"
              value={stop.loc}
              onChange={(e) => handleStopChange(index, "loc", e.target.value)}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Notes"
              value={stop.notes}
              onChange={(e) => handleStopChange(index, "notes", e.target.value)}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Image URL"
              value={stop.image}
              onChange={(e) => handleStopChange(index, "image", e.target.value)}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Pros"
              value={stop.pros.join(",") || ''}
              onChange={(e) =>
                handleStopChange(index, "pros", e.target.value.split(","))
              }
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Duration"
              value={stop.duration}
              onChange={(e) =>
                handleStopChange(index, "duration", e.target.value)
              }
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <IconButton onClick={() => removeStop(index)}>
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
        <Button onClick={addStop} variant="outlined" sx={{ marginBottom: 2 }}>
          Add Stop
        </Button>

        <Button type="submit" variant="contained" color="primary" onClick={()=>{
          // console.log(tourData)
          fetch('https://project-tour-management-server.onrender.com/admin/tour', 
            {
              method:'POST' , 
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(
                {
                  tour_id: tourData.tourid  , 
                  details:  tourData
            })}).then(res =>{
              if(res.ok){
                alert('create ok')
              }
              else{
                alert('error')
              }
            })
            
        }}>
          Create Tour
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Tours
      </Typography>
      {tours.map((tour) => (
        <Box
          key={tour.tourid}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">{tour.tourname}</Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => populateTourData(tour)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => removeTour(tour.tourid)}
          >
            Remove
          </Button>
        </Box>
      ))}

      {/* Admins List */}
      <Typography variant="h5" gutterBottom>
        Admins
      </Typography>
      {admins.map((admin) => (
        <Box
          key={admin.email}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">
            {admin.name} - {admin.email}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => removeAdmin(admin.username)}
          >
            Remove
          </Button>
        </Box>
      ))}

      {/* Coordinators List */}
      <Typography variant="h5" gutterBottom>
        Coordinators
      </Typography>
      {coordinators.map((coordinator) => (
        <Box
          key={coordinator.email}
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">
            {coordinator.name} - {coordinator.email} - Tour: {coordinator.tour}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => removeCoordinator(coordinator.guide_id)}
          >
            Remove
          </Button>
        </Box>
      ))}
    </Container>
  );
};

export default AdminPage;
