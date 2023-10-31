import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><Link to="/home">Home</Link></li>
                <li className="navbar-item"><a href="#">About</a></li>
                <li className="navbar-item"><a href="#">Contact</a></li>
                <li className="navbar-item"><Link to="/marketplace">Seller Marketplace</Link></li>

                <li className="navbar-item"><Link to="/login">Sign In</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
