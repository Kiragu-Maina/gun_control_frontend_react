import React, { useState, useContext } from 'react';
import { useForm } from "react-cool-form";
import { AuthContext } from '../AuthContext';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT_1 } from '../apis/api';
import './entry.css';

const Field = ({ label, id, ...rest }) => (
    <div className="form-field">
        <p htmlFor={id}>{label}</p>
        <input id={id} {...rest} />
    </div>
);

const Select = ({ label, id, children, ...rest }) => (
    <div className="form-field">
        <label htmlFor={id}>{label}</label>
        <select id={id} {...rest}>
            {children}
        </select>
    </div>
);

const Textarea = ({ label, id, ...rest }) => (
    <div className="form-field">
        <p htmlFor={id}>{label}</p>
        <textarea id={id} {...rest} />
    </div>
);



const CreateShopPage = () => {
    const [shopName, setShopName] = useState('');
    const [shopLocation, setShopLocation] = useState('');
    const [shopPhoneNo, setShopPhoneNo] = useState('');
    const [shopEmail, setShopEmail] = useState('');
    const { user, shopname, setShopname } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('user');

    const handleCreateShop = async (values, options, e) => {



        try {


            const response = await axios.post(`${API_ENDPOINT_1}/apis/createshop/`, {

                shop_owner: username,
                shopname: shopName,
                location: shopLocation,
                phone_no: shopPhoneNo,
                email: shopEmail,

            });
            
            localStorage.setItem('shopname',shopName);
            navigate('/shop');

            console.log(response.data); // Handle success response
        } catch (error) {
            if (error.response) {
                console.log(error.response.data); // Handle error response
                setErrorMessage(error.response.data.message); // Store error message in state
            } else {
                console.log('An error occurred:', error.message); // Handle generic error
                setErrorMessage('An error occurred. Please try again.'); // Store generic error message in state
            }
        }
    };

    const { form, use } = useForm({
        defaultValues: { shopName: "", shopLocation: "", shopPhoneNo: "", shopEmail: "" },
        onSubmit: handleCreateShop,
        onError: (errors, options, e) => {
            console.log("onError: ", errors);
        }
    });

    const isSubmitting = use("isSubmitting");

    return (
        <div className="create-shop-page">
        <h3>Seems you don't have a profile yet. Create one by filling in the form below|\|/|</h3>
            <h1>------------------------------------------------------------------</h1>
            <form ref={form} noValidate onSubmit={handleCreateShop}>
                <Field label="Name" id="shop-name" name="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                <Field label="Primary Address" id="shop-location" name="shopLocation" value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} />
                <Field label="Phone Number" id="shop-phoneno" name="shopPhoneNo" value={shopPhoneNo} onChange={(e) => setShopPhoneNo(e.target.value)} />
                <Field label="Email" id="shop-email" name="shopEmail" value={shopEmail} onChange={(e) => setShopEmail(e.target.value)} />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Create Profile"}
                </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default CreateShopPage;
