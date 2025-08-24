import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./HomePage";
import StudentForm from "./StudentForm";
import ExecutiveForm from "./ExecutiveForm";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import EmployerForm from "./EmployerForm";
import StudentLogin from "./StudentLogin";
import StudentDashboard from "./StudentDashboard";
import CXOLogin from "./CXOLogin";
import CXODashboard from "./CXODashboard";
import ThankYou from "./ThankYou";
import ThankYouCXO from "./ThankYouCXO";
import SetPassword from "./SetPassword";
import RegistrationNotFound from "./RegistrationNotFound";
import EmployerLogin from "./EmployerLogin";

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(() => {
    // Check if admin is already authenticated from localStorage
    return localStorage.getItem("adminAuthenticated") === "true";
  });

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem("adminAuthenticated", "true");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  // Google OAuth Client ID - Replace with your actual client ID
  const GOOGLE_CLIENT_ID = "606908174117-1ggpj6nf4j3kcgnch68om76avvhc7lak.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student-register" element={<StudentForm />} />
          <Route path="/executive-register" element={<ExecutiveForm />} />
          <Route path="/employer-register" element={<EmployerForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/thank-you-cxo" element={<ThankYouCXO />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/registration-not-found" element={<RegistrationNotFound />} />
          <Route
            path="/admin-login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            }
          />
          <Route
            path="/student-login"
            element={<StudentLogin />}
          />
          <Route
            path="/student-dashboard"
            element={<StudentDashboard />}
          />
          <Route
            path="/student-edit"
            element={<StudentForm />}
          />
          <Route
            path="/cxo-login"
            element={<CXOLogin />}
          />
          <Route
            path="/cxo-dashboard"
            element={<CXODashboard />}
          />
          <Route
            path="/cxo-edit"
            element={<ExecutiveForm />}
          />
          <Route
            path="/employer-login"
            element={<EmployerLogin />}
          />
          <Route
            path="/admin-dashboard"
            element={
              isAdminAuthenticated ? (
                <AdminDashboard onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
