import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListTopic from "../pages/ListTopic";
import ListInscription from "../pages/ListInscription";
import ListStudents from "../pages/ListStudents";
import ListGroups from "../pages/ListGroups";
import Login from "../pages/Login";
import SecondValidate from "../pages/SecondValidate";
import SaveStudent from "../pages/SaveStudent";
import ListFaculties from "../pages/ListFaculties";
import { CheckAuth, CheckAuthSecondValidation } from "../middleware/CheckAuth";
import { Error404 } from "../pages/Error404";
import StudentInscription from "../pages/StudentInscription";
import TopicInscription from "../pages/TopicInscription";
import DataUser from "../pages/DataUser";

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
        <Route
          exact
          path="/listTopic"
          element={
            <CheckAuth requiredType="admin">
              <ListTopic />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/listStudents"
          element={
            <CheckAuth requiredType="admin">
              <ListStudents />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/listInscription"
          element={
            <CheckAuth requiredType="admin">
              <ListInscription />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/listGroups"
          element={
            <CheckAuth requiredType="admin">
              <ListGroups />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/saveStudent"
          element={
            <CheckAuth requiredType="admin">
              <SaveStudent />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/listFaculties"
          element={
            <CheckAuth requiredType="admin">
              <ListFaculties />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/studentInscription"
          element={
            <CheckAuth requiredType="student">
              <StudentInscription />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/userInformation"
          element={
            <CheckAuth requiredType="student">
              <DataUser />
            </CheckAuth>
          }
        />
        <Route
          exact
          path="/TopicInscription"
          element={
            <CheckAuth requiredType="student">
              <TopicInscription />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
