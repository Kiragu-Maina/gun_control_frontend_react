import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardGroup,
    Button,
    Row,
    Col,

} from "reactstrap";
import "./cards.css";
import Select from 'react-select';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { API_ENDPOINT_1 } from './apis/api';
import { AuthContext } from './AuthContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    font: '24px',
};



const Cards = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [locationFilter, setLocationFilter] = useState("");
    const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [open, setOpen] = useState(false);
    const [isCategoriesVisible, setCategoriesVisible] = useState(false);

    const handleClose = () =>{
    console.log('close called');
     setOpen(false);
    }

    const handleOpen = (product) => {
        setOpen(true);
        console.log("product");
        setSelectedProduct(product);


    };



    useEffect(() => {
        // Check if user location exists in local storage
        const storedLocation = localStorage.getItem("userLocation");
        if (storedLocation) {
            setUserLocation(JSON.parse(storedLocation));
        } else {
            // Fetch user's location using Geolocation API
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        localStorage.setItem("userLocation", JSON.stringify(location));
                        setUserLocation(location);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            }
        }
    }, []);

    useEffect(() => {
        const username = 'none';
        // Fetch data from the API and set the products state
        fetch(`${API_ENDPOINT_1}/apis/ecommerce/${username}/`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleLocationFilter = (location) => {
        setLocationFilter(location);

        // Filter products based on location
        if (location === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.location.toLowerCase().includes(location.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const calculateDistance = (latitude1, longitude1, latitude2, longitude2, decimalPlaces = 2) => {
        const earthRadius = 6371; // Radius of the earth in kilometers
        const latDifference = (latitude2 - latitude1) * (Math.PI / 180);
        const lonDifference = (longitude2 - longitude1) * (Math.PI / 180);
        const a =
            Math.sin(latDifference / 2) * Math.sin(latDifference / 2) +
            Math.cos(latitude1 * (Math.PI / 180)) *
            Math.cos(latitude2 * (Math.PI / 180)) *
            Math.sin(lonDifference / 2) *
            Math.sin(lonDifference / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
        const y = Math.sin(lonDifference) * Math.cos(latitude2);
        const x =
            Math.cos(latitude1 * (Math.PI / 180)) * Math.sin(latitude2 * (Math.PI / 180)) -
            Math.sin(latitude1 * (Math.PI / 180)) * Math.cos(latitude2 * (Math.PI / 180)) * Math.cos(lonDifference);
        const bearing = (Math.atan2(y, x) * 180) / Math.PI; // Bearing in degrees



        return {
            distance: distance.toFixed(decimalPlaces),
            bearing: (bearing + 360) % 360 // Normalize the bearing to a positive value between 0 and 360 degrees
        }
    };
    const distance = (location) => {
        const userLatitude = userLocation.latitude; // User's latitude
        const userLongitude = userLocation.longitude; // User's longitude

        const [fetchedLatitude, fetchedLongitude] = location.split(",").map(parseFloat);
        const dist = calculateDistance(userLatitude, userLongitude, fetchedLatitude, fetchedLongitude);
        const distanc = dist.distance

        return `${distanc} km`;
    };

    const handleMaps = (location) => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        window.open(googleMapsUrl, "_blank");
    }
    const sortedProducts = filteredProducts.filter(product => product.category === selectedCategory).sort((productA, productB) => {
        const distanceA = distance(productA.location);
        // Calculate distance for product A
        const distanceB = distance(productB.location);
        // Calculate distance for product B
        return distanceA.localeCompare(distanceB, undefined, { numeric: true }); // Sort products based on distance (from nearest to farthest)
    });

    function sortProductsByDistance(filteredProducts) {


        filteredProducts.sort((productA, productB) => {
            const distanceA = distance(productA.location);
            // Calculate distance for product A
            const distanceB = distance(productB.location);
            return distanceA.localeCompare(distanceB, undefined, { numeric: true });

        });


        return filteredProducts;
    }






    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };
    const getUniqueCategories = () => {
        const categories = [...new Set(filteredProducts.map(product => product.category))];
        return categories;
    };
    function getUniqueProductOptions() {
        const uniqueProducts = {}; // Using an object to ensure uniqueness
        filteredProducts.forEach(product => {
          const lowercaseTitle = product.title.toLowerCase();
          if (!uniqueProducts[lowercaseTitle]) {
            uniqueProducts[lowercaseTitle] = true;
            return {
              value: product.title,
              label: capitalizeFirstLetter(product.title)
            };
          }
        });
      
        return Object.keys(uniqueProducts).map(title => ({
          value: title,
          label: capitalizeFirstLetter(title)
        }));
      }
      
      function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }

    return (


        <div className="cardsnew">


            {showSearch && (
                <div className="searchproducts">



                    <Select
                        isSearchable
                        options={getUniqueProductOptions()}
                        placeholder={searchValue ? searchValue : "Let us help you get what you want faster. Search here..."}
                        // placeholder='Let us help you get what you want faster. Search here...'
                        onChange={(selectedOption) => {
                            // Store the selected search value in the state variable
                            setSearchValue(selectedOption.value);
                            setShowSearch(false);
                        }}
                    />
                </div>
            )}

            {searchValue && (
                <div>
                    <div className="sidebar">
                        <div className="top-right">
                            {/* <Button className="sort-button" onClick={() => sortProductsByDistance(filteredProducts)}>
                                Sort by Distance
                            </Button> */}

                        </div>
                        <div className="search">
                            <Select
                                isSearchable
                                options={getUniqueProductOptions()}
                                placeholder={searchValue ? searchValue : "Search by product"}
                                // placeholder='Let us help you get what you want faster. Search here...'
                                onChange={(selectedOption) => {
                                    // Store the selected search value in the state variable
                                    setSearchValue(selectedOption.value);
                                    setSelectedCategory('');

                                }}
                            />
                        </div>
                    </div>

                    {/* Check if the screen size is less than 768px */}
                    {window.innerWidth < 768 ? (
                        // Render categories as a dropdown
                        <div className="categories-dropdown">
                            <Select
                                options={getUniqueCategories().map(category => ({
                                    value: category,
                                    label: category
                                }))}
                                onChange={selectedOption => handleCategoryFilter(selectedOption.value)}
                                placeholder="Search by Category"
                            />
                        </div>
                    ) : (
                        // Render categories as a slide-in menu
                        <div className="categories">
                            <ul className="listed">
                                <h3>Categories</h3>
                                {getUniqueCategories().map(category => (
                                    <li
                                        className="list-items"
                                        key={category}
                                        onClick={() => handleCategoryFilter(category)}
                                    >
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Render the selected category */}
                    {selectedCategory ? (

                        <div className="products" key={selectedCategory}>

                            <h1>{selectedCategory}</h1>
                            {/* Render filtered products of the selected category as cards */}
                            <Row>
                                {sortedProducts.map((product, index) => (
                                    <Col md="6" lg="3" key={index}>
                                        
                                        <div className="card-image-container">
                                            <CardImg className="img" alt="Product Image" src={product.image} top width="200%" />
                                        
                                        <div className="viewsupplierssmall">
                                                        <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                        </div>
                                                        </div>
                                        <CardBody className="cardfbody">
                                            <CardTitle tag="h5" className="product-title">{product.title}</CardTitle>
                                            <CardSubtitle className="mb-2 text-muted" tag="h6">{product.subtitle}</CardSubtitle>
                                            <CardText className="product-description">{product.description}</CardText>
                                            <CardText className="product-description">{distance(product.location)}</CardText>

                                            <CardText className="product-description">Avg. price: {product.price} KES</CardText>
                                            <div>
                                                
                                            
                                                <div className="viewsuppliers">
                                                 <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                 </div>
                                           
                                               

                                                <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <div className="handleclose">
                                                    <Button onClick={() => handleClose()}>Close</Button>
                                                    </div>
                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                            {product.title}
                                                        </Typography>
                                                        <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                            {product.shop_name}
                                                        </Typography>
                                                        <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                            {distance(product.location)}
                                                        </Typography>
                                                        <Button onClick={() => handleMaps(product.location)}>Show on Map</Button>
                                                    </Box>
                                                </Modal>
                                            </div>



                                        </CardBody>
                                    </Col>
                                ))}


                            </Row>
                            {/* Render products of other categories */}
                            {getUniqueCategories()
                                .filter(category => category !== selectedCategory)
                                .map(category => (
                                    <React.Fragment key={category}>

                                        <h1>{category}</h1>
                                        {/* Render filtered products of the current category as cards */}
                                        <Row>
                                            {filteredProducts
                                                .filter(product => product.category === category)
                                                .map((product, index) => (
                                                    <Col md="6" lg="3" key={index}>
                                                        <div className="card-image-container">
                                                            <CardImg className="img" alt="Product Image" src={product.image} top width="200%" />
                                                        
                                                        <div className="viewsupplierssmall">
                                                        <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                        </div>
                                                        </div>
                                                        <CardBody className="cardfbody">
                                                            <CardTitle tag="h5" className="product-title">{product.title}</CardTitle>
                                                            <CardSubtitle className="mb-2 text-muted" tag="h6">{product.subtitle}</CardSubtitle>
                                                            <CardText className="product-description">{product.description}</CardText>
                                                            <CardText className="product-description">{distance(product.location)}</CardText>
                                                            <CardText className="product-description">Avg. price: {product.price} KES</CardText>
                                                            <div>
                                                            <div className="viewsuppliers">
                                                                <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                                </div>
                                           
                                                                <Modal
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="modal-modal-title"
                                                                    aria-describedby="modal-modal-description"
                                                                >
                                                                    <Box sx={style}>
                                                                    <div className="handleclose">
                                                                    <Button onClick={() => handleClose()}>Close</Button>
                                                                    </div>
                                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                                            {product.title}
                                                                        </Typography>
                                                                        <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                                            {product.shop_name}
                                                                        </Typography>
                                                                        <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                                            {distance(product.location)}
                                                                        </Typography>
                                                                        <Button onClick={() => handleMaps(product.location)}>Show on Map</Button>
                                                                    </Box>
                                                                </Modal>
                                                            </div>
                                                        </CardBody>
                                                    </Col>
                                                ))}

                                        </Row>

                                    </React.Fragment>

                                ))}
                        </div>

                    ) : (
                        <React.Fragment>
                            {/* Render filtered products of the searched product as cards */}
                            <div className="productss" key={searchValue}>
                                <div className="productsearched">
                                    <Row>
                                    {filteredProducts
                                    .filter(product => product.title.toLowerCase().includes(searchValue.toLowerCase()))
                                    .map((product, index) => (
                                                <Col md="6" lg="3" key={index}>
                                                    <div className="card-image-container">
                                                        <CardImg className="img" alt="Product Image" src={product.image} top width="200%" />
                                                    
                                                    <div className="viewsupplierssmall">
                                                        <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                        </div>
                                                        </div>
                                                    <CardBody className="cardfbody">
                                                        <CardTitle tag="h5" className="product-title">{product.title}</CardTitle>
                                                        <CardSubtitle className="mb-2 text-muted" tag="h6">{product.subtitle}</CardSubtitle>
                                                        <CardText className="product-description">{product.description}</CardText>
                                                        <CardText className="product-description">{distance(product.location)}</CardText>
                                                        <CardText className="product-description">Avg. price: {product.price} KES</CardText>
                                                        <div>
                                                        <div className="viewsuppliers">
                                                            <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                            </div>
                                           
                                                            <Modal
                                                                open={open}
                                                                onClose={handleClose}
                                                                aria-labelledby="modal-modal-title"
                                                                aria-describedby="modal-modal-description"
                                                            >
                                                                <Box sx={style}>
                                                                <div className="handleclose">
                                                                <Button onClick={() => handleClose()}>Close</Button>
                                                                </div>
                                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                                        {product.title}
                                                                    </Typography>
                                                                    <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                                        {product.shop_name}
                                                                    </Typography>
                                                                    <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                                        {distance(product.location)}
                                                                    </Typography>
                                                                    <Button onClick={() => handleMaps(product.location)}>Show on Map</Button>
                                                                </Box>
                                                            </Modal>
                                                        </div>
                                                    </CardBody>
                                                </Col>
                                            ))}

                                    </Row>
                                </div>
                            </div>
                            {getUniqueCategories().map(category => (
                                <div className="products" key={category}>
                                    <h1>{category}</h1>
                                    {/* Render filtered products of the current category as cards */}
                                    <Row>
                                        {filteredProducts
                                            .filter(product => product.category === category)
                                            .map((product, index) => (
                                                <Col md="6" lg="3" key={index}>
                                                    <div className="card-image-container">
                                                        <CardImg className="img" alt="Product Image" src={product.image} top width="200%" />
                                                    
                                                    <div className="viewsupplierssmall">
                                                        <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                        </div>
                                                        </div>
                                                    <CardBody className="cardfbody">
                                                        <CardTitle tag="h5" className="product-title">{product.title}</CardTitle>
                                                        <CardSubtitle className="mb-2 text-muted" tag="h6">{product.subtitle}</CardSubtitle>
                                                        <CardText className="product-description">{product.description}</CardText>
                                                        <CardText className="product-description">{distance(product.location)}</CardText>
                                                        <CardText className="product-description">Avg. price: {product.price} KES</CardText>
                                                        <div>
                                                        <div className="viewsuppliers">
                                                        <Button onClick={() => handleOpen(product)}>View Suppliers</Button>
                                                        </div>
                                           
                                                            <Modal
                                                                open={open}
                                                                onClose={handleClose}
                                                                aria-labelledby="modal-modal-title"
                                                                aria-describedby="modal-modal-description"
                                                            >
                                                                <Box sx={style}>
                                                                <div className="handleclose">
                                                                    <Button onClick={() => handleClose()}>Close</Button>
                                                                    </div>
                                                              
                                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                                        {product.title}
                                                                    </Typography>
                                                                    <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                                        {product.shop_name}
                                                                    </Typography>
                                                                    <Typography id="modal-modal-description" sx={{ fontSize: '20px' }}>
                                                                        {distance(product.location)}
                                                                    </Typography>
                                                                    <Button onClick={() => handleMaps(product.location)}>Show on Map</Button>
                                                                </Box>
                                                            </Modal>
                                                        </div>
                                                    </CardBody>
                                                </Col>
                                            ))}

                                    </Row>
                                </div>

                            ))}
                        </React.Fragment>
                    )}


                </div>
            )
            }
        </div >

    );
}


export default Cards;
