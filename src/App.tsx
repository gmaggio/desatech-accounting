import AppLayout from '@/components/AppLayout';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ITEMS } from '@/shared/constants';
import LedgersPage from '@/pages/LedgersPage';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route
            path="/"
            element={<JournalPage />}
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
