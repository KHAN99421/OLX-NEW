import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Grid,
  TextField,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Login from './Login';
import Signup from './Signup';
import { auth } from './firebase';
import { signOut } from "firebase/auth";

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Blue
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 500,
      color: '#333',
    },
    body2: {
      color: '#666',
    },
  },
});

// Mock Data (Replace with Firebase later)
const mockAds = [
  {
    id: 1,
    title: 'Vintage Couch',
    description: 'Beautiful vintage couch, great condition.',
    price: 250,
    location: 'New York, NY',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'Other',
  },
  {
    id: 2,
    title: 'Mountain Bike',
    description: 'Like new mountain bike, only used a few times.',
    price: 400,
    location: 'Los Angeles, CA',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'Sports',
  },
  {
    id: 3,
    title: 'Dining Table Set',
    description: 'Solid wood dining table with four chairs.',
    price: 300,
    location: 'Chicago, IL',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'Furniture',
  },
  {
    id: 4,
    title: 'pTron Bassbuds',
    description: 'pTron Bassbuds, like new.',
    price: 700,
    location: 'San Francisco, CA',
    imageUrl: 'https://i.imgur.com/a9fCzqK.png',
    category: 'Electronics',
  },
  {
    id: 5,
    title: 'Honda Civic',
    description: '2018 Honda Civic, low mileage.',
    price: 15000,
    location: 'Houston, TX',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'Automobiles',
  },
  {
    id: 6,
    title: '2 Bedroom Apartment',
    description: 'Spacious 2 bedroom apartment in downtown.',
    price: 2500,
    location: 'Miami, FL',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'Real Estate',
  },
  {
    id: 7,
    title: 'Web Developer',
    description: 'Looking for a web developer with React experience.',
    price: null,
    location: 'Remote',
    imageUrl: 'https://via.placeholder.com/300x200',
    category: 'Jobs & Services',
  },
];

const categories = [
  { name: 'Electronics', description: 'Mobiles, Laptops, Accessories' },
  { name: 'Automobiles', description: 'Cars, Bikes, Spare Parts' },
  { name: 'Real Estate', description: 'Homes, Apartments, Spaces' },
  { name: 'Jobs & Services', description: 'IT, Marketing, Home Services' },
  { name: 'Furniture', description: 'Sofas, Tables, Chairs' },
  { name: 'Fashion', description: 'Clothing, Shoes, Accessories' },
  { name: 'Sports', description: 'Equipment, Gear, Accessories' },
  { name: 'Books', description: 'Fiction, Non-Fiction, Textbooks' },
  { name: 'Other', description: 'Miscellaneous items' },
];

function AdCard({ ad, user }) {
  const navigate = useNavigate();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handleChatClick = () => {
    if (!user) {
      setOpenLoginDialog(true);
    } else {
      // Implement Chat Here
      alert('Chat functionality will be implemented here.');
    }
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLoginNavigation = (route) => {
    navigate(route);
    handleCloseLoginDialog();
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={ad.imageUrl}
        alt={ad.title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {ad.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ad.description}
        </Typography>
        <Typography variant="h6">${ad.price}</Typography>
        <Typography variant="body2">
          <LocationOnIcon fontSize="small" /> {ad.location}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <Button size="small" onClick={handleChatClick} color="primary">
          Chat
        </Button>
      </CardActions>

      <Dialog
        open={openLoginDialog}
        onClose={handleCloseLoginDialog}
        aria-labelledby="login-dialog-title"
        aria-describedby="login-dialog-description"
      >
        <DialogTitle id="login-dialog-title">{"Login Required"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="login-dialog-description">
            To chat with the seller, please login or signup.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginDialog} color="primary">Cancel</Button>
          <Button onClick={() => handleLoginNavigation('/login')} autoFocus color="primary">
            Login
          </Button>
          <Button onClick={() => handleLoginNavigation('/signup')} autoFocus color="primary">
            Signup
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

function Home({ user }) {
  const [ads, setAds] = useState(mockAds);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocationFilter(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    navigate(`/?category=${category}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    } else {
      setCategoryFilter('');
    }
  }, [navigate]);


  const filteredAds = ads.filter(ad => {
    return ad.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
           ad.location.toLowerCase().includes(locationFilter.toLowerCase()) &&
           (categoryFilter === '' || ad.category === categoryFilter);
  });

  return (
    <Container>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        Browse Categories
      </Typography>
      <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {categories.map(category => (
          <ListItem
            key={category.name}
            button
            onClick={() => handleCategoryClick(category.name)}
            sx={{ width: 'auto', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <ListItemText primary={<Typography variant="subtitle1">{category.name}</Typography>} />
            <Typography variant="body2">{category.description}</Typography>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        <TextField
          label="Search Ads"
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <TextField
          label="Location"
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
          value={locationFilter}
          onChange={handleLocationChange}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.name} value={category.name}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<SearchIcon />} color="primary">
          Search
        </Button>
      </Box>
      <Grid container spacing={2}>
        {filteredAds.map(ad => (
          <Grid item xs={12} sm={6} md={4} key={ad.id}>
            <AdCard ad={ad} user={user} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function AdminDashboard() {
  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        Admin Dashboard
      </Typography>
      {/* Add Admin Functionality Here */}
      <Typography>Manage users, ads, and reports here.</Typography>
    </Container>
  );
}

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdminClick = () => {
    navigate("/admin");
    handleClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      handleClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Classified Ads
            </Typography>
            {user ? (
              <div>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleAdminClick}>Admin Dashboard</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <div>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
              </div>
            )}
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/admin" element={user ? <AdminDashboard /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
