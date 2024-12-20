import {Edge, Node} from '../EdgeBundling.types.ts';

export function getControlPoints(
    source: Node,
    dest: Node,
    path: Edge[],
    smoothing: number
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
    //return applySmoothing(controlPoints, smoothing);
}

// Helper function to smooth points by inserting midpoints iteratively
function applySmoothing(points: { lat: number; lng: number }[], smoothing: number): { lat: number; lng: number }[] {
    let smoothedPoints = points;

    // Each level of smoothing inserts midpoints between existing points
    for (let level = 1; level < smoothing; level++) {
        const newPoints: { lat: number; lng: number }[] = [];

        for (let i = 0; i < smoothedPoints.length - 1; i++) {
            const start = smoothedPoints[i];
            const end = smoothedPoints[i + 1];

            // Calculate midpoint
            const midpoint = {
                lat: (start.lat + end.lat) / 2,
                lng: (start.lng + end.lng) / 2,
            };

            // Insert start point and midpoint
            newPoints.push(start);
            newPoints.push(midpoint);
        }

        // Add the last point
        newPoints.push(smoothedPoints[smoothedPoints.length - 1]);

        // Update smoothed points for the next level
        smoothedPoints = newPoints;
    }

    return smoothedPoints;
}