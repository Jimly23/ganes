import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PaketTourList from './pages/PaketTour/List';
import PaketTourForm from './pages/PaketTour/Form';
import TourList from './pages/Tour/List';
import TourForm from './pages/Tour/Form';
import EventList from './pages/Event/List';
import EventForm from './pages/Event/Form';
import UserAdminList from './pages/UserAdmin/List';
import UserAdminForm from './pages/UserAdmin/Form';
import ArticleList from './pages/Article/List';
import ArticleForm from './pages/Article/Form';

const Layout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="paket-tours" element={<PaketTourList />} />
          <Route path="paket-tours/create" element={<PaketTourForm />} />
          <Route path="paket-tours/:id/edit" element={<PaketTourForm />} />
          
          <Route path="tours" element={<TourList />} />
          <Route path="tours/create" element={<TourForm />} />
          <Route path="tours/:id/edit" element={<TourForm />} />
          
          <Route path="events" element={<EventList />} />
          <Route path="events/create" element={<EventForm />} />
          <Route path="events/:id/edit" element={<EventForm />} />
          
          <Route path="users" element={<UserAdminList />} />
          <Route path="users/create" element={<UserAdminForm />} />
          <Route path="users/:id/edit" element={<UserAdminForm />} />

          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/create" element={<ArticleForm />} />
          <Route path="articles/:id/edit" element={<ArticleForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
