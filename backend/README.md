# 🚗 Route Optimization System

A real-world route optimization system that finds efficient routes between two geographical locations using **Dijkstra's Algorithm** and **A* Search** on a road network generated from **OpenStreetMap** data.

The project converts real-world road data into a weighted graph and uses graph traversal algorithms to calculate an optimized route between a source and destination.

---

## 📌 Features

* 🗺️ Uses real-world road network data from **OpenStreetMap**
* 📍 Finds the nearest graph nodes to source and destination coordinates
* 🧠 Implements **Dijkstra's Algorithm**
* ⚡ Implements **A* Search Algorithm**
* 🏗️ Custom graph data structure
* ⏱️ Compares algorithm performance
* 🔄 Uses a custom **Priority Queue**
* 📊 Calculates route distance and path
* 🌐 Node.js backend with Express

---

## 🧠 Algorithms Used

### 1. Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path from a source node to a destination node in a weighted graph.

In this project:

* Each road intersection is represented as a graph node.
* Roads connecting intersections are represented as edges.
* Edge weights represent geographical distance.
* A priority queue is used to process the node with the smallest known distance.

### 2. A* Search

A* improves the search process by using a heuristic to estimate the remaining distance to the destination.

The evaluation function is:

```text
f(n) = g(n) + h(n)
```

Where:

* `g(n)` = distance from the source to the current node
* `h(n)` = estimated distance from the current node to the destination
* `f(n)` = estimated total cost

For geographical routing, the distance between coordinates can be used as the heuristic.

### Why use both?

Dijkstra guarantees the shortest path but can explore many unnecessary nodes.

A* uses geographical information about the destination to guide the search, which can reduce the number of nodes explored and improve response time.

Comparing both algorithms allows us to study the trade-off between **search efficiency and execution time**.

---

## 🗺️ Road Network

The project uses **OpenStreetMap** road data to create a real-world road graph.

The process is:

```text
OpenStreetMap
      ↓
Road Data
      ↓
Graph Construction
      ↓
Find Nearest Nodes
      ↓
Dijkstra / A*
      ↓
Optimized Route
```

Each road network is represented as a weighted graph where:

```text
Node → Road intersection / geographical point

Edge → Road connecting two nodes

Weight → Distance between connected nodes
```

---

## 🏗️ Project Structure

```text
route-optimization/
│
├── algorithms/
│   ├── PriorityQueue.js
│   ├── astar.js
│   └── dijkstra.js
│
├── data/
│   ├── buildGraph.js
│   ├── compareAlgorithms.js
│   ├── getRoads.js
│   ├── roads.json
│   ├── testAstar.js
│   └── testRoute.js
│
├── graph/
│   └── Graph.js
│
├── utils/
│   ├── distance.js
│   └── nearestNode.js
│
├── server.js
├── package.json
├── package-lock.json
└── .gitignore
```

---

## 🔄 How the System Works

### Step 1 — Retrieve Road Data

Road network information is obtained from OpenStreetMap using road data queries.

### Step 2 — Build the Graph

The road data is converted into a graph containing:

* Nodes
* Edges
* Distance weights

### Step 3 — Find Nearest Nodes

User coordinates may not exactly match a graph node.

The system therefore finds the geographically nearest graph node to:

```text
Source coordinates
        ↓
Nearest source node

Destination coordinates
        ↓
Nearest destination node
```

### Step 4 — Run Pathfinding

The graph is passed to either:

```text
Dijkstra
```

or

```text
A*
```

### Step 5 — Generate Route

The algorithm reconstructs the path from the destination back to the source using predecessor information.

---

## ⚡ Priority Queue

A priority queue is essential for efficient pathfinding.

Instead of processing nodes randomly, the algorithm always selects the node with the smallest priority.

For Dijkstra:

```text
Priority = current shortest distance
```

For A*:

```text
Priority = g(n) + h(n)
```

This allows the algorithms to efficiently explore promising nodes first.

---

## 🛠️ Technologies Used

| Technology           | Purpose                     |
| -------------------- | --------------------------- |
| JavaScript           | Core programming language   |
| Node.js              | Backend runtime             |
| Express.js           | Server                      |
| OpenStreetMap        | Real-world road data        |
| Graph Data Structure | Road network representation |
| Dijkstra             | Shortest path algorithm     |
| A*                   | Heuristic-based pathfinding |
| Priority Queue       | Efficient node selection    |

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/psanskar/route-optimization.git
```

### 2. Navigate to the backend

```bash
cd route-optimization/backend
```

If the repository itself is the backend project, simply run:

```bash
cd route-optimization
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

The application can then be accessed through the local server address shown in the terminal.

---

## 🧪 Testing Algorithms

The project contains test scripts for evaluating the routing algorithms.

Examples include:

```bash
node data/testRoute.js
```

and:

```bash
node data/testAstar.js
```

Algorithm comparison can also be performed using:

```bash
node data/compareAlgorithms.js
```

---

## 📊 Dijkstra vs A*

| Feature                | Dijkstra   | A*            |
| ---------------------- | ---------- | ------------- |
| Shortest path          | ✅          | ✅             |
| Uses heuristic         | ❌          | ✅             |
| Search direction       | Uninformed | Goal-directed |
| Can explore more nodes | Yes        | Usually fewer |
| Suitable for routing   | ✅          | ✅             |
| Priority calculation   | `g(n)`     | `g(n) + h(n)` |

The actual performance depends on the road network and source/destination locations.

---

## 🎯 Applications

This project demonstrates concepts applicable to:

* GPS navigation
* Logistics
* Delivery route planning
* Transportation systems
* Emergency response routing
* Fleet management
* Map-based applications

---

## 🔮 Future Improvements

Possible improvements include:

* 🚦 Real-time traffic integration
* 🚚 Vehicle-specific routing
* ⛽ Fuel/cost optimization
* 📍 Interactive map interface
* 🕒 ETA calculation
* 🌐 Multiple route alternatives
* 📊 More detailed algorithm benchmarking
* ☁️ Deployment as a web application

---

## 👨‍💻 Author

**Sanskar Patil**

GitHub:
https://github.com/psanskar

---

## ⭐ Project Goal

The goal of this project is to demonstrate how classical graph algorithms can be applied to **real-world geographical road networks** to solve route optimization problems.
