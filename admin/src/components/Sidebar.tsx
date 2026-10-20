import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, MapPin, Calendar, Users, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Ganes Tour" />
      </div>
      
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/paket-tours" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Map size={20} />
          <span>Paket Tour</span>
        </NavLink>
        
        <NavLink to="/tours" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <MapPin size={20} />
          <span>Tour</span>
        </NavLink>
        
        <NavLink to="/events" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Event</span>
        </NavLink>

        <NavLink to="/articles" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <FileText size={20} />
          <span>Artikel</span>
        </NavLink>
        
        <NavLink to="/users" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>User Admin</span>
        </NavLink>
      </nav>

      <button onClick={handleLogout} className="nav-link sidebar-logout" type="button">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
