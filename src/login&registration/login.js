import React, { useState, useContext } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './loginregister.css';
import { AuthContext } from '../AuthContext';
import { API_ENDPOINT_1 } from '../apis/api';

function LoginRegistrationPage() {

    const [justifyActive, setJustifyActive] = useState('tab1');;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { user, isLoggedIn, login, logout, setToken } = useContext(AuthContext);


    const handleJustifyClick = (value) => {
        if (value === justifyActive) {
            return;
        }

        setJustifyActive(value);
    };
    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(`${API_ENDPOINT_1}/apis/login/`, {
                username: username,
                password: password,
            });
            const token = response.data.token; // Assuming the token key is 'token' in the response

            // Save the token to the AuthContext
            
            login(username, token);
            navigate('/')


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


    return (
        <div className='loginregister'>
            <MDBContainer fluid className="p-3 my-5 h-custom">

                <MDBRow>

                    <MDBCol col='10' md='6'>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid" alt="Sample image" />
                    </MDBCol>

                    <MDBCol col='4' md='6'>



                        <form onSubmit={handleLogin}>
                            <MDBInput wrapperClass='mb-4' placeholder="Username" label='Username' id='formControlLg' type='text' size='lg' onChange={(e) => setUsername(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' placeholder='Password' label='Password' id='formControlLg' type='password' size="lg" onChange={(e) => setPassword(e.target.value)} />
                            <div className='errorsnlinks'>
                            <p className='error-message'>{errorMessage}</p>
                            <a href="!#">Forgot password?</a>
                            </div>



                            

                            <div className='text-center text-md-start mt-4 pt-2'>
                                <MDBBtn type="submit" className="mb-0 px-5" size='lg'>Login</MDBBtn>
                                <div className="divider d-flex align-items-center my-4">
                                    <p className="text-center fw-bold mx-3 mb-0">Or</p>
                                </div>
                                <div className="d-flex flex-row">

                                    <p className="lead fw-normal mb-0 me-3">Sign in with</p>

                                    <MDBBtn floating size='md' tag='a' className='me-2'>
                                        <MDBIcon fab icon='google' />
                                    </MDBBtn>

                                    <MDBBtn floating size='md' tag='a' className='me-2'>
                                        <MDBIcon fab icon='twitter' />
                                    </MDBBtn>

                                    <MDBBtn floating size='md' tag='a' className='me-2'>
                                        <MDBIcon fab icon='linkedin-in' />
                                    </MDBBtn>

                                </div>

                                <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/register" className="link-danger">Register</Link></p>
                            </div>
                        </form>
                    </MDBCol>

                </MDBRow>



            </MDBContainer>

        </div>
    );
}

export default LoginRegistrationPage;