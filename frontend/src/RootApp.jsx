import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Games } from "./pages/Games";
import { Consoles } from "./pages/Consoles";
import { Orders } from "./pages/Orders";
import { Users } from "./pages/Users";
import { setNavigate } from "./utils/navigateHelper";

const isAuthenticated = () => {
  return localStorage.getItem("token");
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/jogos" element={<Games />} />
        <Route path="/consoles" element={<Consoles />} />
        <Route path="/reservas" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
