import {Coordinate} from "../EdgeBundling.types.ts";

/**
 * This function interpolates between two points.
 * @param p0 - The first point
 * @param p1 - The second point
 * @param t - The interpolation parameter
 * @returns The interpolated point
 */
function interpolate(p0: Coordinate, p1: Coordinate, t: number): Coordinate {
    const oneMinusT = 1 - t; // Precompute for efficiency
    return {
        lat: oneMinusT * p0.lat + t * p1.lat,
        lng: oneMinusT * p0.lng + t * p1.lng,
    };
}

/**
 * This function computes a point on a Bézier curve using De Casteljau's algorithm.
 * @param t - The interpolation parameter
 * @param controlPoints - The control points of the Bézier curve
 * @returns The point on the Bézier curve
 */
export function deCasteljau(t: number, controlPoints: Coordinate[]): Coordinate {
    let points = controlPoints;

    while (points.length > 1) {
        points = points.slice(0, -1).map((point, i) => interpolate(point, points[i + 1], t));
    }

    return points[0];
}