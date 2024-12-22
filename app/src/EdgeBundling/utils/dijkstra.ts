import {Edge, Node} from '../EdgeBundling.types.ts';
import { createMinHeap } from './FunctionalMinHeap.ts';

export function dijkstra(source: Node, dest: Node, nodes: Map<string, Node>): Edge[] {
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
