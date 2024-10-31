import {Edge, Node} from '../EdgeBundling.types.ts';
class MinHeap<T> {
    private heap: T[];
    private comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.heap = [];
        this.comparator = comparator;
    }

    insert(value: T) {
        this.heap.push(value);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin(): T {
        if (this.isEmpty()) throw new Error("Heap is empty");
        const min = this.heap[0];
        const end = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return min;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    private bubbleUp(index: number) {
        const element = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (this.comparator(element, parent) >= 0) break;
            this.heap[index] = parent;
            index = parentIndex;
        }
        this.heap[index] = element;
    }

    private bubbleDown(index: number) {
        const length = this.heap.length;
        const element = this.heap[index];
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let swapIndex = null;

            if (leftChildIndex < length) {
                const leftChild = this.heap[leftChildIndex];
                if (this.comparator(leftChild, element) < 0) swapIndex = leftChildIndex;
            }

            if (rightChildIndex < length) {
                const rightChild = this.heap[rightChildIndex];
                if (
                    this.comparator(rightChild, element) < 0 &&
                    (!swapIndex || this.comparator(rightChild, this.heap[swapIndex]) < 0)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (!swapIndex) break;
            this.heap[index] = this.heap[swapIndex];
            index = swapIndex;
        }
        this.heap[index] = element;
    }
}


export function dijkstra(source: Node, dest: Node, nodes: Map<string, Node>): Edge[] {
    // Reset all nodes
    nodes.forEach(node => {
        node.distance = Infinity;
        node.visited = false;
        node.previous = null;
    });

    // Initialize source node and priority queue
    source.distance = 0;
    const queue = new MinHeap<Node>((a, b) => a.distance - b.distance);
    queue.insert(source);

    // Main Dijkstra loop
    while (!queue.isEmpty()) {
        const currentNode = queue.extractMin();
        if (currentNode.visited) continue;

        currentNode.visited = true;

        // Early exit if destination is reached
        if (currentNode === dest) break;

        for (const edge of currentNode.edges) {
            if (edge.skip) continue;

            // Determine the neighboring node
            const neighbor = edge.source === currentNode ? edge.destination : edge.source;

            // Calculate tentative distance
            const newDistance = currentNode.distance + edge.weight;

            // If a shorter path is found
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.previous = currentNode;

                // Add or update the neighbor in the queue
                queue.insert(neighbor);
            }
        }
    }

    // Backtrack from dest to source to construct the path
    const path: Edge[] = [];
    let currentNode: Node | null = dest;

    while (currentNode.previous !== null) {
        // Find the edge connecting currentNode to its previous node
        const prevNode = currentNode.previous;
        const connectingEdge = prevNode.edges.find(
            (edge) => (edge.source === currentNode && edge.destination === prevNode) ||
                (edge.source === prevNode && edge.destination === currentNode)
        );

        if (connectingEdge) {
            path.unshift(connectingEdge); // Add to path in reverse order
        }

        currentNode = prevNode;
    }

    return path;
}
