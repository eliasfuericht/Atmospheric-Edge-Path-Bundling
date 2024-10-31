import {useCallback, useMemo, useRef} from 'react';
import Globe, {GlobeMethods} from 'react-globe.gl';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import {FlightPath} from './EdgeBundling.types.ts';

function calculateDistance(coord1: THREE.Vector3, coord2: THREE.Vector3): number {
    return coord1.distanceTo(coord2);
}

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
            linewidth: 0.3,
            worldUnits: true,
        });
        const geometry = new LineGeometry();

        const points: number[] = []; // Flat array of points for LineGeometry

        for (let i = 0; i < flightPath.coords.length - 1; i++) {
            const startCoord = flightPath.coords[i];
            const endCoord = flightPath.coords[i + 1];

            const start = globeEl.current.getCoords(startCoord.lat, startCoord.lng, 0) ?? { x: 0, y: 0, z: 0 };
            const end = globeEl.current.getCoords(endCoord.lat, endCoord.lng, 0) ?? { x: 0, y: 0, z: 0 };

            // Calculate control point for Bézier curve
            const midLat = (startCoord.lat + endCoord.lat) / 2;
            const midLng = (startCoord.lng + endCoord.lng) / 2;
            const distance = calculateDistance(
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            );
            const maxAltitude = Math.min(0.5, distance / 50.0);
            const control = globeEl.current.getCoords(midLat, midLng, maxAltitude) ?? { x: 0, y: 0, z: 0 };

            // Generate points along the Bézier curve
            for (let t = 0; t <= 1; t += 1 / numSegments) {
                const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
                const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
                const z = (1 - t) ** 2 * start.z + 2 * (1 - t) * t * control.z + t ** 2 * end.z;
                points.push(x, y, z);
            }
        }

        geometry.setPositions(points);
        const line: THREE.Object3D = new Line2(geometry, material);
        //line.computeLineDistances();
        return line;
    }, [numSegments]);

    const updateFlightPath = useCallback((flightPath: FlightPath, obj: THREE.Object3D) => {
        if (!globeEl.current) return;

        const points: number[] = [];

        for (let i = 0; i < flightPath.coords.length - 1; i++) {
            const startCoord = flightPath.coords[i];
            const endCoord = flightPath.coords[i + 1];

            const start = globeEl.current.getCoords(startCoord.lat, startCoord.lng, 0) ?? { x: 0, y: 0, z: 0 };
            const end = globeEl.current.getCoords(endCoord.lat, endCoord.lng, 0) ?? { x: 0, y: 0, z: 0 };

            const distance = calculateDistance(
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            );
            const maxAltitude = Math.min(0.5, distance / 50.0);

            const midLat = (startCoord.lat + endCoord.lat) / 2;
            const midLng = (startCoord.lng + endCoord.lng) / 2;
            const control = globeEl.current.getCoords(midLat, midLng, maxAltitude) ?? { x: 0, y: 0, z: 0 };

            for (let t = 0; t <= 1; t += 1 / numSegments) {
                const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
                const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
                const z = (1 - t) ** 2 * start.z + 2 * (1 - t) * t * control.z + t ** 2 * end.z;
                points.push(x, y, z);
            }
        }

        // Update geometry for Line2 object
        (obj as Line2).geometry.setPositions(points);
    }, [numSegments]);

    const globe = useMemo(() => {
        return (
            <Globe
                ref={globeEl}
                customLayerData={flightPaths}
                customThreeObject={(flightPath: FlightPath) => {
                    return drawFlightPath(flightPath);
                }}
                customThreeObjectUpdate={(obj, flightPath: FlightPath) => {
                    updateFlightPath(flightPath, obj);
                }}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            />
        );
    }, [drawFlightPath, flightPaths, updateFlightPath]);

    return <>{globe}</>;
}


    export default GlobeComponent;
