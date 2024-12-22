export const createMinHeap = <T>(comparator: (a: T, b: T) => number) => {
    const heap: T[] = [];

    const bubbleUp = (index: number) => {
        const element = heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = heap[parentIndex];
            if (comparator(element, parent) >= 0) break;
            heap[index] = parent;
            index = parentIndex;
        }
        heap[index] = element;
    };

    const bubbleDown = (index: number) => {
        const length = heap.length;
        const element = heap[index];
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let swapIndex = null;

            if (leftChildIndex < length) {
                const leftChild = heap[leftChildIndex];
                if (comparator(leftChild, element) < 0) swapIndex = leftChildIndex;
            }

            if (rightChildIndex < length) {
                const rightChild = heap[rightChildIndex];
                if (
                    comparator(rightChild, element) < 0 &&
                    (!swapIndex || comparator(rightChild, heap[swapIndex]) < 0)
                ) {
                    swapIndex = rightChildIndex;
                }
            }

            if (swapIndex === null) break;
            heap[index] = heap[swapIndex];
            index = swapIndex;
        }
        heap[index] = element;
    };

    return {
        insert(value: T) {
            heap.push(value);
            bubbleUp(heap.length - 1);
        },
        extractMin(): T {
            if (heap.length === 0) throw new Error("Heap is empty");
            const min = heap[0];
            const end = heap.pop()!;
            if (heap.length > 0) {
                heap[0] = end;
                bubbleDown(0);
            }
            return min;
        },
        isEmpty(): boolean {
            return heap.length === 0;
        },
    };
};