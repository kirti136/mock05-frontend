import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignupLogin from "./Pages/SignupLogin";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignupLogin />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
