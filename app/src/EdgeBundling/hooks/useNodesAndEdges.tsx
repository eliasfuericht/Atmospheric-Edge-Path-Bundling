import {FlightData} from './useDataParsing.tsx';
import {Edge, Node} from '../EdgeBundling.types.ts';
import {useMemo} from "react";

/**
 * This function calculates the haversine distance between two points.
 * This is the distance between two points on the surface of a sphere.
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns The haversine distance between the two points
 */
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

/**
 * This function converts degrees to radians.
 * @param degrees - The angle in degrees
 * @returns The angle in radians
 */
function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * This hook creates nodes and edges from the flight data.
 * @param flightData - The flight data
 * @param d - The edge weight parameter
 * @returns The nodes and edges
 */
export function useNodesAndEdges(flightData: FlightData[], d: number) {
    return useMemo(() => {

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
    }, [flightData, d]);
}
