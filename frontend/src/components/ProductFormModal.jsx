import { useState, useEffect } from 'react';

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: '',
    compatibility: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        stock: initialData.stock.toString()
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: '',
        category: '',
        compatibility: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = 'El nombre es muy corto';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Precio inválido';
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) newErrors.stock = 'Stock inválido';
    if (!formData.category || formData.category.length < 2) newErrors.category = 'Categoría inválida';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        <div style={headerStyle}>
          <h2>{initialData ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} style={closeBtnStyle}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label>Nombre</label>
            <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label>Precio</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={inputStyle} />
              {errors.price && <span style={errorStyle}>{errors.price}</span>}
            </div>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label>Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} style={inputStyle} />
              {errors.stock && <span style={errorStyle}>{errors.stock}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label>Categoría</label>
              <input name="category" value={formData.category} onChange={handleChange} style={inputStyle} />
              {errors.category && <span style={errorStyle}>{errors.category}</span>}
            </div>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label>Compatibilidad</label>
              <input name="compatibility" value={formData.compatibility} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label>URL de la Imagen</label>
            <input name="image" value={formData.image} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={formGroupStyle}>
            <label>Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} />
          </div>

          <div style={actionsStyle}>
            <button type="button" onClick={onClose} className="btn-secondary-hero" style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
            <button type="submit" className="btn-primary-hero" style={{ padding: '0.5rem 1rem' }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Inline styles for simplicity to match dark theme without touching much CSS
const overlayStyle = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const contentStyle = {
  background: '#1e1e1e', padding: '2rem', borderRadius: '12px',
  width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)',
  maxHeight: '90vh', overflowY: 'auto'
};
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' };
const closeBtnStyle = { background: 'transparent', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', border: 'none' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const inputStyle = { padding: '0.75rem', background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' };
const errorStyle = { color: '#ef4444', fontSize: '0.8rem' };
const actionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' };
