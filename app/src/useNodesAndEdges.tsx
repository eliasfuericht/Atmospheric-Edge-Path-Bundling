
// Define Node and Edge types
import {FlightData} from './useDataParsing.tsx';

export type Node = {
    id: string; // Airport code
    lat: number;
    lng: number;
    edges: Edge[];
    distance: number;
    visited: boolean;
    previous: Node | null;
};

export type Edge = {
    source: Node;
    destination: Node;
    distance: number;
    weight: number;
    lock: boolean;
    skip: boolean;
};

// Define FlightPath type for rendering
export type FlightPath = {
    coords: { lat: number; lng: number }[];
    color: string;
};

// https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/
function haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

function useNodesAndEdges(flightData: FlightData[]) {
    const nodesMap = new Map<string, Node>();
    const edges: Edge[] = [];

    flightData.forEach((data) => {
        let sourceNode = nodesMap.get(data.Source_airport);
        if (!sourceNode) {
            sourceNode = {
                id: data.Source_airport,
                lat: Number(data.Source_Latitude),
                lng: Number(data.Source_Longitude),
                edges: [],
                distance: Infinity,
                visited: false,
                previous: null,
            };
            nodesMap.set(data.Source_airport, sourceNode);
        }

        let destNode = nodesMap.get(data.Destination_airport);
        if (!destNode) {
            destNode = {
                id: data.Destination_airport,
                lat: Number(data.Destination_Latitude),
                lng: Number(data.Destination_Longitude),
                edges: [],
                distance: Infinity,
                visited: false,
                previous: null,
            };
            nodesMap.set(data.Destination_airport, destNode);
        }

        const distance = haversine(
            sourceNode.lat,
            sourceNode.lng,
            destNode.lat,
            destNode.lng
        );
        const d = 2.0; // Edge weight parameter
        const weight = Math.pow(distance, d);

        const edge: Edge = {
            source: sourceNode,
            destination: destNode,
            distance: distance,
            weight: weight,
            lock: false,
            skip: false,
        };

        // For undirected graph, add reverse edge
        const reverseEdge: Edge = {
            source: destNode,
            destination: sourceNode,
            distance: distance,
            weight: weight,
            lock: false,
            skip: false,
        };

        sourceNode.edges.push(edge);
        destNode.edges.push(reverseEdge);

        edges.push(edge);
        edges.push(reverseEdge);
    });

    return { nodesMap, edges };
}


export default useNodesAndEdges;
