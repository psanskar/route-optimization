class PriorityQueue {

    constructor() {
        this.values = [];
    }

    enqueue(node, priority) {

        this.values.push({
            node: node,
            priority: priority
        });

        this.sort();

    }

    dequeue() {

        return this.values.shift();

    }

    sort() {

        this.values.sort((a, b) => {
            return a.priority - b.priority;
        });

    }

    isEmpty() {

        return this.values.length === 0;

    }

}

module.exports = PriorityQueue;