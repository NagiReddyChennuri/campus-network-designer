import React, { useState } from 'react';
import { Network, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function ConnectionForm({ buildings, connections, onAddConnection, onDeleteConnection }) {
  const [fromCode, setFromCode] = useState('');
  const [toCode, setToCode] = useState('');
  const [distance, setDistance] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fromCode || !toCode) {
      setError('Please select both From and To buildings.');
      return;
    }

    if (fromCode === toCode) {
      setError('Cannot connect a building to itself.');
      return;
    }

    const numCost = parseFloat(cost);
    if (isNaN(numCost) || numCost <= 0) {
      setError('Cost must be a valid number greater than 0.');
      return;
    }

    // Check for duplicate connection (undirected graph check)
    const isDuplicate = connections.some(
      (c) =>
        (c.from === fromCode && c.to === toCode) ||
        (c.from === toCode && c.to === fromCode)
    );

    if (isDuplicate) {
      setError(`A connection between ${fromCode} and ${toCode} already exists.`);
      return;
    }

    const formattedDistance = distance.trim() ? (distance.includes('km') || distance.includes('m') ? distance.trim() : `${distance.trim()} km`) : '1 km';

    onAddConnection({
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      from: fromCode,
      to: toCode,
      distance: formattedDistance,
      cost: numCost,
    });

    setCost('');
    setDistance('');
  };

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Network size={18} color="var(--primary)" />
          Add Connection
        </h2>
        <span className="card-badge">{connections.length} Links</span>
      </div>

      <div className="card-body">
        {buildings.length < 2 ? (
          <div className="empty-state" style={{ padding: '1rem 0' }}>
            <p>Please add at least 2 buildings before creating network connections.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="from-building">From Building</label>
                <select
                  id="from-building"
                  className="form-select"
                  value={fromCode}
                  onChange={(e) => {
                    setFromCode(e.target.value);
                    if (error) setError('');
                  }}
                >
                  <option value="">Select Building</option>
                  {buildings.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} ({b.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="to-building">To Building</label>
                <select
                  id="to-building"
                  className="form-select"
                  value={toCode}
                  onChange={(e) => {
                    setToCode(e.target.value);
                    if (error) setError('');
                  }}
                >
                  <option value="">Select Building</option>
                  {buildings.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code} ({b.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="distance">Distance</label>
                <input
                  id="distance"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 5 km"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="cost">Cost (₹)</label>
                <input
                  id="cost"
                  type="number"
                  min="1"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 5000"
                  value={cost}
                  onChange={(e) => {
                    setCost(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={16} /> Add Connection
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            Connections Table ({connections.length})
          </span>

          {connections.length === 0 ? (
            <div className="empty-state">
              <p>No connections configured yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Distance</th>
                    <th>Cost</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((c) => (
                    <tr key={c.id || `${c.from}-${c.to}`}>
                      <td>
                        <span className="building-code-badge">{c.from}</span>
                      </td>
                      <td>
                        <span className="building-code-badge">{c.to}</span>
                      </td>
                      <td className="distance-cell">{c.distance || '1 km'}</td>
                      <td className="cost-cell">{formatCurrency(c.cost)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-danger-ghost"
                          onClick={() => onDeleteConnection(c.id || `${c.from}-${c.to}`)}
                          title="Delete Connection"
                          aria-label={`Delete connection between ${c.from} and ${c.to}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
