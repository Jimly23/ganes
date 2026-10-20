import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/format';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../api';

const API_ROOT = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

const TourList = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      const res = await api.get('/tours');
      setTours(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      try {
        await api.delete(`/tours/${id}`);
        fetchTours();
      } catch (err) {
        alert('Failed to delete tour');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Tours</h1>
        <Link to="/tours/create" className="btn btn-primary">
          <Plus size={18} /> Add New Tour
        </Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Images</th>
              <th>Name</th>
              <th>Harga</th>
              <th>Lokasi</th>
              <th>Kategori</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : tours.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No tours found.</td></tr>
            ) : (
              tours.map(tour => (
                <tr key={tour.id}>
                  <td>
                    {tour.images && tour.images.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {tour.images.slice(0, 3).map((img: any) => (
                          <img key={img.id} src={`${API_ROOT}/storage/${img.image_path}`} alt="tour" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ))}
                        {tour.images.length > 3 && <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>+{tour.images.length - 3}</div>}
                      </div>
                    ) : (
                      <ImageIcon size={24} style={{ opacity: 0.5 }} />
                    )}
                  </td>
                  <td>{tour.nama_tour}</td>
                  <td>{formatRupiah(tour.harga)}</td>
                  <td>{tour.lokasi_wisata}</td>
                  <td>{tour.kategori || 'Travel Domestik'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link to={`/tours/${tour.id}/edit`} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(tour.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
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

export default TourList;
