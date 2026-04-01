import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox, FaDollarSign, FaLayerGroup, FaImage, FaTimes } from 'react-icons/fa';

// CLOUDINARY CONFIG
const CLOUDINARY_UPLOAD_PRESET = 'importstore'; 
const CLOUDINARY_CLOUD_NAME = 'dkaixitaa'; 

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category_id: 1,
    sku: '',
    retail_price: '',
    wholesale_price: '',
    stock: '',
    description: '',
    short_description: '',
    main_image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data.data || []);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setFormData({
        ...product,
        retail_price: Number(product.retail_price) || 0,
        wholesale_price: Number(product.wholesale_price) || 0,
        stock: Number(product.stock) || 0
      });
      setImagePreview(product.main_image_url);
    } else {
      setIsEditing(false);
      setFormData({
        name: '',
        category_id: 1,
        sku: '',
        retail_price: '',
        wholesale_price: '',
        stock: '',
        description: '',
        short_description: '',
        main_image_url: ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.main_image_url;
    
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const res = await axios.post(
        `http://localhost:5000/api/upload`,
        data
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Server Upload Error Detail:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Error de red en servidor';
      toast.error(`Error en Imagen: ${errorMsg}`);
      return formData.main_image_url || ''; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const imageUrl = await uploadImage();
      
      // Safety: Ensure numeric values are sent correctly or as NULL
      const payload = { 
        ...formData, 
        main_image_url: imageUrl || null,
        retail_price: formData.retail_price === '' ? null : Number(formData.retail_price),
        wholesale_price: formData.wholesale_price === '' ? null : Number(formData.wholesale_price),
        stock: formData.stock === '' ? 0 : Number(formData.stock)
      };
      
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${formData.id}`, payload);
        toast.success('Producto actualizado con éxito');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        toast.success('Producto creado con éxito');
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Save Error:', error.response?.data || error.message);
      toast.error('Error al guardar producto. Verifica los campos.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        toast.success('Producto eliminado');
        fetchProducts();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ position: 'relative' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Inventario</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Gestiona tus productos y stock</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn btn-primary" 
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        >
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard icon={<FaBox />} label="Total Productos" value={products.length} color="#D4AF37" />
        <StatCard icon={<FaLayerGroup />} label="Categorías" value={3} color="#4A90E2" />
        <StatCard icon={<FaDollarSign />} label="Ventas Hoy" value="$0" color="#25D366" />
      </div>

      {/* Product Table Area */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Lista de Productos</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o Código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.25rem 1.5rem' }}>Producto</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Código (SKU)</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Categoría</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Precio Minorista</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Stock</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ color: '#E0E0E0' }}>
              {loading ? (
                 <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>Cargando inventario...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>No se encontraron productos.</td></tr>
              ) : filteredProducts.map(product => (
                <tr key={product.id} className="admin-tr" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '6px', overflow: 'hidden' }}>
                        {product.main_image_url ? (
                          <img src={product.main_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
                      </div>
                      <div style={{ fontWeight: '600' }}>{product.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>{product.sku}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(212,175,55,0.1)', color: 'var(--accent-primary)' }}>
                      {product.category_name}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>${Number(product.retail_price).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ color: product.stock < 10 ? '#FF3B30' : '#25D366' }}>{product.stock}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-action" onClick={() => handleOpenModal(product)} style={actionBtnStyle}><FaEdit /></button>
                      <button className="btn-action" onClick={() => handleDelete(product.id)} style={{ ...actionBtnStyle, color: '#FF3B30', background: 'rgba(255,59,48,0.05)' }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
          <div className="glass" style={{ 
            width: '100%', maxWidth: '650px', maxHeight: '95vh', overflowY: 'auto',
            borderRadius: '20px', padding: '2.5rem', position: 'relative', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-tertiary)', fontSize: '1.2rem' }}
            >
              <FaTimes />
            </button>

            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800' }}>
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Product Info */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Nombre del Producto</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Código (SKU)</label>
                <input 
                  type="text" required
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Categoría</label>
                <select 
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                  style={inputStyle}
                >
                  <option value={1} style={{background: '#1a1a1a'}}>Gadgets</option>
                  <option value={2} style={{background: '#1a1a1a'}}>Perfumes</option>
                  <option value={3} style={{background: '#1a1a1a'}}>Cosméticos</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Precio Minorista ($)</label>
                <input 
                  type="number" required
                  value={formData.retail_price}
                  onChange={(e) => setFormData({...formData, retail_price: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Precio Mayorista (Opcional $)</label>
                <input 
                  type="number"
                  value={formData.wholesale_price}
                  onChange={(e) => setFormData({...formData, wholesale_price: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Stock</label>
                <input 
                  type="number" required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  style={inputStyle}
                />
              </div>

              {/* Image Upload Row */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Imagen del Producto (Subir Archivo)</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div style={{ 
                    width: '60px', height: '60px', border: '1px dashed rgba(255,255,255,0.2)', 
                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.02)', overflow: 'hidden'
                  }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : <span style={{fontSize: '1.5rem'}}>📦</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ marginBottom: '5px', fontSize: '0.8rem' }}
                    />
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Para carga automática</p>
                  </div>
                </div>

                <label style={labelStyle}>O Pegar URL de Imagen (Manual)</label>
                <input 
                  type="text"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={formData.main_image_url}
                  onChange={(e) => {
                    setFormData({...formData, main_image_url: e.target.value});
                    setImagePreview(e.target.value);
                  }}
                  style={{...inputStyle, border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.05)'}}
                />
                <p style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', marginTop: '4px' }}>
                  Tip: Si falla la subida, podés subirla a Cloudinary manual y pegar el link acá.
                </p>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Descripción Corta</label>
                <input 
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem' }}
                >
                  {submitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: '50px', height: '50px', background: `${color}15`, color: color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '5px' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{value}</div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '1rem', outline: 'none'
};

const labelStyle = {
  display: 'block', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '8px', fontWeight: '600'
};

const actionBtnStyle = {
  padding: '8px',
  borderRadius: '6px',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
  transition: 'all 0.2s'
};
