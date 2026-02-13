import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ResearcherDashboard from './pages/ResearcherDashboard';
import ExperimentForm from './pages/ExperimentForm';
import { Toaster } from "@/components/ui/toaster"

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />; // Redirect if unauthorized
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/experiments" 
            element={
              <ProtectedRoute role="RESEARCHER">
                <ResearcherDashboard />
              </ProtectedRoute>
            } 
          />

          <Route
              path="/experiments/new"
              element={
                  <ProtectedRoute role="RESEARCHER">
                      <ExperimentForm />
                  </ProtectedRoute>
              }
          />
           <Route
              path="/experiments/edit/:id"
              element={
                  <ProtectedRoute role="RESEARCHER">
                      <ExperimentForm />
                  </ProtectedRoute>
              }
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
