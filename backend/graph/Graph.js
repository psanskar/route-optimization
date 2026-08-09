class Graph {

    constructor() {
        this.adjacencyList = {};
    }

    addNode(node) {

        if (!this.adjacencyList[node]) {
            this.adjacencyList[node] = [];
        }

    }

    addEdge(node1, node2, weight) {

        this.addNode(node1);
        this.addNode(node2);

        this.adjacencyList[node1].push({
            node: node2,
            weight: weight
        });

        this.adjacencyList[node2].push({
            node: node1,
            weight: weight
        });

    }

}

module.exports = Graph;