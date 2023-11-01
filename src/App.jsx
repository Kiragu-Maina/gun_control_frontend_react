import React, { useState } from "react";
import Navigation from "./components/navigation";
import { Header } from "./components/header";


import SmoothScroll from "smooth-scroll";
import { Routes, Route, useLocation } from 'react-router-dom';
import "./App.css";


import Cards from './cards';

import LoginRegistrationPage from './login&registration/login';
import Register from "./login&registration/register";
import ShopDashboard from "./shop/shopdashboard";
import CreateShopPage from './shop/entry';
import FirearmTable from './adminpage';



export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

function App() {

  const location = useLocation();


  const [landingPageData, setLandingPageData] = useState({});
 
  
  return (
    <div>
      <div className='navigation'><Navigation /></div>
      <div className='othercomponents'>

        <Routes>
          {/* Render Rates component when the URL is "/rates" */}
          <Route path="/admin" element={<FirearmTable />} />
          <Route path="/ecommerce" element={<Cards />} />
          
          <Route path='/login' element={<LoginRegistrationPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/shop/*' element={<ShopDashboard />} />
          <Route path='/entry' element={<CreateShopPage />} />

          {/* Render Header component for all other URLs */}
          {location.pathname !== '/admin' && (
            <Route path="/" element={<Header data={landingPageData.Header} />} />
          )}
        </Routes>

        {location.pathname !== '/admin' && location.pathname !== '/ecommerce' && location.pathname !== '/suppliers' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/shop' && location.pathname !== '/entry' && (
          <div>

       

          </div>
        )}
      </div>





    </div>

  );
};

export default App;
