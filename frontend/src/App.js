import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Login } from './pages/Login';
import { GamesManagement } from './pages/GamesManagement';

const isAuthenticated = () => {
  // TODO
  return localStorage.getItem('token') !== null;
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
          <Route path="/" element={<GamesManagement />} />
          <Route path="/games" element={<GamesManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
