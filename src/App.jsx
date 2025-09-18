import { Routes, Route } from "react-router-dom";

// User-facing components
import Welcome from "./Entry/Welcome"
import AuthPage from "./Entry/AuthPage";

import CompleteProfile from "./Entry/CompleteProfile";
import Navbar from "./Reuseable/Navbar";
import Footer from "./Reuseable/Footer";
import Dashboard from "./Dashboard/Dashboard";
import Flashcard from "./Flashcard/Flashcard";
import Streaks from "./Flashcard/Streaks";
import ForgotPasswordPage from "./Entry/ForgotPassword";
import UpdatePasswordPage from "./Entry/UpdatePassword";
// Admin components
import AdminDashboard from "./Admin/AdminDashboard";
import SubjectList from "./Admin/components/SubjectList";
import SubjectForm from "./Admin/components/SubjectForm";
import QuestionList from "./Admin/components/QuestionList";
import QuestionForm from "./Admin/components/QuestionForm";
import UsersPage from "./Admin/UsersPage";
import StreaksPage from "./Flashcard/StreaksPage";
import ProfilePage from "./Entry/ProfilePage";
import ActiveUsers from "./Admin/components/ActiveUsers";
import AdminSettings from "./Admin/components/AdminSettings";
// Protected Route component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* User-facing routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<AuthPage type="login" />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profilepage" element={
        <ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>
      } />
      <Route path="/flashcard" element={
        <ProtectedRoute>
          <Flashcard />
        </ProtectedRoute>
      } />
      <Route path="/streaks" element={
        <ProtectedRoute>
          <StreaksPage />
        </ProtectedRoute>
      } />


      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/activeusers" element={
        <ProtectedRoute requiredRole="admin">
          <ActiveUsers />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/adminsettings" element={
        <ProtectedRoute requiredRole="admin">
          <AdminSettings/>
        </ProtectedRoute>
      } />
      <Route path="admin/users" element={
        <ProtectedRoute requiredRole="admin">
          <UsersPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects" element={
        <ProtectedRoute requiredRole="admin">
          <SubjectList />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects/add" element={
        <ProtectedRoute requiredRole="admin">
          <SubjectForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects/edit/:subjectId" element={
        <ProtectedRoute requiredRole="admin">
          <SubjectForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects/:id/questions" element={
        <ProtectedRoute requiredRole="admin">
          <QuestionList />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects/:id/questions/add" element={
        <ProtectedRoute requiredRole="admin">
          <QuestionForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/subjects/:id/questions/edit/:qid" element={
        <ProtectedRoute requiredRole="admin">
          <QuestionForm />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;