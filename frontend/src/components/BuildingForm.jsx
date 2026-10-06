import React, { useState } from 'react';
import { Building2, Plus, Trash2, Layers } from 'lucide-react';

export default function BuildingForm({ buildings, onAddBuilding, onDeleteBuilding }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanName || !cleanCode) {
      setError('Please provide both Building Name and Building Code.');
      return;
    }

    if (buildings.some((b) => b.code === cleanCode)) {
      setError(`Building Code "${cleanCode}" already exists. Codes must be unique.`);
      return;
    }

    onAddBuilding({ name: cleanName, code: cleanCode });
    setName('');
    setCode('');
    setError('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Building2 size={18} color="var(--primary)" />
          Add Building
        </h2>
        <span className="card-badge">{buildings.length} Registered</span>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="building-name">Building Name</label>
            <input
              id="building-name"
              type="text"
              className="form-input"
              placeholder="e.g. Computer Science"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="building-code">Building Code</label>
            <input
              id="building-code"
              type="text"
              className="form-input"
              placeholder="e.g. CSE"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError('');
              }}
            />
            <p className="form-hint">Unique identifier used for network routing.</p>
          </div>

          {error && (
            <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={16} /> Add Building
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Campus Buildings ({buildings.length})
            </span>
          </div>

          {buildings.length === 0 ? (
            <div className="empty-state">
              <Layers className="empty-state-icon" />
              <p>No buildings added yet. Add buildings above or click "Load Demo Campus".</p>
            </div>
          ) : (
            <div className="buildings-list">
              {buildings.map((b) => (
                <div key={b.code} className="building-item animate-fade-in">
                  <div className="building-item-info">
                    <span className="building-code-badge">{b.code}</span>
                    <span className="building-item-name">{b.name}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger-ghost"
                    onClick={() => onDeleteBuilding(b.code)}
                    title={`Delete ${b.code}`}
                    aria-label={`Delete ${b.code}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
