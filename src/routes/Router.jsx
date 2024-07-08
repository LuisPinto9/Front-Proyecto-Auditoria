import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListTopic from "../pages/ListTopic";
import ListInscription from "../pages/ListInscription";
import ListStudents from "../pages/ListStudents";
import ListGroups from "../pages/ListGroups";
import Login from "../pages/Login";
import SecondValidate from "../pages/SecondValidate";
import SaveStudent from "../pages/SaveStudent";
import { CheckAuth, CheckAuthSecondValidation } from "../middleware/CheckAuth";
import { Error404 } from "../pages/Error404";
import StudentInscription from "../pages/StudentInscription";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Login} />
        <Route path="*" element={<Error404 />} />
        <Route
          exact
          path="/secondValidation"
          element={
            <CheckAuthSecondValidation>
              <SecondValidate />
            </CheckAuthSecondValidation>
          }
        />
        <Route exact path="/listTopic" Component={ListTopic} />
        <Route
          exact
          path="/listStudents"
          element={
            // <CheckAuth requiredType="admin">
              <ListStudents />
            // </CheckAuth>
          }
        />
        <Route exact path="/listInscription" Component={ListInscription} />
        <Route exact path="/listGroups" Component={ListGroups} />
        <Route exact path="/saveStudent" Component={SaveStudent} />
        <Route exact path="/studentInscription" element={<StudentInscription/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
