import React, { useState, useEffect } from "react";
import './adminpage.css';
import { API_ENDPOINT_1 } from "./apis/api";

const FirearmTable = () => {
 
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const API_ENDPOINT = `${API_ENDPOINT_1}/apis/ecommerce/none/`;

  useEffect(() => {
    // Define an asynchronous function to fetch the data
    async function fetchData() {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
    
        // Assuming jsonData is an array of objects, as suggested in the previous code
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    

    fetchData();
  }, []); // The empty dependency array means this effect runs once, similar to componentDidMount


 return (
    <div className="firearm-table">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Item Type</th>
            <th>Type</th>
            <th>Taken</th>
            <th>Returned</th>
            
          </tr>
        </thead>
        <tbody>
          {data.length > 0 && data.map((item, itemIndex) => (
            <tr key={itemIndex}>
              {itemIndex === 0 ? (
                <td rowSpan={data.filter(user => user.user === item.user).length}>
                  {item.user}
                </td>
              ) : null}
              <td>{item.item_type}</td>
              <td>{item.type}</td>
              <td>{item.taken}</td>
              <td>{item.returned}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FirearmTable;
