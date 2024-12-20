import {useCallback, useMemo, useRef} from 'react';
import Globe, {GlobeMethods} from 'react-globe.gl';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import {FlightPath} from './EdgeBundling.types.ts';

type GlobeComponentProps = {
    flightPaths: FlightPath[];
    numSegments: number;
}

function GlobeComponent({flightPaths, numSegments} : GlobeComponentProps ) {
    const globeEl = useRef<GlobeMethods | null>(null);

    const drawFlightPath = useCallback((flightPath: FlightPath) => {
        if (!globeEl.current) return null;

        const material = new LineMaterial({
            color: flightPath.color,
            linewidth: 0.15,
            worldUnits: true,
        });
        const geometry = new LineGeometry();

        const points = generateBezierCurve(flightPath.coords, numSegments)
        
        geometry.setPositions(points);
        const line: THREE.Object3D = new Line2(geometry, material);
        return line;
    }, [numSegments]);

    // Function to interpolate between two points
    function interpolate(p0, p1, t) {
        return {
            lat: (1 - t) * p0.lat + t * p1.lat,
            lng: (1 - t) * p0.lng + t * p1.lng
        };
    }

    // Convert latitude and longitude to 3D coordinates (spherical projection)
    function latLngToXYZ(lat, lng, radius = 100) {
        const latRad = lat * Math.PI / 180.0;  // Convert latitude to radians
        const lngRad = lng * Math.PI / 180.0;  // Convert longitude to radians

        const x = radius * Math.cos(latRad) * Math.cos(lngRad)
        const y = radius * Math.cos(latRad) * Math.sin(lngRad)
        const z = radius * Math.sin(latRad) // For height/altitude, use sin(lat)

        return { x, y, z };
    }

    // Function to generate the Bézier curve for any number of control points
    function generateBezierCurve(coords, numPoints = 100) {
        const bezierCurve = [];

        // De Casteljau's algorithm to compute the point on the Bézier curve for a given t
        function deCasteljau(t, controlPoints) {
            let points = controlPoints; // No need to clone the array if it's not mutated
            while (points.length > 1) {
                const nextPoints = [];
                for (let i = 0; i < points.length - 1; i++) {
                    nextPoints.push(interpolate(points[i], points[i + 1], t));
                }
                points = nextPoints; // Move to the next level of interpolation
            }
            return points[0]; // Return the last remaining point
        }

        // Generate points along the curve
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const point = deCasteljau(t, coords); // Get the point at parameter t
    
            // Convert latitude and longitude to 3D coordinates (x, y, z)
            const point3D = latLngToXYZ(point.lat, point.lng);

            const parabolaScale = (-4 * ((i - numPoints / 2) ** 2) / (numPoints ** 2) + 1) * 0.05;

            const pushOutVector = {
                x: (point3D.x) * parabolaScale,
                y: (point3D.y) * parabolaScale,
                z: (point3D.z) * parabolaScale,
            };

            const finalPoint = {
                x: point3D.x + pushOutVector.x,
                y: point3D.y + pushOutVector.y,
                z: point3D.z + pushOutVector.z,
            }

            // Store the 3D coordinates (x, y, z) in the result array
            bezierCurve.push(finalPoint.x, finalPoint.y, finalPoint.z);
        }

        return bezierCurve;
    }

    const globe = useMemo(() => {
        return (
            <Globe
                ref={globeEl}
                customLayerData={flightPaths}
                customThreeObject={(flightPath: FlightPath) => {
                    return drawFlightPath(flightPath);
                }}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            />
        );
    }, [drawFlightPath, flightPaths]);

    return <>{globe}</>;
}

export default GlobeComponent;