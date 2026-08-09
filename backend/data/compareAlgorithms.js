const buildGraph = require("./buildGraph");
const findNearestNode = require("../utils/nearestNode");

const dijkstra = require("../algorithms/dijkstra");
const astar = require("../algorithms/astar");

async function compareAlgorithms() {

    const graph = await buildGraph();

    if (!graph) {
        console.log("Could not build graph.");
        return;
    }

    // Different source and destination coordinates
    const testCases = [
        {
            source: [19.033, 73.029],
            destination: [19.040, 73.041]
        },
        {
            source: [19.035, 73.025],
            destination: [19.045, 73.035]
        },
        {
            source: [19.030, 73.035],
            destination: [19.042, 73.025]
        },
        {
            source: [19.038, 73.030],
            destination: [19.048, 73.040]
        },
        {
            source: [19.028, 73.025],
            destination: [19.040, 73.035]
        }
    ];

    let totalDijkstraNodes = 0;
    let totalAstarNodes = 0;

    let totalDijkstraTime = 0;
    let totalAstarTime = 0;

    let successfulTests = 0;

    console.log("\n==========================================");
    console.log("       DIJKSTRA vs A* COMPARISON");
    console.log("==========================================");

    for (let i = 0; i < testCases.length; i++) {

        const test = testCases[i];

        const source = findNearestNode(
            graph.adjacencyList,
            test.source[0],
            test.source[1]
        );

        const destination = findNearestNode(
            graph.adjacencyList,
            test.destination[0],
            test.destination[1]
        );

        console.log(`\n---------- TEST ${i + 1} ----------`);

        console.log("Source:", source.node);
        console.log("Destination:", destination.node);

        // -------------------------
        // Dijkstra
        // -------------------------

        const dijkstraResult = dijkstra(
            graph.adjacencyList,
            source.node,
            destination.node
        );

        // -------------------------
        // A*
        // -------------------------

        const astarResult = astar(
            graph.adjacencyList,
            source.node,
            destination.node
        );

        // Check if both found a route
        if (
            !isFinite(dijkstraResult.distance) ||
            !isFinite(astarResult.distance)
        ) {
            console.log("Route not found. Skipping test.");
            continue;
        }

        successfulTests++;

        totalDijkstraNodes += dijkstraResult.nodesExplored;
        totalAstarNodes += astarResult.nodesExplored;

        totalDijkstraTime += dijkstraResult.executionTime;
        totalAstarTime += astarResult.executionTime;

        console.log("\nDijkstra:");
        console.log(
            "Distance:",
            dijkstraResult.distance.toFixed(2),
            "m"
        );
        console.log(
            "Nodes:",
            dijkstraResult.nodesExplored
        );
        console.log(
            "Time:",
            dijkstraResult.executionTime,
            "ms"
        );

        console.log("\nA*:");
        console.log(
            "Distance:",
            astarResult.distance.toFixed(2),
            "m"
        );
        console.log(
            "Nodes:",
            astarResult.nodesExplored
        );
        console.log(
            "Time:",
            astarResult.executionTime,
            "ms"
        );
    }

    // Avoid division by zero
    if (successfulTests === 0) {
        console.log("\nNo successful tests.");
        return;
    }

    // -------------------------
    // AVERAGES
    // -------------------------

    const avgDijkstraNodes =
        totalDijkstraNodes / successfulTests;

    const avgAstarNodes =
        totalAstarNodes / successfulTests;

    const avgDijkstraTime =
        totalDijkstraTime / successfulTests;

    const avgAstarTime =
        totalAstarTime / successfulTests;

    // -------------------------
    // IMPROVEMENTS
    // -------------------------

    const nodeReduction =
        ((avgDijkstraNodes - avgAstarNodes)
            / avgDijkstraNodes) * 100;

    const timeReduction =
        ((avgDijkstraTime - avgAstarTime)
            / avgDijkstraTime) * 100;

    console.log("\n==========================================");
    console.log("              FINAL RESULTS");
    console.log("==========================================");

    console.log("\nSuccessful tests:", successfulTests);

    console.log("\nAverage Nodes Explored:");

    console.log(
        "Dijkstra:",
        avgDijkstraNodes.toFixed(2)
    );

    console.log(
        "A*:",
        avgAstarNodes.toFixed(2)
    );

    console.log("\nAverage Execution Time:");

    console.log(
        "Dijkstra:",
        avgDijkstraTime.toFixed(2),
        "ms"
    );

    console.log(
        "A*:",
        avgAstarTime.toFixed(2),
        "ms"
    );

    console.log("\nPerformance Improvement:");

    console.log(
        "Node reduction:",
        nodeReduction.toFixed(2) + "%"
    );

    console.log(
        "Time reduction:",
        timeReduction.toFixed(2) + "%"
    );
}

compareAlgorithms();