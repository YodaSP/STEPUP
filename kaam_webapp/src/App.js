import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import StudentForm from "./StudentForm";
import ExecutiveForm from "./ExecutiveForm";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const App = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student-register" element={<StudentForm />} />
        <Route path="/executive-register" element={<ExecutiveForm />} />
        <Route
          path="/admin-login"
          element={<AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />}
        />
        <Route
          path="/admin-dashboard"
          element={
            isAdminAuthenticated ? (
              <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
