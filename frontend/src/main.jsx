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
import AdminHistory from "./components/admin/AdminHistory";
import UserAttendanceCalendar from "./components/admin/CARDS/UserAttendanceCalendar";
import UserHistory from "./components/User/UserHistory";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import AboutUs from "./components/common/AboutUs";
import ContactUs from "./components/common/ContactUs";
import PrivacyPolicy from "./components/common/PrivacyPolicy";
import ReturnPolicy from "./components/common/ReturnPolicy";
import RefundPolicy from "./components/common/RefundPolicy";
import Disclaimer from "./components/common/Disclaimer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <UserHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "return-policy",
        element: <ReturnPolicy />,
      },
      {
        path: "refund-policy",
        element: <RefundPolicy />,
      },
      {
        path: "disclaimer",
        element: <Disclaimer />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "attendance", element: <View_Attends /> },
          { path: "history", element: <AdminHistory /> },
          { path: "calendar", element: <UserAttendanceCalendar /> },
          { path: "meals", element: <Edit_Meal /> },
          { path: "members", element: <Members /> },
          { path: "payments", element: <Payments /> },
        ],
      },
    ],
  },

  {
    path: "Login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>,
);
