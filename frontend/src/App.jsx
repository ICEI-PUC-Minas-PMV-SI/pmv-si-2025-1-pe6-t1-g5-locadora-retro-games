import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Games } from './pages/Games';
import { Consoles } from './pages/Consoles';
import { Orders } from './pages/Orders';
import { Users } from './pages/Users';

const isAuthenticated = () => {
  return localStorage.getItem('token');
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
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
    </Router>
  );
}
