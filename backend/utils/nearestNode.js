const calculateDistance = require("./distance");

const coordinateCache = new WeakMap();

function getCoordinates(adjacencyList) {

    if (coordinateCache.has(adjacencyList)) {
        return coordinateCache.get(adjacencyList);
    }

    const coordinates = [];

    for (const node of Object.keys(adjacencyList)) {

        const [lat, lon] = node.split(",").map(Number);

        coordinates.push({
            node: node,
            lat: lat,
            lon: lon
        });
    }

    coordinateCache.set(adjacencyList, coordinates);

    return coordinates;
}

function findNearestNode(adjacencyList, latitude, longitude) {

    const coordinates = getCoordinates(adjacencyList);

    let nearestNode = null;
    let shortestDistance = Infinity;

    for (const point of coordinates) {

        const distance = calculateDistance(
            latitude,
            longitude,
            point.lat,
            point.lon
        );

        if (distance < shortestDistance) {

            shortestDistance = distance;
            nearestNode = point.node;
        }
    }

    return {
        node: nearestNode,
        distance: shortestDistance
    };
}

module.exports = findNearestNode;