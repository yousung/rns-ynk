import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore.js';
import Layout from './components/layout/Layout.jsx';
import Login from './pages/Login.jsx';
import InboundSchedule from './pages/InboundSchedule.jsx';
import InboundExecute from './pages/InboundExecute.jsx';
import OutboundSchedule from './pages/OutboundSchedule.jsx';
import OutboundExecute from './pages/OutboundExecute.jsx';
import Inventory from './pages/Inventory.jsx';
import Products from './pages/Products.jsx';
import ActivityLog from './pages/ActivityLog.jsx';
import Users from './pages/Users.jsx';
import Settings from './pages/Settings.jsx';
import Dashboard from './pages/Dashboard.jsx';

function RequireAuth({ children }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inbound-schedule"  element={<InboundSchedule />} />
          <Route path="inbound-execute"   element={<InboundExecute />} />
          <Route path="outbound-schedule" element={<OutboundSchedule />} />
          <Route path="outbound-execute"  element={<OutboundExecute />} />
          <Route path="inventory"         element={<Inventory />} />
          <Route path="products"          element={<Products />} />
          <Route path="activity-log"      element={<ActivityLog />} />
          <Route path="users"             element={<Users />} />
          <Route path="settings"          element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
