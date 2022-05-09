import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import Courses from "./pages/Courses/Courses";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='courses' element={<Courses />} />
          <Route path='/*' element={Login} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
