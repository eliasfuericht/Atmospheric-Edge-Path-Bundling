import {useMemo, useRef} from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import {FlightPath} from './EdgeBundling.types.ts';
import {Object3D, Object3DEventMap} from 'three';

function calculateDistance(coord1: THREE.Vector3, coord2: THREE.Vector3): number {
    return coord1.distanceTo(coord2);
}

type GlobeComponentProps = {
    flightPaths: FlightPath[];
    numSegments: number;
}

function GlobeComponent({flightPaths, numSegments} : GlobeComponentProps ) {
    const globeEl = useRef();

    function drawFlightPath(flightPath: object) {
        const material = new THREE.LineBasicMaterial({color: flightPath.color, linewidth: 3});
        const geometry = new THREE.BufferGeometry();

        const points: THREE.Vector3[] = [];

        for (let i = 0; i < flightPath.coords.length - 1; i++) {
            const startCoord = flightPath.coords[i];
            const endCoord = flightPath.coords[i + 1];

            // Start and end positions
            const start = globeEl.current.getCoords(startCoord.lat, startCoord.lng, 0);
            const end = globeEl.current.getCoords(endCoord.lat, endCoord.lng, 0);

            // Calculate the distance between the start and end points
            const distance = calculateDistance(
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            );

            // Set max altitude based on distance, capping at 0.5
            const maxAltitude = Math.min(0.5, distance / 50.0);

            // Calculate the control point with scaled altitude
            const midLat = (startCoord.lat + endCoord.lat) / 2;
            const midLng = (startCoord.lng + endCoord.lng) / 2;
            const control = globeEl.current.getCoords(midLat, midLng, maxAltitude);

            // Generate intermediate points along the Bézier curve
            for (let t = 0; t <= 1; t += 1 / numSegments) {
                const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
                const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
                const z = (1 - t) ** 2 * start.z + 2 * (1 - t) * t * control.z + t ** 2 * end.z;
                points.push(new THREE.Vector3(x, y, z));
            }
        }

        geometry.setFromPoints(points);
        return new THREE.Line(geometry, material);
    }

    function updateFlightPath(flightPath: object, obj: Object3D) {
        const points: THREE.Vector3[] = [];

        for (let i = 0; i < flightPath.coords.length - 1; i++) {
            const startCoord = flightPath.coords[i];
            const endCoord = flightPath.coords[i + 1];

            const start = globeEl.current.getCoords(startCoord.lat, startCoord.lng, 0);
            const end = globeEl.current.getCoords(endCoord.lat, endCoord.lng, 0);

            const distance = calculateDistance(
                new THREE.Vector3(start.x, start.y, start.z),
                new THREE.Vector3(end.x, end.y, end.z)
            );
            const maxAltitude = Math.min(0.5, distance / 50.0);

            const midLat = (startCoord.lat + endCoord.lat) / 2;
            const midLng = (startCoord.lng + endCoord.lng) / 2;
            const control = globeEl.current.getCoords(midLat, midLng, maxAltitude);

            for (let t = 0; t <= 1; t += 1 / numSegments) {
                const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
                const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
                const z = (1 - t) ** 2 * start.z + 2 * (1 - t) * t * control.z + t ** 2 * end.z;
                points.push(new THREE.Vector3(x, y, z));
            }
        }

        obj.geometry.setFromPoints(points);
    }

    const globe = useMemo(() => {
        return <Globe
            ref={globeEl}
            customLayerData={flightPaths}
            customThreeObject={(flightPath) => {
                return drawFlightPath(flightPath);
            }}
            customThreeObjectUpdate={(obj, flightPath) => {
                updateFlightPath(flightPath, obj);
            }}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        />
    }, [flightPaths]);

    return (
        <>
            {globe}
        </>
    )
}

export default GlobeComponent;
