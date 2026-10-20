import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '../../utils/format';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../../api';

const API_ROOT = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

const PaketTourList = () => {
  const [paketTours, setPaketTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaketTours = async () => {
    try {
      const res = await api.get('/paket-tours');
      setPaketTours(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaketTours();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this paket tour?')) {
      try {
        await api.delete(`/paket-tours/${id}`);
        fetchPaketTours();
      } catch (err) {
        alert('Failed to delete paket tour');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Paket Tours</h1>
        <Link to="/paket-tours/create" className="btn btn-primary">
          <Plus size={18} /> Add New Paket
        </Link>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Images</th>
              <th>Name</th>
              <th>Harga</th>
              <th>Kategori</th>
              <th>Lokasi (Count)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : paketTours.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No paket tours found.</td></tr>
            ) : (
              paketTours.map(paket => (
                <tr key={paket.id}>
                  <td>
                    {paket.images && paket.images.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {paket.images.slice(0, 3).map((img: any) => (
                          <img key={img.id} src={`${API_ROOT}/storage/${img.image_path}`} alt="paket" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        ))}
                        {paket.images.length > 3 && <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>+{paket.images.length - 3}</div>}
                      </div>
                    ) : (
                      <ImageIcon size={24} style={{ opacity: 0.5 }} />
                    )}
                  </td>
                  <td>{paket.nama_paket_tour}</td>
                  <td>{formatRupiah(paket.harga)}</td>
                  <td>{paket.kategori || 'Travel Domestik'}</td>
                  <td>{paket.lokasi_wisata ? paket.lokasi_wisata.length : 0} Lokasi</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link to={`/paket-tours/${paket.id}/edit`} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(paket.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
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

export default PaketTourList;
