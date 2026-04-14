import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx"; // Step 1: Dashboard import kiya
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Step 2: Router mein update kiya
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Register page
  },
  {
    path: "/login",
    element: <Login />, // Login page
  },
  {
    path: "/dashboard",
    element: <Dashboard />, // Ab yahan Dashboard component dikhega
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
