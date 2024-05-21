import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes/Router.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/boostrap.css";
import "./assets/style.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';

ReactDOM.createRoot(document.getElementById("root")).render(<Router />);
