import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ListTopic from "../pages/ListTopic";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Dashboard} />
        <Route exact path="/listTopic" Component={ListTopic} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
