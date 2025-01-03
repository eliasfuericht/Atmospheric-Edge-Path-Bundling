
import {Coordinate} from "../EdgeBundling.types.ts";
import { deCasteljau } from "./deCasteljau.ts";

/**
 * This function converts latitude and longitude to 3D coordinates (spherical projection).
 * @param lat - The latitude
 * @param lng - The longitude
 * @param radius - The radius of the sphere (default: 100)
 * @returns The 3D coordinates
 */
function latLngToXYZ(lat: number, lng: number, radius = 100): { x: number; y: number; z: number } {
    const latRad = (lat * Math.PI) / 180.0;
    const lngRad = (lng * Math.PI) / 180.0;

    return {
        x: radius * Math.cos(latRad) * Math.sin(lngRad),
        y: radius * Math.sin(latRad),
        z: radius * Math.cos(latRad) * Math.cos(lngRad),
    };
}

/**
 * This function generates a Bézier curve from the given control points.
 * @param coords - The control points
 * @param numPoints - The number of points to generate
 * @returns The Bézier curve as a list of 3D coordinates
 */
export function generateBezierCurve(coords: Coordinate[], numPoints = 100): number[] {
    return Array.from({ length: numPoints + 1 }, (_, i) => {
        const t = i / numPoints;
        const bezierPoint = deCasteljau(t, coords);
        const point3D = latLngToXYZ(bezierPoint.lat, bezierPoint.lng);

        const parabolaScale = (-4 * ((i - numPoints / 2) ** 2) / (numPoints ** 2) + 1) * 0.1;

        const scaledPoint = {
            x: point3D.x * (1 + parabolaScale),
            y: point3D.y * (1 + parabolaScale),
            z: point3D.z * (1 + parabolaScale),
        };

        return [scaledPoint.x, scaledPoint.y, scaledPoint.z];
    }).flat();
}