import React from 'react';
import { BookOpen, Cpu, ArrowDown, Check, Zap } from 'lucide-react';

export default function AlgorithmExplanation() {
  const steps = [
    {
      num: 'Step 1',
      title: 'Sort Connections',
      desc: 'Sort all possible connections in ascending order based on their cost (cheapest first).',
    },
    {
      num: 'Step 2',
      title: 'Pick Cheapest',
      desc: 'Pick the next cheapest connection from the sorted list.',
    },
    {
      num: 'Step 3',
      title: 'Check Cycle',
      desc: 'Check if adding this connection would create a loop/cycle between buildings.',
    },
    {
      num: 'Step 4',
      title: 'Union-Find Check',
      desc: 'Use Disjoint Set Union (DSU) with Path Compression and Union by Rank to find root sets.',
    },
    {
      num: 'Step 5',
      title: 'Include in MST',
      desc: 'If the buildings belong to different sets, union the sets and include the cable in MST.',
    },
    {
      num: 'Step 6',
      title: 'Terminate at V - 1',
      desc: 'Repeat until exactly (V - 1) connections are selected, fully linking all campus buildings.',
    },
  ];

  return (
    <div className="algorithm-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="var(--primary)" />
          How Kruskal's Algorithm Works
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Greedy MST Paradigm
        </span>
      </div>

      <div className="steps-flow">
        {steps.map((step, idx) => (
          <div key={idx} className="step-card">
            <span className="step-num">{step.num}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark)' }}>{step.title}</span>
            <p className="step-text">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="complexity-box">
        <div className="complexity-item">
          <div>
            <div className="complexity-title">Time Complexity</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sorting edges + DSU operations</div>
          </div>
          <div className="complexity-val">O(E log E)</div>
        </div>

        <div className="complexity-item">
          <div>
            <div className="complexity-title">Space Complexity</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parent & Rank arrays in Union-Find</div>
          </div>
          <div className="complexity-val">O(V)</div>
        </div>
      </div>
    </div>
  );
}
