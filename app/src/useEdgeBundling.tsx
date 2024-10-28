import useDijkstra from './useDijkstra.tsx';
import {Node, Edge, FlightPath} from './useNodesAndEdges.tsx';
import useGetControlPoints from './useGetControlPoints.tsx';

function useEdgeBundling() {
    const { findShortestPath } = useDijkstra();
    const { getControlPoints } = useGetControlPoints();

    function edgeBundling(nodesMap: Map<string, Node>, edges: Edge[]): FlightPath[] {
        const controlPointLists: FlightPath[] = [];
        const k = 2.0; // Detour factor
        const smoothing = 2;
        let tooLong = 0;
        let noPath = 0;

        for (const edge of edges) {
            if (edge.lock) continue;

            edge.skip = true;

            const source = edge.source;
            const dest = edge.destination;

            const path = findShortestPath(source, dest);

            if (path.length === 0) {
                noPath += 1;
                edge.skip = false;
                continue;
            }

            const originalDistance = edge.distance;
            const newPathLength = path.reduce((sum, e) => sum + e.distance, 0);

            if (newPathLength > k * originalDistance) {
                tooLong += 1;
                edge.skip = false;
                continue;
            }

            for (const edgeInPath of path) {
                edgeInPath.lock = true;
            }

            // Get control points for drawing
            const controlPoints = getControlPoints(source, dest, path, smoothing);
            controlPointLists.push({
                coords: controlPoints,
                color: '#ff0000', // You can customize the color as needed
            });
        }

        return controlPointLists;
    }

    return { edgeBundling };

}
export default useEdgeBundling;
