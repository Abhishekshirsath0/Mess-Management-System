import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { RingLoader } from "react-spinners";

// LAZY LOADED ROUTE COMPONENTS
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const ViewAttendsWrapper = lazy(() =>
  import("./components/admin/CARDS/View_Attends").then((module) => ({
    default: module.View_Attends,
  }))
);
const MembersWrapper = lazy(() =>
  import("./components/admin/CARDS/Members").then((module) => ({
    default: module.Members,
  }))
);
const EditMealWrapper = lazy(() =>
  import("./components/admin/CARDS/Edit_Meal").then((module) => ({
    default: module.Edit_Meal,
  }))
);
const PaymentsWrapper = lazy(() =>
  import("./components/admin/CARDS/Payments").then((module) => ({
    default: module.Payments,
  }))
);
const AdminHistory = lazy(() => import("./components/admin/AdminHistory"));
const UserAttendanceCalendar = lazy(() =>
  import("./components/admin/cards/UserAttendanceCalendar")
);
const MarkAbsence = lazy(() =>
  import("./components/admin/cards/MarkAbsence")
);
const UserHistory = lazy(() => import("./components/User/UserHistory"));
const Login = lazy(() => import("./components/common/Login"));
const Register = lazy(() => import("./components/common/Register"));
const ForgotPassword = lazy(() => import("./components/common/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/common/ResetPassword"));
const AboutUs = lazy(() => import("./components/common/AboutUs"));
const ContactUs = lazy(() => import("./components/common/ContactUs"));
const PrivacyPolicy = lazy(() => import("./components/common/PrivacyPolicy"));
const ReturnPolicy = lazy(() => import("./components/common/ReturnPolicy"));
const RefundPolicy = lazy(() => import("./components/common/RefundPolicy"));
const Disclaimer = lazy(() => import("./components/common/Disclaimer"));

const PageFallback = () => (
  <div className="flex justify-center items-center py-24">
    <RingLoader color="#6366f1" size={50} />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              <UserHistory />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageFallback />}>
            <AboutUs />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<PageFallback />}>
            <ContactUs />
          </Suspense>
        ),
      },
      {
        path: "privacy-policy",
        element: (
          <Suspense fallback={<PageFallback />}>
            <PrivacyPolicy />
          </Suspense>
        ),
      },
      {
        path: "return-policy",
        element: (
          <Suspense fallback={<PageFallback />}>
            <ReturnPolicy />
          </Suspense>
        ),
      },
      {
        path: "refund-policy",
        element: (
          <Suspense fallback={<PageFallback />}>
            <RefundPolicy />
          </Suspense>
        ),
      },
      {
        path: "disclaimer",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Disclaimer />
          </Suspense>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "attendance",
            element: (
              <Suspense fallback={<PageFallback />}>
                <ViewAttendsWrapper />
              </Suspense>
            ),
          },
          {
            path: "absence",
            element: (
              <Suspense fallback={<PageFallback />}>
                <MarkAbsence />
              </Suspense>
            ),
          },
          {
            path: "history",
            element: (
              <Suspense fallback={<PageFallback />}>
                <AdminHistory />
              </Suspense>
            ),
          },
          {
            path: "calendar",
            element: (
              <Suspense fallback={<PageFallback />}>
                <UserAttendanceCalendar />
              </Suspense>
            ),
          },
          {
            path: "meals",
            element: (
              <Suspense fallback={<PageFallback />}>
                <EditMealWrapper />
              </Suspense>
            ),
          },
          {
            path: "members",
            element: (
              <Suspense fallback={<PageFallback />}>
                <MembersWrapper />
              </Suspense>
            ),
          },
          {
            path: "payments",
            element: (
              <Suspense fallback={<PageFallback />}>
                <PaymentsWrapper />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "Login",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "login",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "register",
    element: (
      <Suspense fallback={<PageFallback />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "forgot-password",
    element: (
      <Suspense fallback={<PageFallback />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "ForgotPassword",
    element: (
      <Suspense fallback={<PageFallback />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: "reset-password/:token",
    element: (
      <Suspense fallback={<PageFallback />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: "ResetPassword/:token",
    element: (
      <Suspense fallback={<PageFallback />}>
        <ResetPassword />
      </Suspense>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </ThemeProvider>
);
