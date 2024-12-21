
import deCasteljau from "./deCasteljau.ts";
import {Coordinate} from "../EdgeBundling.types.ts";

// Convert latitude and longitude to 3D coordinates (spherical projection)
function latLngToXYZ(lat: number, lng: number, radius = 100): { x: number; y: number; z: number } {
    const latRad = (lat * Math.PI) / 180.0;
    const lngRad = (lng * Math.PI) / 180.0;

    return {
        x: radius * Math.cos(latRad) * Math.sin(lngRad),
        y: radius * Math.sin(latRad),
        z: radius * Math.cos(latRad) * Math.cos(lngRad),
    };
}

// Function to generate the Bézier curve for any number of control points
function generateBezierCurve(coords: Coordinate[], numPoints = 100): number[] {
    return Array.from({ length: numPoints + 1 }, (_, i) => {
        const t = i / numPoints;
        const bezierPoint = deCasteljau(t, coords);
        const point3D = latLngToXYZ(bezierPoint.lat, bezierPoint.lng);

        const parabolaScale = (-4 * ((i - numPoints / 2) ** 2) / (numPoints ** 2) + 1) * 0.05;

        const scaledPoint = {
            x: point3D.x * (1 + parabolaScale),
            y: point3D.y * (1 + parabolaScale),
            z: point3D.z * (1 + parabolaScale),
        };

        return [scaledPoint.x, scaledPoint.y, scaledPoint.z];
    }).flat();
}

export default generateBezierCurve;