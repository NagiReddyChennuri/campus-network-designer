import React from 'react';
import { Building2, Network, GitFork, IndianRupee } from 'lucide-react';

export default function Statistics({ buildingsCount, connectionsCount, mstConnectionsCount, totalCost, isMSTComputed }) {
  const formatCurrency = (val) => {
    if (val === null || val === undefined) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon primary">
          <Building2 size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Buildings</span>
          <span className="stat-value">{buildingsCount}</span>
          <span className="stat-desc">Campus locations added</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon warning">
          <Network size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Connections</span>
          <span className="stat-value">{connectionsCount}</span>
          <span className="stat-desc">Possible cable routes</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon success">
          <GitFork size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">MST Connections</span>
          <span className="stat-value">
            {isMSTComputed ? mstConnectionsCount : (buildingsCount > 1 ? `${buildingsCount - 1} needed` : '0')}
          </span>
          <span className="stat-desc">Selected by Kruskal</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon dark">
          <IndianRupee size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Minimum Cost</span>
          <span className="stat-value">
            {isMSTComputed ? formatCurrency(totalCost) : '₹--'}
          </span>
          <span className="stat-desc">Calculated optimal cost</span>
        </div>
      </div>
    </div>
  );
}
