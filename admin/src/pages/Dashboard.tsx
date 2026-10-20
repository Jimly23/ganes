import { useEffect, useState } from 'react';
import { Calendar, FileText, Map, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

type Resource = Record<string, any>;

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [resources, setResources] = useState<Record<string, Resource[]>>({ paketTours: [], tours: [], articles: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [paketTours, tours, articles, events] = await Promise.all([
        api.get('/paket-tours'),
        api.get('/tours'),
        api.get('/articles'),
        api.get('/events'),
      ]);
      const getData = (response: { data?: { data?: Resource[] } }) => response.data?.data || [];
      setResources({
        paketTours: getData(paketTours),
        tours: getData(tours),
        articles: getData(articles),
        events: getData(events),
      });
    } catch {
      setError('Data dashboard belum dapat dimuat. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const cards = [
    { label: 'Paket Tour', value: resources.paketTours.length, icon: Map, href: '/paket-tours' },
    { label: 'Tour', value: resources.tours.length, icon: MapPin, href: '/tours' },
    { label: 'Artikel', value: resources.articles.length, icon: FileText, href: '/articles' },
    { label: 'Event', value: resources.events.length, icon: Calendar, href: '/events' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>
      
      <div className="dashboard-welcome glass-panel">
        <div>
          <h2>Selamat datang, {user.username || 'Admin'}!</h2>
          <p>Ringkasan konten yang dikelola di Ganes Tour.</p>
        </div>
        <button className="btn btn-outline dashboard-refresh" type="button" onClick={loadDashboard} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Perbarui
        </button>
      </div>

      {error && <div className="dashboard-alert">{error}</div>}

      <div className="dashboard-stat-grid">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link className="dashboard-stat glass-panel" to={href} key={label}>
            <span className="dashboard-stat-icon"><Icon size={21} /></span>
            <span className="dashboard-stat-label">{label}</span>
            <strong>{loading ? '—' : value}</strong>
            <span className="dashboard-stat-link">Kelola data →</span>
          </Link>
        ))}
      </div>

      <section className="dashboard-lists">
        <div className="glass-panel dashboard-list-card">
          <div className="dashboard-list-heading"><h2>Paket Tour Terbaru</h2><Link to="/paket-tours">Lihat semua</Link></div>
          {resources.paketTours.slice(0, 5).map(item => <div className="dashboard-list-row" key={item.id}><span>{item.nama_paket_tour || 'Tanpa nama'}</span><small>{item.lokasi_wisata?.length || 0} lokasi</small></div>)}
          {!loading && resources.paketTours.length === 0 && <p className="dashboard-empty">Belum ada paket tour.</p>}
        </div>
        <div className="glass-panel dashboard-list-card">
          <div className="dashboard-list-heading"><h2>Tour Terbaru</h2><Link to="/tours">Lihat semua</Link></div>
          {resources.tours.slice(0, 5).map(item => <div className="dashboard-list-row" key={item.id}><span>{item.nama_tour || 'Tanpa nama'}</span><small>{item.lokasi_wisata || 'Lokasi belum diisi'}</small></div>)}
          {!loading && resources.tours.length === 0 && <p className="dashboard-empty">Belum ada tour.</p>}
        </div>
        <div className="glass-panel dashboard-list-card">
          <div className="dashboard-list-heading"><h2>Konten Terbaru</h2></div>
          {[...resources.articles.slice(0, 3).map(item => ({ label: item.judul_artikel, type: 'Artikel' })), ...resources.events.slice(0, 2).map(item => ({ label: item.judul_event, type: 'Event' }))].map((item, index) => <div className="dashboard-list-row" key={`${item.type}-${index}`}><span>{item.label || 'Tanpa judul'}</span><small>{item.type}</small></div>)}
          {!loading && resources.articles.length === 0 && resources.events.length === 0 && <p className="dashboard-empty">Belum ada artikel atau event.</p>}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
