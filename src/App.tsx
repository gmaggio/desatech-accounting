import './App.css';
import AppLayout from '@/components/AppLayout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import JournalPage from '@/pages/JournalPage';
import LedgersPage from '@/pages/LedgersPage';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/journal"
                replace
              />
            }
          />
          <Route
            path="/journal"
            element={<JournalPage />}
          />
          <Route
            path="/ledgers"
            element={<LedgersPage />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
