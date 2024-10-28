import {Node, Edge} from './useNodesAndEdges.tsx';

function useGetControlPoints() {
    function getControlPoints(
        source: Node,
        dest: Node,
        path: Edge[],
        smoothing: number
    ): { lat: number; lng: number }[] {
        const points: { lat: number; lng: number }[] = [];

        points.push({ lat: source.lat, lng: source.lng });

        for (const edge of path) {
            const node = edge.destination;
            points.push({ lat: node.lat, lng: node.lng });
        }

        // Optional: Apply smoothing or interpolation here if needed

        return points;
    }

    return { getControlPoints };
}

export default useGetControlPoints;
