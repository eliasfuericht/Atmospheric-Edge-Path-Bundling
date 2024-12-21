import {useCallback, useMemo, useRef} from 'react';
import Globe, {GlobeMethods} from 'react-globe.gl';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import {FlightPath} from './EdgeBundling.types.ts';
import generateBezierCurve from "./utils/generateBezierCurve.ts";

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