import {Coordinate, Edge, FlightPath, Node} from '../../EdgeBundling.types.ts';

export const performEdgeBundling = (
    nodesMap: Map<string, Node>,
    edges: Edge[],
    k: number
): FlightPath[] => {

    const createMinHeap = <T>(comparator: (a: T, b: T) => number) => {
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

    function dijkstra(source: Node, dest: Node, nodes: Map<string, Node>): Edge[] {
        // Initialize all nodes
        nodes.forEach((node) => {
            node.distance = Infinity;
            node.visited = false;
            node.previous = null;
        });

        // Initialize the source node
        source.distance = 0;

        // Create the MinHeap
        const queue = createMinHeap<Node>((a, b) => a.distance - b.distance);
        queue.insert(source);

        while (!queue.isEmpty()) {
            const currentNode = queue.extractMin();
            if (currentNode.visited) continue;

            currentNode.visited = true;

            // Stop early if the destination is reached
            if (currentNode === dest) break;

            // Relax edges
            for (const edge of currentNode.edges) {
                if (edge.skip) continue;

                const neighbor = edge.source === currentNode ? edge.destination : edge.source;
                const tentativeDistance = currentNode.distance + edge.weight;

                if (tentativeDistance < neighbor.distance) {
                    neighbor.distance = tentativeDistance;
                    neighbor.previous = currentNode;
                    queue.insert(neighbor); // Add neighbor to the MinHeap
                }
            }
        }

        return reconstructPath(dest);
    }

    function reconstructPath(dest: Node): Edge[] {
        const path: Edge[] = [];
        let currentNode: Node | null = dest;

        while (currentNode != null && currentNode.previous != null) {
            const prevNode: Node = currentNode.previous;

            // Find the edge that connects currentNode and prevNode
            const edge = prevNode.edges.find(
                (e) =>
                    (e.source === currentNode && e.destination === prevNode) ||
                    (e.source === prevNode && e.destination === currentNode)
            );

            if (edge) path.unshift(edge); // Add edge to the path in reverse order
            currentNode = prevNode;
        }

        if (currentNode !== dest) {
            console.warn('Path reconstruction incomplete: Destination node is not connected to the source.');
        }

        return path;
    }

    function getControlPoints(
        source: Node,
        dest: Node,
        path: Edge[],
    ): Coordinate[] {
        if (path.length === 2) {
            return [
                { lat: source.lat, lng: source.lng },
                { lat: dest.lat, lng: dest.lng }
            ];
        }

        // Initialize control points with the source node
        const controlPoints: { lat: number; lng: number }[] = [];
        let currentNode: Node = source;

        // Traverse the path, adding each node's coordinates to control points
        for (const edge of path) {
            controlPoints.push({ lat: currentNode.lat, lng: currentNode.lng });

            // Determine the next node in the path
            currentNode = edge.destination;
        }

        // Add the destination node's coordinates
        controlPoints.push({ lat: dest.lat, lng: dest.lng });

        // Apply smoothing
        return controlPoints;
    }

    const controlPointLists: FlightPath[] = [];

    const processedEdges = edges.map(edge => ({ ...edge, lock: edge.lock, skip: true }));

    for (const edge of processedEdges) {
        if (edge.lock) continue;

        const source = edge.source;
        const dest = edge.destination;

        const path = dijkstra(source, dest, nodesMap);

        if (path.length === 0) {
            edge.skip = false;
            continue;
        }

        const originalDistance = edge.distance;
        const newPathLength = path.reduce((sum, e) => sum + e.distance, 0);

        if (newPathLength > k * originalDistance) {
            edge.skip = false;
            continue;
        }

        for (const edgeInPath of path) {
            edgeInPath.lock = true; // Mutates the cloned edge, not the original
        }

        const controlPoints = getControlPoints(source, dest, path);

        controlPointLists.push({
            coords: controlPoints,
        });
    }

    return controlPointLists;
};