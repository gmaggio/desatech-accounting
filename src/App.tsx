import Layout from '@/app/layout';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ITEMS } from '@/shared/constants';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<div>{ITEMS[0].title} Page</div>}
          />

          {ITEMS.map((item) => (
            <Route
              key={item.url}
              path={item.url}
              element={<div>{item.title} Page</div>}
            />
          ))}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
