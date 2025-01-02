/**
 * Node type for flight data.
 *
 * Represents a single airport node with geographical location and connectivity information.
 */
export type Node = {
    /**
     * The airport code, e.g., "SFO" or "LAX".
     */
    id: string;

    /**
     * The latitude coordinate of the airport.
     */
    lat: number;

    /**
     * The longitude coordinate of the airport.
     */
    lng: number;

    /**
     * An array of edges (routes) that connect this airport to others.
     */
    edges: Edge[];

    /**
     * A distance value used for edge-bundling.
     */
    distance: number;

    /**
     * Whether this airport has been visited in the algorithm.
     */
    visited: boolean;

    /**
     * A reference to the previous airport in the pathfinding sequence, or `null` if none.
     */
    previous: Node | null;
};

/**
 * Edge type for flight data used in the edge-bundling algorithm.
 *
 * Represents a route connecting two airport nodes.
 */
export type Edge = {
    /**
     * The source airport node.
     */
    source: Node;

    /**
     * The destination airport node.
     */
    destination: Node;

    /**
     * The distance metric between the source and destination.
     */
    distance: number;

    /**
     * A weight value used in the edge-bundling.
     */
    weight: number;

    /**
     * A flag indicating that the edge is locked from updates or manipulations.
     */
    lock: boolean;

    /**
     * A flag to skip processing of this edge, if needed.
     */
    skip: boolean;
};

/**
 * Coordinate type for flight data.
 *
 * Represents a simple latitude-longitude coordinate pair.
 */
export type Coordinate = {
    /**
     * The latitude of the coordinate.
     */
    lat: number;

    /**
     * The longitude of the coordinate.
     */
    lng: number;
};

/**
 * ControlPoint type for rendering.
 *
 * Used to represent a point along an edge-bundled path or other drawing routine.
 */
export type ControlPoint = {
    /**
     * The geographical coordinate of the control point.
     */
    coord: Coordinate;

    /**
     * The color of the control point, stored as a numeric value (e.g., 0xff0000 for red).
     */
    color: number;
};

/**
 * FlightPath type for rendering.
 *
 * Defines a path consisting of multiple coordinates, along with color information for display.
 */
export type FlightPath = {
    /**
     * An array of geographical coordinates defining the flight path.
     */
    coords: Coordinate[];

    /**
     * An array of color values, should match the number of segments in the path.
     */
    color: number[];
};

/**
 * Enum for the available data sets.
 */
export enum DataSet {
    /**
     * A light data set for quick testing/illustration.
     */
    DEMO = '/Vis2_project/demo.csv',

    /**
     * A larger data set for final demo.
     */
    PRESENTATION = '/Vis2_project/presentation.csv'
}