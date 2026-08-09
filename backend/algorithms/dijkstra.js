const PriorityQueue = require("./PriorityQueue");

function dijkstra(graph, start, end) {

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

    // Distance from start to itself = 0
    distances[start] = 0;

    // Put starting node into priority queue
    pq.enqueue(start, 0);

    let nodesExplored = 0;

    while (!pq.isEmpty()) {

        // Get node with smallest priority
        const current = pq.dequeue();

        const currentNode = current.node;

        // If already visited, skip it
        if (visited.has(currentNode)) {
            continue;
        }

        visited.add(currentNode);

        nodesExplored++;

        // If destination reached, stop
        if (currentNode === end) {
            break;
        }

        // Explore all neighbours
        for (const neighbor of graph[currentNode]) {

            if (visited.has(neighbor.node)) {
                continue;
            }

            const newDistance =
                distances[currentNode] + neighbor.weight;

            // Found a shorter path
            if (newDistance < distances[neighbor.node]) {

                distances[neighbor.node] = newDistance;

                previous[neighbor.node] = currentNode;

                pq.enqueue(
                    neighbor.node,
                    newDistance
                );
            }
        }
    }

    // Build shortest path
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

module.exports = dijkstra;  