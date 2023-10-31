import React, { useState } from 'react';
import './registershop.css'

const ShopForm = () => {
    const [shopname, setShopname] = useState('');
    const [location, setLocation] = useState('');
    const [shopowner, setShopowner] = useState('');
    const [shopemail, setShopemail] = useState('');
    const [shopphoneno, setShopphoneno] = useState('');

    const handleShopnameChange = (event) => {
        setShopname(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleShopownerChange = (event) => {
        setShopowner(event.target.value);
    };

    const handleShopemailChange = (event) => {
        setShopemail(event.target.value);
    };

    const handleShopphonenoChange = (event) => {
        setShopphoneno(event.target.value);
    };

    const handleMapButtonClick = () => {
        // Redirect the user to Google Maps to select a location
        window.location.href = 'https://www.google.com/maps';
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Perform form submission or API call with the collected data
        // Example: You can make an API request to save the data in a backend database

        // Clear the form after submission
        setShopname('');
        setLocation('');
        setShopowner('');
        setShopemail('');
        setShopphoneno('');
    };

    return (
        <div className="containerer">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="shopname" className="label">Shop Name:</label>
                    <input
                        type="text"
                        id="shopname"
                        className="input"
                        value={shopname}
                        onChange={handleShopnameChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location" className="label">Location:</label>
                    <input
                        type="text"
                        id="location"
                        className="input"
                        value={location}
                        onChange={handleLocationChange}
                        required
                    />
                    <div className="select-location">
                        <button type="button" onClick={handleMapButtonClick}>Select Location</button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="shopowner" className="label">Shop Owner:</label>
                    <input
                        type="text"
                        id="shopowner"
                        className="input"
                        value={shopowner}
                        onChange={handleShopownerChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shopemail" className="label">Shop Email:</label>
                    <input
                        type="email"
                        id="shopemail"
                        className="input"
                        value={shopemail}
                        onChange={handleShopemailChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shopphoneno" className="label">Shop Phone Number:</label>
                    <input
                        type="tel"
                        id="shopphoneno"
                        className="input"
                        value={shopphoneno}
                        onChange={handleShopphonenoChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Submit</button>
            </form>
        </div>
    );
};

export default ShopForm;
