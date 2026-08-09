const buildGraph = require("./buildGraph");
const findNearestNode = require("../utils/nearestNode");
const dijkstra = require("../algorithms/dijkstra");

async function testRoute() {

    // Build real road graph
    const graph = await buildGraph();

    if (!graph) {
        return;
    }

    // Test source coordinates
    const sourceLat = 19.033;
    const sourceLon = 73.029;

    // Test destination coordinates
    const destinationLat = 19.04;
    const destinationLon = 73.04;

    // Find nearest graph nodes
    const source = findNearestNode(
        graph.adjacencyList,
        sourceLat,
        sourceLon
    );

    const destination = findNearestNode(
        graph.adjacencyList,
        destinationLat,
        destinationLon
    );

    console.log("\nSource:");
    console.log(source);

    console.log("\nDestination:");
    console.log(destination);

    // Run Dijkstra
    const result = dijkstra(
        graph.adjacencyList,
        source.node,
        destination.node
    );

    console.log("\nDijkstra Result:");
    console.log(result);
}

testRoute();