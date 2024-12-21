import {Edge, Node} from '../EdgeBundling.types.ts';
import MinHeap from './MinHeap.ts';

export function dijkstra(source: Node, dest: Node, nodes: Map<string, Node>): Edge[] {
    nodes.forEach((node) => {
        node.distance = Infinity;
        node.visited = false;
        node.previous = null;
    });

    source.distance = 0;
    const queue = new MinHeap<Node>((a, b) => a.distance - b.distance);
    queue.insert(source);

    while (!queue.isEmpty()) {
        const currentNode = queue.extractMin();
        if (currentNode.visited) continue;

        currentNode.visited = true;
        if (currentNode === dest) break;

        for (const edge of currentNode.edges) {
            if (edge.skip) continue;

            const neighbor = edge.source === currentNode ? edge.destination : edge.source;
            const tentativeDistance = currentNode.distance + edge.weight;

            if (tentativeDistance < neighbor.distance) {
                neighbor.distance = tentativeDistance;
                neighbor.previous = currentNode;
                queue.insert(neighbor);
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
        const edge = prevNode.edges.find(
            (e) =>
                (e.source === currentNode && e.destination === prevNode) ||
                (e.source === prevNode && e.destination === currentNode)
        );
        if (edge) path.unshift(edge);
        currentNode = prevNode;
    }

    if (currentNode !== dest) {
        console.warn('Path reconstruction incomplete: Destination node is not connected to the source.');
    }

    return path;
}
