import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ListTopic from "../pages/ListTopic";
import Student from "../pages/Student";
import ListStudents from "../pages/ListStudents";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Dashboard} />
        <Route exact path="/listTopic" Component={ListTopic} />
        <Route exact path="/listStudents" Component={ListStudents} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
