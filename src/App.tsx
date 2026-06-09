import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';

/** App routes. Add a route here only for genuinely new page types. */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/subject/:subjectId" element={<SubjectPage />} />
      {/* Unknown paths fall back to the dashboard. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
