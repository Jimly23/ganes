import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api';

const API_ROOT = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

const ArticleList = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      setArticles(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles(current => current.filter(article => article.id !== id));
    } catch {
      alert('Gagal menghapus artikel');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Artikel</h1>
        <Link to="/articles/create" className="btn btn-primary"><Plus size={18} /> Tambah Artikel</Link>
      </div>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>Gambar</th><th>Judul</th><th>Tanggal Posting</th><th>Deskripsi</th><th style={{ textAlign: 'right' }}>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr> : articles.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center' }}>Belum ada artikel.</td></tr> : articles.map(article => (
              <tr key={article.id}>
                <td>{article.gambar ? <img src={`${API_ROOT}/storage/${article.gambar}`} alt={article.judul_artikel} style={{ width: 58, height: 42, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} /> : '—'}</td>
                <td>{article.judul_artikel}</td>
                <td>{article.tanggal_posting}</td>
                <td style={{ maxWidth: 280 }}>{article.deskripsi_singkat}</td>
                <td style={{ textAlign: 'right' }}><div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Link to={`/articles/${article.id}/edit`} className="btn btn-outline" style={{ padding: '0.5rem' }}><Edit2 size={16} /></Link>
                  <button onClick={() => handleDelete(article.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleList;
