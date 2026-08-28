class PriorityQueue {

    constructor() {
        this.values = [];
    }

    enqueue(node, priority) {

        this.values.push({
            node: node,
            priority: priority
        });

        this.bubbleUp();
    }

    dequeue() {

        if (this.values.length === 0) {
            return null;
        }

        if (this.values.length === 1) {
            return this.values.pop();
        }

        const minimum = this.values[0];

        this.values[0] = this.values.pop();

        this.bubbleDown();

        return minimum;
    }

    bubbleUp() {

        let index = this.values.length - 1;

        while (index > 0) {

            const parentIndex = Math.floor((index - 1) / 2);

            if (
                this.values[parentIndex].priority <=
                this.values[index].priority
            ) {
                break;
            }

            [
                this.values[parentIndex],
                this.values[index]
            ] = [
                this.values[index],
                this.values[parentIndex]
            ];

            index = parentIndex;
        }
    }

    bubbleDown() {

        let index = 0;

        while (true) {

            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            let smallest = index;

            if (
                leftChild < this.values.length &&
                this.values[leftChild].priority <
                this.values[smallest].priority
            ) {
                smallest = leftChild;
            }

            if (
                rightChild < this.values.length &&
                this.values[rightChild].priority <
                this.values[smallest].priority
            ) {
                smallest = rightChild;
            }

            if (smallest === index) {
                break;
            }

            [
                this.values[index],
                this.values[smallest]
            ] = [
                this.values[smallest],
                this.values[index]
            ];

            index = smallest;
        }
    }

    isEmpty() {

        return this.values.length === 0;
    }
}

module.exports = PriorityQueue;