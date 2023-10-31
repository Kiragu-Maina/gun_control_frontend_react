import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../components/Header";

import MarketPlace from "../../../ControlPlace";
import { API_ENDPOINT_1 } from "../../../apis/api";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from '../../../AuthContext';
import Modal from 'react-modal';


import './index.css';
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  // const { user } = useContext(AuthContext);
  const user = localStorage.getItem('user');

  
  const shopname = localStorage.getItem('shopname');
  const [returnedProducts, setReturnedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantityToReturn, setQuantityToReturn] = useState(0);

  const handleReturnClick = (product) => {
    setSelectedProduct(product);
    setQuantityToReturn(0);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  const handleReturnSubmit = () => {
    // Prepare the data to send
    const dataToSend = {
      productId: selectedProduct.id,
      QuantityToReturn: quantityToReturn,
      shopname:shopname, // Make sure the key matches what your API expects
    };
  
    // Send a POST request to your API endpoint
    fetch(`${API_ENDPOINT_1}/apis/return/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Handle the response from the server as needed
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
  
    // Close the modal
    handleModalClose();
  };
  
  const customModalStyles = {
    content: {
      width: '300px', // Set the width to your desired size
      margin: 'auto',
      padding: '100px 20px 20px 20px', // Add padding to the top, right, bottom, and left sides
      backgroundColor: '#1F2A40',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color and opacity
    },
  };


  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(`${API_ENDPOINT_1}/apis/ecommerce/${user}`)
      .then(response => response.json())
      .then(result => {
        // Add the editing property to each product
        const productsWithEditing = result.map(product => ({
          ...product,
          editing: false
        }));
        setData(productsWithEditing);
        setProducts(productsWithEditing);
        setLoading(false); // Set loading to false after data is fetched
      });

    // Create an EventSource to listen for SSE events
    const eventSource = new EventSource(`${API_ENDPOINT_1}/events/`);
    eventSource.onmessage = e => {

      // You can trigger a new fetch or update the UI based on the SSE event
      fetch(`${API_ENDPOINT_1}/apis/ecommerce/${user}`)
        .then(response => response.json())
        .then(result => {
          const productsWithEditing = result.map(product => ({
            ...product,
            editing: false
          }));
          setData(productsWithEditing);
          setProducts(productsWithEditing);
        });
    };

    // Cleanup: Close the EventSource connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    
    <Box m="30px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome" />
        <Box fontstyle="italic" m="20px">
          <p>{shopname}</p>
        </Box>


      </Box>

      {/* GRID & CHARTS */}
      <Box
        className="responsiveBox"
      >
        {/* ROW 1 */}







        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          display="flex" /* Set display to flex */
          flexDirection="column"
          minHeight="200%"
        /* Stack child elements vertically */
        >
          <Box
            className="marketplace"
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Your content inside the Box */}
          </Box>
          <Box flex="1" /* Allow this Box to grow with its parent flex container */>
            <MarketPlace />
          </Box>
        </Box>
        <Box

          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
             Logged Items(Click on item to return)
            </Typography>
          </Box>

          <table id="tablemarket" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr id="rowrow">
          <th style={{ border: '1px solid', padding: '8px' }}>Item</th>
          <th style={{ border: '1px solid', padding: '8px' }}>Type</th>
          <th style={{ border: '1px solid', padding: '8px' }}>Quantity</th>
          <th style={{ border: '1px solid', padding: '8px' }}>Returned</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr id="rowrowrow" key={product.id}>
            <td
              onClick={() => handleReturnClick(product)}
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
              {product.title}
            </td>
            <td>{product.category}</td>
            <td>{product.quantity}</td>
            <td>{product.returned}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <Modal
      isOpen={selectedProduct !== null}
      onRequestClose={handleModalClose}
      contentLabel="Return Product"
      style={customModalStyles} // Apply custom styling
    >
      <h2 style={{ color: 'white' }}>{selectedProduct ? selectedProduct.title : ''}</h2>
      <p style={{ color: 'white' }}>Type: {selectedProduct ? selectedProduct.category : ''}</p>
      <label style={{ color: 'white' }} htmlFor="quantityToReturn">
        Enter Quantity to Return:
      </label>
      <input
        type="number"
        id="quantityToReturn"
        value={quantityToReturn}
        onChange={(e) => setQuantityToReturn(e.target.value)}
        style={{ color: 'black' }}
      />
      <button onClick={handleReturnSubmit}>
        Submit
      </button>
      <button onClick={handleModalClose}>
        Cancel
      </button>
    </Modal>



        </Box>


        {/* ROW 3 */}



      </Box>
    </Box>
  );
};

export default Dashboard;
