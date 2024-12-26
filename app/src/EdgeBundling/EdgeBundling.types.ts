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

export type Coordinate = {
    lat: number;
    lng: number;
}
export type ControlPoint = {
    coord: Coordinate;
    color: number; 
}

// Define FlightPath type for rendering
export type FlightPath = {
    coords: Coordinate[];
    color: number[];
};

export enum DataSet {
    SMALL = '/small.csv',
    MEDIUM = '/medium.csv',
    FULL = '/full.csv',
    PRESENTATION = '/presentation.csv'
}