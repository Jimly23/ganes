import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { formatRupiah, parseRupiah } from '../../utils/format';

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul_event: '',
    deskripsi_event: '',
    itinerary: '',
    syarat_dan_ketentuan: '',
    harga_asli: '',
    harga_promo: ''
  });
  
  // Arrays
  const [fasilitasStr, setFasilitasStr] = useState('');
  const [tanggalStr, setTanggalStr] = useState('');
  
  // File
  const [gambar, setGambar] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`).then(res => {
        const data = res.data.data;
        setFormData({
          judul_event: data.judul_event || '',
          deskripsi_event: data.deskripsi_event || '',
          itinerary: data.itinerary || '',
          syarat_dan_ketentuan: data.syarat_dan_ketentuan || '',
          harga_asli: data.harga_asli || '',
          harga_promo: data.harga_promo || ''
        });
        setFasilitasStr(data.fasilitas ? data.fasilitas.join(', ') : '');
        setTanggalStr(data.tanggal ? data.tanggal.join(', ') : '');
      }).catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGambar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      // Handle arrays
      const fasilitas = fasilitasStr.split(',').map(s => s.trim()).filter(s => s);
      fasilitas.forEach(f => data.append('fasilitas[]', f));
      
      const tanggal = tanggalStr.split(',').map(s => s.trim()).filter(s => s);
      tanggal.forEach(t => data.append('tanggal[]', t));

      if (gambar) {
        data.append('gambar', gambar);
      }

      if (isEdit) {
        data.append('_method', 'PUT'); // Method spoofing for Laravel
        await api.post(`/events/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/events', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Event</label>
            <input type="text" name="judul_event" className="form-input" value={formData.judul_event} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Event</label>
            <textarea name="deskripsi_event" className="form-input" value={formData.deskripsi_event} onChange={handleChange} required rows={4}></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Itinerary</label>
            <textarea name="itinerary" className="form-input" value={formData.itinerary} onChange={handleChange} rows={4}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Fasilitas (comma separated)</label>
            <input type="text" className="form-input" value={fasilitasStr} onChange={e => setFasilitasStr(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Syarat dan Ketentuan</label>
            <textarea name="syarat_dan_ketentuan" className="form-input" value={formData.syarat_dan_ketentuan} onChange={handleChange} rows={3}></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Harga Asli</label>
              <input type="text" name="harga_asli" className="form-input" value={formatRupiah(formData.harga_asli)} onChange={(e) => setFormData({...formData, harga_asli: parseRupiah(e.target.value)})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Harga Promo</label>
              <input type="text" name="harga_promo" className="form-input" value={formatRupiah(formData.harga_promo)} onChange={(e) => setFormData({...formData, harga_promo: parseRupiah(e.target.value)})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tanggal (comma separated YYYY-MM-DD)</label>
            <input type="text" className="form-input" value={tanggalStr} onChange={e => setTanggalStr(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Gambar</label>
            <input type="file" className="form-input" accept="image/*" onChange={handleFileChange} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/events')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
