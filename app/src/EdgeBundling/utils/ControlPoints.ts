import {Edge, Node} from '../EdgeBundling.types.ts';

export function getControlPoints(
    source: Node,
    dest: Node,
    path: Edge[],
): { lat: number; lng: number }[] {
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