const buildGraph = require("./buildGraph");
const findNearestNode = require("../utils/nearestNode");
const astar = require("../algorithms/astar");

async function testAstar() {

    // Build real road graph
    const graph = await buildGraph();

    if (!graph) {
        console.log("Could not build graph.");
        return;
    }

    // Source coordinates
    const sourceLat = 19.033;
    const sourceLon = 73.029;

    // Destination coordinates
    const destinationLat = 19.04;
    const destinationLon = 73.041;

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

    console.log("Source:");
    console.log(source);

    console.log("Destination:");
    console.log(destination);

    // Run A*
    const result = astar(
        graph.adjacencyList,
        source.node,
        destination.node
    );

    console.log("A* Result:");
    console.log(result);
}

testAstar();