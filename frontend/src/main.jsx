import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import AdminLayout from "./components/admin/AdminLayout";
import { View_Attends } from "./components/admin/CARDS/View_Attends";
import { Members } from "./components/admin/CARDS/Members";
import { Edit_Meal } from "./components/admin/CARDS/Edit_Meal";
import { Payments } from "./components/admin/CARDS/Payments";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/common/Login";
import Register from "./components/common/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> }, // 👈 default admin page
          { path: "attendance", element: <View_Attends /> },
          { path: "meals", element: <Edit_Meal /> },
          { path: "members", element: <Members /> },
          { path: "payments", element: <Payments /> },
        ],
      },
    ],
  },

  {
    path:"Login",
    element:<Login />
  },
  {
    path:"register",
    element:<Register />
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
