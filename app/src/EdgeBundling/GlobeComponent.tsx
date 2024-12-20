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
            linewidth: 0.1,
            worldUnits: true,
        });
        const geometry = new LineGeometry();

        const points: number[] = []; // Flat array of points for LineGeometry

        const origin = new THREE.Vector3(0,0,0)
        console.log(flightPath)
        for (let i = 0; i < flightPath.coords.length - 1; i++) {
            const startCoord = flightPath.coords[i];
            const endCoord = flightPath.coords[i + 1];
        
            const start = globeEl.current.getCoords(startCoord.lat, startCoord.lng, 0) ?? { x: 0, y: 0, z: 0 };
            const end = globeEl.current.getCoords(endCoord.lat, endCoord.lng, 0) ?? { x: 0, y: 0, z: 0 };
        
            let pointOnSurface = new THREE.Vector3(0, 0, 0);
            // Generate evenly spaced points along the straight line
            for (let t = 0.0; t <= 1.0; t += 1.0 / numSegments) {
                const x = (1 - t) * start.x + t * end.x;
                const y = (1 - t) * start.y + t * end.y;
                const z = (1 - t) * start.z + t * end.z;
                pointOnSurface = new THREE.Vector3(x,y,z)
            }
    
            // Map `i` to a parabolic function
            const parabolaScale = -4 * ((i - flightPath.coords.length / 2) ** 2) / (flightPath.coords.length ** 2) + 1;

            // Compute push-out vector
            let pushOutVector = pointOnSurface.clone().sub(origin).normalize().multiplyScalar(parabolaScale * 10);

            // Apply the push-out vector
            pointOnSurface = pointOnSurface.add(pushOutVector);
            
            // Push the modified point to the points array
            points.push(pointOnSurface.x, pointOnSurface.y, pointOnSurface.z);
        }
        
        geometry.setPositions(points);
        const line: THREE.Object3D = new Line2(geometry, material);
        //line.computeLineDistances();
        return line;
    }, [numSegments]);

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
