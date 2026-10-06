"""
Kruskal's Minimum Spanning Tree (MST) Algorithm Implementation
Uses custom Union-Find with Path Compression and Union by Rank.
"""
from typing import List, Dict, Any
from union_find import UnionFind

def kruskal(buildings: List[Dict[str, Any]], connections: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes the Minimum Spanning Tree (MST) for the given buildings and connections.

    Parameters:
        buildings: List of dicts, e.g., [{"code": "CSE", "name": "Computer Science"}, ...]
        connections: List of dicts, e.g., [{"from": "CSE", "to": "ECE", "distance": "5 km", "cost": 5000, "id": "conn-1"}, ...]

    Returns:
        Dict with success status, selected MST connections, and total minimum cost.
    """
    num_buildings = len(buildings)

    if num_buildings == 0:
        return {
            "success": True,
            "mst": [],
            "total_cost": 0,
            "message": "No buildings in network."
        }

    if num_buildings == 1:
        return {
            "success": True,
            "mst": [],
            "total_cost": 0,
            "message": "Single building network has 0 connections."
        }

    # Map building code to zero-based index for Union-Find
    code_to_idx = {b["code"]: i for i, b in enumerate(buildings)}

    # Filter connections to only those connecting valid existing buildings
    valid_edges = []
    for conn in connections:
        u = conn.get("from")
        v = conn.get("to")
        if u in code_to_idx and v in code_to_idx and u != v:
            valid_edges.append(conn)

    # Step 1: Sort all connections by cost in ascending order (E log E)
    sorted_edges = sorted(valid_edges, key=lambda edge: float(edge.get("cost", 0)))

    # Step 2: Initialize Union-Find with V elements
    uf = UnionFind(num_buildings)
    mst_edges = []
    total_cost = 0

    # Step 3: Iterate through sorted edges, add edge if it doesn't form a cycle
    for edge in sorted_edges:
        u_idx = code_to_idx[edge["from"]]
        v_idx = code_to_idx[edge["to"]]

        if uf.union(u_idx, v_idx):
            mst_edges.append(edge)
            total_cost += float(edge.get("cost", 0))

            # Stop early once we have exactly V - 1 edges
            if len(mst_edges) == num_buildings - 1:
                break

    # Step 4: Check if the graph is connected (MST must connect all V vertices with V - 1 edges)
    if len(mst_edges) < num_buildings - 1:
        return {
            "success": False,
            "error": "Graph is disconnected. Some buildings are not connected to the available network.",
            "mst": [],
            "total_cost": 0
        }

    return {
        "success": True,
        "mst": mst_edges,
        "total_cost": int(total_cost) if total_cost.is_integer() else total_cost
    }
