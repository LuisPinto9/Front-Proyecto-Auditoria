import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ListTopic from "../pages/ListTopic";
import ListInscription from "../pages/ListInscription";
import ListStudents from "../pages/ListStudents";
import ListGroups from "../pages/ListGroups";
import Login from "../pages/Login";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/" Component={ListStudents} />
      <Route exact path="/login" Component={Login} />
        {/* <Route exact path="/" Component={Dashboard} /> */}
        <Route exact path="/listTopic" Component={ListTopic} />
        {/* <Route exact path="/listStudents" Component={ListStudents} /> */}
        <Route exact path="/listInscription" Component={ListInscription} />
        <Route exact path="/listGroups" Component={ListGroups} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
