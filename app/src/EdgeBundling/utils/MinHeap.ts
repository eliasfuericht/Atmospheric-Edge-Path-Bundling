
class MinHeap<T> {
    private readonly heap: T[];
    private readonly comparator: (a: T, b: T) => number;

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

export default MinHeap;