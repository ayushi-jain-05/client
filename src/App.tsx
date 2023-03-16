import { Routes, Route, Navigate } from "react-router-dom";
import {  useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./App.css";
import Profile from "./pages/Profile/Profile";
function App() {
  const loggedInUser: string = JSON.parse(localStorage.getItem("email") as string)
  return (
    <div className="container">
      <Routes>
        <Route path="/profile" element={
        loggedInUser? (
          <Profile />
        ) : (
          <Navigate to="/login" />
        )
      }/>
        
        <Route
           path="/"
          element={
            loggedInUser ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/data/profile" element={<Home />} />

      </Routes>
    </div>
  );
}
export default App;


