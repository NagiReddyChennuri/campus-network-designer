import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Network,
  Zap,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import Statistics from './components/Statistics';
import BuildingForm from './components/BuildingForm';
import ConnectionForm from './components/ConnectionForm';
import NetworkGraph from './components/NetworkGraph';
import MSTResult from './components/MSTResult';
import AlgorithmExplanation from './components/AlgorithmExplanation';
import { calculateMST, checkBackendHealth } from './api';

// Initial Demo Dataset specified in requirements
const DEMO_BUILDINGS = [
  { code: 'CSE', name: 'Computer Science' },
  { code: 'ECE', name: 'Electronics' },
  { code: 'LIB', name: 'Library' },
  { code: 'ADMIN', name: 'Administration' },
  { code: 'HOSTEL', name: 'Hostel' },
  { code: 'AUDI', name: 'Auditorium' },
];

const DEMO_CONNECTIONS = [
  { id: 'demo-1', from: 'CSE', to: 'LIB', distance: '3 km', cost: 3000 },
  { id: 'demo-2', from: 'LIB', to: 'ADMIN', distance: '4 km', cost: 4000 },
  { id: 'demo-3', from: 'CSE', to: 'ECE', distance: '5 km', cost: 5000 },
  { id: 'demo-4', from: 'AUDI', to: 'HOSTEL', distance: '5 km', cost: 5000 },
  { id: 'demo-5', from: 'CSE', to: 'AUDI', distance: '6 km', cost: 6000 },
  { id: 'demo-6', from: 'ECE', to: 'ADMIN', distance: '7 km', cost: 7000 },
  { id: 'demo-7', from: 'ADMIN', to: 'HOSTEL', distance: '7 km', cost: 7000 },
  { id: 'demo-8', from: 'LIB', to: 'HOSTEL', distance: '9 km', cost: 9000 },
];

export default function App() {
  const [buildings, setBuildings] = useState(DEMO_BUILDINGS);
  const [connections, setConnections] = useState(DEMO_CONNECTIONS);
  const [mstResult, setMstResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false });

  // Map for quick lookup of building names by code
  const buildingsMap = useMemo(() => {
    const map = {};
    buildings.forEach((b) => {
      map[b.code] = b.name;
    });
    return map;
  }, [buildings]);

  // Total possible cost if all cables were laid
  const totalPossibleCost = useMemo(() => {
    return connections.reduce((acc, c) => acc + (parseFloat(c.cost) || 0), 0);
  }, [connections]);

  // Check Python backend connection on mount & periodically
  useEffect(() => {
    const checkHealth = async () => {
      const res = await checkBackendHealth();
      setBackendStatus({ checked: true, online: res.online });
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handler: Add Building
  const handleAddBuilding = (newBuilding) => {
    setBuildings((prev) => [...prev, newBuilding]);
    setMstResult(null); // Reset calculated MST on modification
  };

  // Handler: Delete Building
  const handleDeleteBuilding = (codeToDelete) => {
    setBuildings((prev) => prev.filter((b) => b.code !== codeToDelete));
    // Also remove any connections tied to this building
    setConnections((prev) =>
      prev.filter((c) => c.from !== codeToDelete && c.to !== codeToDelete)
    );
    setMstResult(null);
  };

  // Handler: Add Connection
  const handleAddConnection = (newConnection) => {
    setConnections((prev) => [...prev, newConnection]);
    setMstResult(null);
  };

  // Handler: Delete Connection
  const handleDeleteConnection = (connId) => {
    setConnections((prev) => prev.filter((c) => (c.id || `${c.from}-${c.to}`) !== connId));
    setMstResult(null);
  };

  // Handler: Load Demo Campus
  const handleLoadDemo = () => {
    setBuildings(DEMO_BUILDINGS);
    setConnections(DEMO_CONNECTIONS);
    setMstResult(null);
  };

  // Handler: Clear All
  const handleClearAll = () => {
    setBuildings([]);
    setConnections([]);
    setMstResult(null);
  };

  // Handler: Find Minimum Network (Call Python Backend REST API)
  const handleFindMST = async () => {
    if (buildings.length === 0) {
      alert('Please add campus buildings first.');
      return;
    }

    setIsCalculating(true);
    setMstResult(null);

    const response = await calculateMST(buildings, connections);
    setIsCalculating(false);
    setMstResult(response);

    if (response.success && response.mst?.length > 0) {
      // Fire confetti celebration on successful MST
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2563EB', '#10B981', '#F59E0B'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const isMSTComputed = Boolean(mstResult && mstResult.success);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon-wrapper">
              <Network size={26} />
            </div>
            <div className="brand-titles">
              <h1>Campus Minimum Network Designer</h1>
              <p>Design the most cost-efficient network connecting every campus building using Kruskal's MST algorithm.</p>
            </div>
          </div>

          <div className="header-actions">
            <div
              className={`status-badge ${backendStatus.online ? 'online' : 'offline'}`}
              title={
                backendStatus.online
                  ? 'Python HTTP Server is connected'
                  : 'Python server unreachable at http://localhost:8000. Run: python server.py'
              }
            >
              <span className="status-dot"></span>
              <span>Python Backend: {backendStatus.online ? 'Online' : 'Offline'}</span>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLoadDemo}
              title="Load standard demo campus dataset"
            >
              <Sparkles size={16} color="var(--primary)" />
              Load Demo Campus
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearAll}
              title="Reset all buildings and connections"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="button"
              className="btn btn-success btn-action-large"
              onClick={handleFindMST}
              disabled={isCalculating || buildings.length === 0}
            >
              {isCalculating ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Calculating MST...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Find Minimum Network
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Metric Statistics */}
        <Statistics
          buildingsCount={buildings.length}
          connectionsCount={connections.length}
          mstConnectionsCount={mstResult?.mst?.length || 0}
          totalCost={mstResult?.total_cost}
          isMSTComputed={isMSTComputed}
        />

        {/* Dashboard Workspace */}
        <div className="dashboard-grid">
          {/* Left Column: Management Forms */}
          <div className="control-column">
            <BuildingForm
              buildings={buildings}
              onAddBuilding={handleAddBuilding}
              onDeleteBuilding={handleDeleteBuilding}
            />

            <ConnectionForm
              buildings={buildings}
              connections={connections}
              onAddConnection={handleAddConnection}
              onDeleteConnection={handleDeleteConnection}
            />
          </div>

          {/* Right Column: Visualizer & Results */}
          <div className="visualization-column">
            <NetworkGraph
              buildings={buildings}
              connections={connections}
              mstResult={mstResult}
              isMSTComputed={isMSTComputed}
            />

            {/* MST Result Card */}
            <MSTResult
              result={mstResult}
              buildingsMap={buildingsMap}
              totalPossibleCost={totalPossibleCost}
            />

            {/* Algorithm Explanation Card */}
            <AlgorithmExplanation />
          </div>
        </div>
      </main>
    </div>
  );
}
