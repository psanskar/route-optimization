const Graph = require("../graph/Graph");
const calculateDistance = require("../utils/distance");
const getRoads = require("./getRoads");

async function buildGraph() {

    const roads = await getRoads();

    if (!roads) {
        console.log("Could not get road data.");
        return null;
    }

    const graph = new Graph();

    for (const road of roads) {

        const geometry = road.geometry;

        if (!geometry || geometry.length < 2) {
            continue;
        }

        for (let i = 0; i < geometry.length - 1; i++) {

            const point1 = geometry[i];
            const point2 = geometry[i + 1];

            const node1 = `${point1.lat},${point1.lon}`;
            const node2 = `${point2.lat},${point2.lon}`;

            const distance = calculateDistance(
                point1.lat,
                point1.lon,
                point2.lat,
                point2.lon
            );

            graph.addEdge(
                node1,
                node2,
                distance
            );
        }
    }

    console.log("Graph built successfully!");

    console.log(
        "Number of nodes:",
        Object.keys(graph.adjacencyList).length
    );

    return graph;
}

module.exports = buildGraph;

