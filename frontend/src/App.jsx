import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Notes from "./pages/Notes";
import Signup from "./pages/Signup";
import NoteDetails from "./pages/NoteDetails";
import NotFound from "./pages/NotFound";
import VerifyOtp from "./pages/VerifyOtp";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Notes />} />
        <Route path="/notes/new" element={<NoteDetails />} />
        <Route path="/notes/:noteId" element={<NoteDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
