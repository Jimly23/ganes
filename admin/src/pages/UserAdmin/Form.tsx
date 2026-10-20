import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

const UserAdminForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/user-admins/${id}`).then(res => {
        setFormData({
          username: res.data.data.username,
          email: res.data.data.email,
          password: '' // Don't populate password
        });
      }).catch(err => console.error(err));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: Record<string, string> = { ...formData };
      if (isEdit && !payload.password) {
        delete payload.password; // Remove password if it's empty during edit
      }

      if (isEdit) {
        await api.put(`/user-admins/${id}`, payload);
      } else {
        await api.post('/user-admins', payload);
      }
      navigate('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Edit User Admin' : 'Create User Admin'}</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" name="username" className="form-input" 
              value={formData.username} onChange={handleChange} required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" name="email" className="form-input" 
              value={formData.email} onChange={handleChange} required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password {isEdit && '(Leave blank to keep current)'}</label>
            <input 
              type="password" name="password" className="form-input" 
              value={formData.password} onChange={handleChange} required={!isEdit} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/users')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdminForm;
