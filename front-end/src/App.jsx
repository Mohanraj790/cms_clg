import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CSE from "./pages/departments/CSE";
import ECE from "./pages/departments/ECE";
import IT from "./pages/departments/IT";
import AI_DS from "./pages/departments/AI_DS";
import Biomedical from "./pages/departments/Biomedical";
import CyberSecurity from "./pages/departments/CyberSecurity";
import Mechanical from "./pages/departments/Mechanical";
import Humanities from "./pages/departments/Humanities";
import Agricultural from "./pages/departments/Agricultural";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Departments */}
      <Route path="/dashboard/departments/cse" element={<CSE />} />
      <Route path="/dashboard/departments/ece" element={<ECE />} />
      <Route path="/dashboard/departments/it" element={<IT />} />
      <Route path="/dashboard/departments/ai_ds" element={<AI_DS />} />
      <Route path="/dashboard/departments/biomedical" element={<Biomedical />} />
      <Route path="/dashboard/departments/cybersecurity" element={<CyberSecurity />} />
      <Route path="/dashboard/departments/mechanical" element={<Mechanical />} />
      <Route path="/dashboard/departments/humanities" element={<Humanities />} />
      <Route path="/dashboard/departments/agricultural" element={<Agricultural />} />
    </Routes>
  );
}

export default App;
