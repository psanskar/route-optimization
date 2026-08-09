const calculateDistance = require("./distance");

function findNearestNode(adjacencyList, latitude, longitude) {

    let nearestNode = null;
    let shortestDistance = Infinity;

    for (const node of Object.keys(adjacencyList)) {

        const [nodeLat, nodeLon] = node.split(",").map(Number);

        const distance = calculateDistance(
            latitude,
            longitude,
            nodeLat,
            nodeLon
        );

        if (distance < shortestDistance) {

            shortestDistance = distance;
            nearestNode = node;

        }
    }

    return {
        node: nearestNode,
        distance: shortestDistance
    };
}

module.exports = findNearestNode;