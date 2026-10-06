import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, IndianRupee, Sparkles } from 'lucide-react';

export default function MSTResult({ result, buildingsMap, totalPossibleCost }) {
  if (!result) return null;

  const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  if (!result.success) {
    return (
      <div className="result-card-error animate-fade-in">
        <div style={{ color: 'var(--error)', marginTop: '2px' }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.25rem' }}>
            Network cannot be created
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#B91C1C', lineHeight: 1.4 }}>
            {result.error || "Some buildings are not connected to the available network."}
          </p>
          <p style={{ fontSize: '0.775rem', color: '#7F1D1D', marginTop: '0.5rem' }}>
            Tip: Ensure there are enough cable connections so that every building has at least one path to every other building.
          </p>
        </div>
      </div>
    );
  }

  const mstEdges = result.mst || [];
  const savings = totalPossibleCost > 0 && result.total_cost > 0
    ? totalPossibleCost - result.total_cost
    : 0;
  const savingsPercent = totalPossibleCost > 0 && savings > 0
    ? Math.round((savings / totalPossibleCost) * 100)
    : 0;

  return (
    <div className="result-card-success animate-fade-in">
      <div className="result-header">
        <div className="result-title-group">
          <div className="result-icon">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dark)' }}>
              Minimum Network Found
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Kruskal's Algorithm successfully identified optimal cable topology with zero cycles.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {savings > 0 && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Saved vs All Cables</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#065F46' }}>{savingsPercent}% ({formatCurrency(savings)})</div>
            </div>
          )}
          <div className="result-cost-badge">
            <div className="result-cost-label">Total Minimum Cost</div>
            <div className="result-cost-val">{formatCurrency(result.total_cost)}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} color="var(--success)" /> Selected Connections ({mstEdges.length}):
        </h4>

        {mstEdges.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            No connections required for the current campus graph.
          </p>
        ) : (
          <div className="selected-connections-grid">
            {mstEdges.map((edge, idx) => {
              const fromName = buildingsMap[edge.from] || edge.from;
              const toName = buildingsMap[edge.to] || edge.to;
              return (
                <div key={idx} className="mst-connection-pill">
                  <div className="mst-route">
                    <span className="building-code-badge">{edge.from}</span>
                    <ArrowRight size={14} color="var(--success)" />
                    <span className="building-code-badge">{edge.to}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                      ({toName})
                    </span>
                  </div>
                  <span className="mst-cost-tag">{formatCurrency(edge.cost)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
