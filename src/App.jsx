import { Routes, Route } from "react-router-dom";

// User-facing components
import Welcome from "./Entry/Welcome";
import AuthPage from "./Entry/AuthPage";
import Login from "./Entry/Login";
import OtpVerify from "./Entry/Otp-verify";
import CompleteProfile from "./Entry/Complete-profile";
import Navbar from "./Reuseable/Navbar";
import Footer from "./Reuseable/Footer";
import Dashboard from "./Dashboard/Dashboard";
import Flashcard from "./Flashcard/Flashcard";
import Streaks from "./Flashcard/Streaks";

// Admin components
import AdminDashboard from "./Admin/AdminDashboard";
import SubjectList from "./Admin/components/SubjectList";
import SubjectForm from "./Admin/components/SubjectForm";
import QuestionList from "./Admin/components/QuestionList";
import QuestionForm from "./Admin/components/QuestionForm";

function App() {
  return (
    <Routes>
      {/* User-facing routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<AuthPage type="login" />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
      <Route path="/otp-verify" element={<OtpVerify />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/flashcard" element={<Flashcard />} />
      <Route path="/streaks" element={<Streaks />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/subjects" element={<SubjectList />} />
      <Route path="/admin/subjects/add" element={<SubjectForm />} />
      <Route path="/admin/subjects/edit/:subjectId" element={<SubjectForm />} />
      <Route path="/admin/subjects/:id/questions" element={<QuestionList />} />
      <Route path="/admin/subjects/:id/questions/add" element={<QuestionForm />} />
      <Route path="/admin/subjects/:id/questions/edit/:qid" element={<QuestionForm />} />
    </Routes>
  );
}

export default App;
