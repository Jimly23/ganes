import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import ArticleEditor from '../../components/ArticleEditor';

const ArticleForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ judul_artikel: '', deskripsi_singkat: '', tanggal_posting: new Date().toISOString().slice(0, 10), isi_artikel: '' });
  const [gambar, setGambar] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/articles/${id}`).then(res => {
      const data = res.data.data;
      setForm({ judul_artikel: data.judul_artikel || '', deskripsi_singkat: data.deskripsi_singkat || '', tanggal_posting: data.tanggal_posting || '', isi_artikel: data.isi_artikel || '' });
      setExistingImage(data.gambar || '');
    }).catch(() => setError('Gagal memuat artikel'));
  }, [id, isEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.isi_artikel.replace(/<[^>]*>/g, '').trim()) {
      setError('Isi artikel wajib diisi');
      return;
    }
    setLoading(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (gambar) data.append('gambar', gambar);
      if (isEdit) { data.append('_method', 'PUT'); await api.post(`/articles/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      else await api.post('/articles', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/articles');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan artikel');
    } finally { setLoading(false); }
  };

  return <div className="animate-fade-in">
    <div className="page-header"><h1 className="page-title">{isEdit ? 'Edit Artikel' : 'Tambah Artikel'}</h1></div>
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: 800 }}>
      {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label className="form-label">Judul Artikel</label><input className="form-input" name="judul_artikel" value={form.judul_artikel} onChange={e => setForm({ ...form, judul_artikel: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Deskripsi Singkat</label><textarea className="form-input" name="deskripsi_singkat" rows={3} value={form.deskripsi_singkat} onChange={e => setForm({ ...form, deskripsi_singkat: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Tanggal Posting</label><input className="form-input" type="date" name="tanggal_posting" value={form.tanggal_posting} onChange={e => setForm({ ...form, tanggal_posting: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Isi Artikel</label><ArticleEditor value={form.isi_artikel} onChange={isi_artikel => setForm({ ...form, isi_artikel })} /></div>
        <div className="form-group"><label className="form-label">Gambar (1 file, maksimal 5 MB)</label><input className="form-input" type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" required={!isEdit} onChange={e => setGambar(e.target.files?.[0] || null)} />{existingImage && <small>Gambar saat ini: {existingImage}</small>}</div>
        <div style={{ display: 'flex', gap: '1rem' }}><button className="btn btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button><button type="button" className="btn btn-outline" onClick={() => navigate('/articles')}>Batal</button></div>
      </form>
    </div>
  </div>;
};

export default ArticleForm;
