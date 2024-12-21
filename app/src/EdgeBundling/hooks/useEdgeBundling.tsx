import {Edge, FlightPath, Node} from '../EdgeBundling.types.ts';
import * as THREE from 'three';
import {useCallback, useMemo} from 'react';
import {dijkstra} from '../utils/dijkstra.ts';
import {getControlPoints} from '../utils/ControlPoints.ts';

function useEdgeBundling(nodesMap: Map<string, Node>, edges: Edge[], k: number): FlightPath[] {

    const edgeBundling = useCallback((nodesMap: Map<string, Node>, edges: Edge[]): FlightPath[] => {
        const controlPointLists: FlightPath[] = [];

        for (const edge of edges) {
            if (edge.lock) continue;

            edge.skip = true;

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
                edgeInPath.lock = true;
            }

            // Get control points for drawing
            const controlPoints = getControlPoints(source, dest, path);
            
            controlPointLists.push({
                coords: controlPoints,
                color: new THREE.Color( 0xff0000 ),
            });
        }

        return controlPointLists;
    }, [k]);

    return useMemo(() => {
        return edgeBundling(nodesMap, edges);
    }, [nodesMap, edges, edgeBundling]);

}
export default useEdgeBundling;
