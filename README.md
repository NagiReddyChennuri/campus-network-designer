# Campus Minimum Network Designer 🏛️⚡

A modern, full-stack web application that solves the problem of connecting college campus buildings with the **minimum possible total cable/network cost** using **Kruskal's Minimum Spanning Tree (MST)** algorithm and **Disjoint Set Union (Union-Find)** data structure.

---

## 🚀 Key Features

- **Dynamic Campus Building & Connection Management**: Add/remove buildings and cable connections with cost & distance.
- **Pure Python Backend**: Custom HTTP server using only Python's standard library (`http.server`) with zero external backend frameworks (No Flask, Django, or FastAPI).
- **Manual Kruskal & Union-Find Implementation**:
  - Path compression in `find()`
  - Union by rank in `union()`
  - Cycle detection & early exit when $V - 1$ edges are formed
  - Detection and handling of disconnected graphs
- **Interactive Network Visualization**: Powered by React Flow, showing buildings as nodes, edges with cost/distance badges, and instant visual highlighting (vibrant green glow) for MST cables.
- **Real-time Statistics**: Buildings count, available connections, MST connections, and minimum total cost in ₹ (INR).
- **One-Click Demo Campus**: Pre-loaded with 6 buildings and 8 candidate cable links.
- **Viva & Interview Ready**: Built-in visual explanation of Kruskal's algorithm, time complexity $O(E \log E)$, and space complexity $O(V)$.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast, modular component architecture |
| **Styling** | Vanilla CSS | Custom design system, responsive dashboard, soft shadows |
| **Visualization** | React Flow (`@xyflow/react`) | Interactive drag, zoom, pan, and custom edge routing |
| **Icons** | Lucide React | Modern, clean UI iconography |
| **Backend** | Python 3 (Standard Library) | `http.server`, `json`, `urllib` — No third-party backend packages |
| **Algorithm** | Kruskal's MST + DSU | Custom Python implementation (`union_find.py`, `kruskal.py`) |

---

## 📂 Project Structure

```text
├── backend/
│   ├── server.py        # Python HTTP REST API server on port 8000 (CORS enabled)
│   ├── kruskal.py       # Kruskal's MST Algorithm implementation
│   └── union_find.py    # Disjoint Set Union (DSU) with Path Compression & Union by Rank
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Statistics.jsx           # 4 key campus network metric cards
│   │   │   ├── BuildingForm.jsx         # Add/delete campus buildings
│   │   │   ├── ConnectionForm.jsx       # Add/delete cable routes with validation
│   │   │   ├── NetworkGraph.jsx         # Interactive React Flow campus map
│   │   │   ├── MSTResult.jsx            # Optimal cost & selected connections summary
│   │   │   └── AlgorithmExplanation.jsx # Step-by-step Kruskal breakdown & complexity
│   │   ├── api.js                       # Frontend-to-Backend REST API client
│   │   ├── App.jsx                      # Main dashboard coordinator
│   │   ├── index.css                    # Modern design system & styling
│   │   └── main.jsx                     # React entry point
│   ├── package.json
│   └── index.html
└── README.md
```

---

## 🏃 Quick Start Guide

### 1. Start the Python Backend
In a terminal, navigate to the `backend` folder and run:
```bash
cd backend
python server.py
```
> The backend will start at `http://localhost:8000`. You can verify it by opening `http://localhost:8000/health`.

### 2. Start the React Frontend
In a new terminal, navigate to the `frontend` folder and run:
```bash
cd frontend
npm install
npm run dev
```
> Open your browser at the displayed local URL (usually `http://localhost:5173`).

---

## 🧪 API Endpoints

### `POST /mst`
Calculates the Minimum Spanning Tree for the campus graph.

**Request Payload:**
```json
{
  "buildings": [
    { "code": "CSE", "name": "Computer Science" },
    { "code": "ECE", "name": "Electronics" },
    { "code": "LIB", "name": "Library" }
  ],
  "connections": [
    { "from": "CSE", "to": "ECE", "cost": 5000, "distance": "5 km" },
    { "from": "CSE", "to": "LIB", "cost": 3000, "distance": "3 km" },
    { "from": "ECE", "to": "LIB", "cost": 7000, "distance": "7 km" }
  ]
}
```

**Successful Response (`200 OK`):**
```json
{
  "success": true,
  "mst": [
    { "from": "CSE", "to": "LIB", "cost": 3000, "distance": "3 km" },
    { "from": "CSE", "to": "ECE", "cost": 5000, "distance": "5 km" }
  ],
  "total_cost": 8000
}
```

**Disconnected Graph Response (`200 OK`):**
```json
{
  "success": false,
  "error": "Graph is disconnected. Some buildings are not connected to the available network.",
  "mst": [],
  "total_cost": 0
}
```

---

## 🎓 Viva / Technical Explanation

### 1. Why Kruskal's Algorithm?
Kruskal is an edge-based greedy algorithm that is optimal for sparse graphs (like campus cable layouts). By sorting edges by cost and using Union-Find to avoid cycles, it guarantees the global minimum cable cost in $O(E \log E)$ time.

### 2. Why Union-Find (DSU) with Path Compression & Rank?
- **Find with Path Compression**: Flattens the tree so that subsequent lookups run in nearly $O(1)$ amortized time.
- **Union by Rank**: Always attaches the smaller tree under the root of the deeper tree, preventing unbalanced degenerate trees.
- Combined time complexity per operation: $O(\alpha(V))$, where $\alpha$ is the Inverse Ackermann function ($\le 4$ for all practical values).
