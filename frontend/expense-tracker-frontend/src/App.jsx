import { Routes, Route } from "react-router-dom";
import Start from "./pages/start";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./pages/components/privateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
