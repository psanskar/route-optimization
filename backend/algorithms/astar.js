const PriorityQueue = require("./PriorityQueue");
const calculateDistance = require("../utils/distance");

const coordinateCache = new Map();

    function getCoordinates(node) {

        if (coordinateCache.has(node)) {
            return coordinateCache.get(node);
        }

        const [lat, lon] = node.split(",").map(Number);

        const coordinates = {
            lat,
            lon
        };

        coordinateCache.set(node, coordinates);

        return coordinates;
    }

function astar(graph, start, end) {

    const startTime = Date.now();

    const distances = {};
    const previous = {};
    const visited = new Set();

    const pq = new PriorityQueue();


    // Initialize distances
    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }

    // Distance from source to source
    distances[start] = 0;

    // Get destination coordinates
    const endCoords = getCoordinates(end);

    // Heuristic for starting node
    const startCoords = getCoordinates(start);

    const startHeuristic = calculateDistance(
        startCoords.lat,
        startCoords.lon,
        endCoords.lat,
        endCoords.lon
    );

    // A* priority = g(n) + h(n)
    pq.enqueue(start, startHeuristic);

    let nodesExplored = 0;

    while (!pq.isEmpty()) {

        const current = pq.dequeue();

        const currentNode = current.node;

        // Skip already visited nodes
        if (visited.has(currentNode)) {
            continue;
        }

        visited.add(currentNode);

        nodesExplored++;

        // Destination reached
        if (currentNode === end) {
            break;
        }

        // Explore neighbours
        for (const neighbor of graph[currentNode]) {

            if (visited.has(neighbor.node)) {
                continue;
            }

            // Actual distance from source
            const newDistance =
                distances[currentNode] + neighbor.weight;

            // Found a better path
            if (newDistance < distances[neighbor.node]) {

                distances[neighbor.node] = newDistance;

                previous[neighbor.node] = currentNode;

                // Get neighbour coordinates
                const neighborCoords =
                    getCoordinates(neighbor.node);

                // Estimated distance to destination
                const heuristic = calculateDistance(
                    neighborCoords.lat,
                    neighborCoords.lon,
                    endCoords.lat,
                    endCoords.lon
                );

                // A* formula
                const priority =
                    newDistance + heuristic;

                pq.enqueue(
                    neighbor.node,
                    priority
                );
            }
        }
    }

    // Build path
    const path = [];

    let currentNode = end;

    while (currentNode !== null) {

        path.unshift(currentNode);

        currentNode = previous[currentNode];
    }

    const endTime = Date.now();

    const executionTime = endTime - startTime;

    return {
        distance: distances[end],
        path: path,
        nodesExplored: nodesExplored,
        executionTime: executionTime
    };
}

module.exports = astar;