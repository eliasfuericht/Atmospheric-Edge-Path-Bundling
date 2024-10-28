import {Edge, Node} from '../EdgeBundling.types.ts';

export function dijkstra(source: Node, dest: Node): Edge[] {
    // Reset nodes
    source.distance = 0;
    source.visited = false;
    source.previous = null;

    const queue: Node[] = [];
    queue.push(source);

    while (queue.length > 0) {
        // Get node with minimum distance
        queue.sort((a, b) => a.distance - b.distance);
        const currentNode = queue.shift()!;
        currentNode.visited = true;

        if (currentNode === dest) break;

        for (const edge of currentNode.edges) {
            const neighbor = edge.destination;
            if (neighbor.visited) continue;

            const distance = currentNode.distance + edge.weight;
            if (distance < neighbor.distance) {
                neighbor.distance = distance;
                neighbor.previous = currentNode;
                if (!queue.includes(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }
    }

    // Build path
    const pathEdges: Edge[] = [];
    let currentNode = dest;

    if (currentNode.previous === null) {
        return [];
    }

    while (currentNode.previous !== null) {
        const prevNode = currentNode.previous;
        const edge = prevNode.edges.find((e) => e.destination === currentNode);
        if (edge) {
            pathEdges.unshift(edge);
        }
        currentNode = prevNode;
    }

    return pathEdges;
}
