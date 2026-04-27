import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Explore from "./Explore.jsx"; // Isse hum abhi banayenge
import Profile from "./Profile.jsx"; // Isse hum abhi banayenge
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/explore", element: <Explore /> },
  { path: "/profile", element: <Profile /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} theme="dark" />
  </React.StrictMode>,
);
