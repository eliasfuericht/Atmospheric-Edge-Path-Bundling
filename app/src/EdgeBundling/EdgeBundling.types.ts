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
