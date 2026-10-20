import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/format';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api';

const API_ROOT = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

const EventList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Events</h1>
        <Link to="/events/create" className="btn btn-primary">
          <Plus size={18} /> Add New Event
        </Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Judul</th>
              <th>Harga Asli</th>
              <th>Harga Promo</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>No events found.</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id}>
                  <td>
                    {event.gambar ? (
                      <img src={`${API_ROOT}/storage/${event.gambar}`} alt={event.judul_event} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    ) : 'No image'}
                  </td>
                  <td>{event.judul_event}</td>
                  <td>{formatRupiah(event.harga_asli)}</td>
                  <td>{formatRupiah(event.harga_promo)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link to={`/events/${event.id}/edit`} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
