import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { formatRupiah, parseRupiah } from '../../utils/format';

const PaketTourForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_paket_tour: '',
    kategori: 'Travel Domestik',
    deskripsi_singkat: '',
    harga: ''
  });
  
  const [lokasiStr, setLokasiStr] = useState('');
  const [destinasiStr, setDestinasiStr] = useState('');
  const [fasilitasStr, setFasilitasStr] = useState('');
  const [gambars, setGambars] = useState<FileList | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/paket-tours/${id}`).then(res => {
        const data = res.data.data;
        setFormData({
          nama_paket_tour: data.nama_paket_tour || '',
          kategori: data.kategori || 'Travel Domestik',
          deskripsi_singkat: data.deskripsi_singkat || '',
          harga: data.harga || ''
        });
        setLokasiStr(data.lokasi_wisata ? data.lokasi_wisata.join(', ') : '');
        setDestinasiStr(data.destinasi_wisata ? data.destinasi_wisata.join(', ') : '');
        setFasilitasStr(data.fasilitas ? data.fasilitas.join(', ') : '');
      }).catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGambars(e.target.files);
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
      
      const lokasi = lokasiStr.split(',').map(s => s.trim()).filter(s => s);
      lokasi.forEach(l => data.append('lokasi_wisata[]', l));
      
      const destinasi = destinasiStr.split(',').map(s => s.trim()).filter(s => s);
      destinasi.forEach(d => data.append('destinasi_wisata[]', d));

      const fasilitas = fasilitasStr.split(',').map(s => s.trim()).filter(s => s);
      fasilitas.forEach(f => data.append('fasilitas[]', f));
      
      if (gambars) {
        Array.from(gambars).forEach(file => {
          data.append('gambar[]', file);
        });
      }

      if (isEdit) {
        data.append('_method', 'PUT'); // Method spoofing
        await api.post(`/paket-tours/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/paket-tours', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/paket-tours');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit Paket Tour' : 'Create Paket Tour'}</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Paket Tour</label>
            <input type="text" name="nama_paket_tour" className="form-input" value={formData.nama_paket_tour} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select name="kategori" className="form-input" value={formData.kategori} onChange={handleChange} required>
              <option value="Travel Domestik">Travel Domestik</option>
              <option value="Travel Internasional">Travel Internasional</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Singkat</label>
            <textarea name="deskripsi_singkat" className="form-input" value={formData.deskripsi_singkat} onChange={handleChange} required rows={4}></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Lokasi Wisata (comma separated)</label>
              <input type="text" className="form-input" value={lokasiStr} onChange={e => setLokasiStr(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Destinasi Wisata (comma separated)</label>
              <input type="text" className="form-input" value={destinasiStr} onChange={e => setDestinasiStr(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Harga</label>
            <input type="text" name="harga" className="form-input" value={formatRupiah(formData.harga)} onChange={(e) => setFormData({...formData, harga: parseRupiah(e.target.value)})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Fasilitas (comma separated)</label>
            <input type="text" className="form-input" value={fasilitasStr} onChange={e => setFasilitasStr(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Gambar (Bisa pilih lebih dari satu)</label>
            <input type="file" className="form-input" accept="image/*" multiple onChange={handleFileChange} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/paket-tours')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaketTourForm;
