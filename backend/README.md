# Route Optimization System

A real-world route optimization system that finds efficient routes between two geographical locations using Dijkstra's Algorithm and A* Search on a road network generated from OpenStreetMap data.

The system converts real-world road data into a weighted graph and applies graph pathfinding algorithms to calculate an optimized route between a source and destination.

---

## Features

* Uses real-world road network data from OpenStreetMap
* Finds the nearest graph nodes to source and destination coordinates
* Implements Dijkstra's Algorithm
* Implements A* Search Algorithm
* Custom graph data structure
* Custom Priority Queue implementation
* Compares algorithm performance
* Calculates route distance and path
* Node.js and Express backend
* Visualizes the calculated route on a map

---

## Algorithms Used

### 1. Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path between nodes in a weighted graph.

In this project:

* Each road intersection or geographical point is represented as a graph node.
* Roads connecting nodes are represented as edges.
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

### Why Use Both?

Dijkstra guarantees the shortest path but may explore a large portion of the graph before reaching the destination.

A* uses geographical information about the destination to guide the search toward the goal. This can reduce unnecessary exploration and improve search efficiency.

Comparing both algorithms allows us to study the trade-off between search efficiency and execution time.

---

## Road Network

The project uses OpenStreetMap road data to create a real-world road graph.

The overall process is:

```text
OpenStreetMap
      |
      v
Road Data
      |
      v
Graph Construction
      |
      v
Find Nearest Nodes
      |
      v
Dijkstra / A*
      |
      v
Optimized Route
```

The road network is represented as a weighted graph:

```text
Node   -> Road intersection or geographical point

Edge   -> Road connecting two nodes

Weight -> Distance between connected nodes
```

---

## How the System Works

### Step 1 - Retrieve Road Data

Road network information is obtained from OpenStreetMap using road data queries.

### Step 2 - Build the Graph

The road data is converted into a graph containing:

* Nodes
* Edges
* Distance weights

### Step 3 - Find Nearest Nodes

User coordinates may not exactly correspond to a graph node.

The system therefore finds the geographically nearest graph node for both the source and destination.

```text
Source Coordinates
        |
        v
Nearest Source Node

Destination Coordinates
        |
        v
Nearest Destination Node
```

### Step 4 - Run Pathfinding

The graph is passed to either:

```text
Dijkstra
```

or:

```text
A*
```

### Step 5 - Reconstruct the Route

The algorithm stores predecessor information while searching.

Once the destination is reached, the path is reconstructed by tracing the predecessors back from the destination to the source.

---

## Priority Queue

A priority queue is an important component of both pathfinding algorithms.

Instead of processing nodes in an arbitrary order, the algorithm always selects the node with the most promising priority.

For Dijkstra:

```text
Priority = g(n)
```

For A*:

```text
Priority = g(n) + h(n)
```

This allows the algorithms to process promising nodes first and avoid unnecessary exploration.

---

## Project Structure

```text
route-optimization/
|
|-- backend/
|   |
|   |-- algorithms/
|   |   |-- PriorityQueue.js
|   |   |-- astar.js
|   |   `-- dijkstra.js
|   |
|   |-- data/
|   |   |-- buildGraph.js
|   |   |-- compareAlgorithms.js
|   |   |-- getRoads.js
|   |   |-- roads.json
|   |   |-- testAstar.js
|   |   `-- testRoute.js
|   |
|   |-- graph/
|   |   `-- Graph.js
|   |
|   |-- utils/
|   |   |-- distance.js
|   |   `-- nearestNode.js
|   |
|   |-- server.js
|   |-- package.json
|   `-- package-lock.json
|
|-- Screenshots/
|   |-- route-map.png
|   `-- algorithm-comparison.png
|
|-- README.md
`-- .gitignore
```

---

## Technologies Used

| Technology           | Purpose                      |
| -------------------- | ---------------------------- |
| JavaScript           | Core programming language    |
| Node.js              | Backend runtime              |
| Express.js           | Web server                   |
| OpenStreetMap        | Real-world road network data |
| Graph Data Structure | Road network representation  |
| Dijkstra             | Shortest path algorithm      |
| A*                   | Heuristic-based pathfinding  |
| Priority Queue       | Efficient node selection     |

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/psanskar/route-optimization.git
```

### 2. Navigate to the Backend

```bash
cd route-optimization/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
node server.js
```

The application will start on the local server address displayed in the terminal.

---

## Testing Algorithms

The project includes scripts for testing and comparing the routing algorithms.

### Test Dijkstra

```bash
node data/testRoute.js
```

### Test A*

```bash
node data/testAstar.js
```

### Compare Algorithms

```bash
node data/compareAlgorithms.js
```

---

## Dijkstra vs A*

| Feature                           | Dijkstra   | A*            |
| --------------------------------- | ---------- | ------------- |
| Shortest path                     | Yes        | Yes           |
| Uses heuristic                    | No         | Yes           |
| Search strategy                   | Uninformed | Goal-directed |
| Typically explores fewer nodes    | No         | Yes           |
| Suitable for geographical routing | Yes        | Yes           |
| Priority calculation              | `g(n)`     | `g(n) + h(n)` |

The actual performance depends on the size and structure of the road network and the selected source and destination.

---

## Screenshots

### Route Map

The application visualizes the calculated route between the selected source and destination on the road network.

![Route Map](Screenshots/route-map.png)

### Algorithm Comparison

Performance comparison between Dijkstra's Algorithm and A* Search.

![Algorithm Comparison](Screenshots/algorithm-comparison.png)

---

## Applications

The concepts demonstrated in this project can be applied to:

* GPS navigation
* Logistics and delivery route planning
* Fleet management
* Emergency response routing
* Transportation systems
* Map-based delivery applications

---

## Future Improvements

Possible improvements include:

* Real-time traffic integration
* Vehicle-specific routing
* Fuel and cost optimization
* ETA calculation
* Interactive map improvements
* Multiple route alternatives
* Advanced algorithm benchmarking
* Deployment as a web application

---

## Author

**Sanskar Patil**

GitHub:
https://github.com/psanskar

---

## Project Goal

The goal of this project is to demonstrate how classical graph algorithms and data structures can be applied to real-world geographical road networks to solve route optimization problems.

The project combines OpenStreetMap data, graph representation, Dijkstra's algorithm, A* search, nearest-node mapping, and priority queues to create a practical route optimization system.
