import React from "react";
import { Routes, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

import Homepage from "./pages/homepage/Homepage";
import Orders from "./pages/orders/Orders";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import MyGigs from "./pages/myGigs/MyGigs";
import Add from "./pages/add/Add";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Success from "./pages/success/Success";
import Pay from "./pages/pay/Pay";

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />

        {/* Authentication */}
        <Route path="/signin" element={<Login />} />
        <Route path="/join" element={<Register />} />

        {/* Gigs */}
        <Route path="/gigs" element={<Gigs />} />
        <Route path="/gigs/:id" element={<Gig />} />

        {/* Orders */}
        <Route path="/orders" element={<Orders />} />

        {/* My Gigs */}
        <Route path="/myGigs" element={<MyGigs />} />

        {/* Add Gig */}
        <Route path="/add" element={<Add />} />

        {/* Messages */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<Message />} />

        {/* Payment */}
        <Route path="/pay/:id" element={<Pay />} />

        {/* Success */}
        <Route path="/success" element={<Success />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ padding: "50px", textAlign: "center" }}>
              <h1>404</h1>
              <p>Page not found</p>
            </div>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;