import React from "react";
import { Link } from 'react-router-dom';
import './Cards.css';

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <div className="cards">
                  <Link to="/admin" className="card-link">
                    <div className="card">
                      <h2>Admin</h2>
                      <p>See Inventory</p>

                    </div>
                  </Link>
                  <Link to="/shop" className="card-link">
                    <div className="card">
                      <h2>User</h2>
                      <p>Manage My Inventory</p>

                    </div>
                  </Link>
                 
                 
                </div>
                {/* <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Learn More
                </a>{" "} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
