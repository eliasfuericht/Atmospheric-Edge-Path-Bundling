import {ReactElement, useCallback, useMemo, useRef} from 'react';
import Globe, {GlobeMethods} from 'react-globe.gl';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
import {FlightPath} from './EdgeBundling.types.ts';
import generateBezierCurve from "./utils/generateBezierCurve.ts";

type GlobeComponentProps = {
    flightPaths: FlightPath[];
    numSegments: number;
}

function GlobeComponent({ flightPaths, numSegments }: GlobeComponentProps): ReactElement {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);
    const color = 0xff0000;

    const createFlightPathObject = useCallback(
        (d: object) => {
            const flightPath = d as FlightPath;

            const material = new LineMaterial({
                color: color,
                linewidth: 0.15,
                worldUnits: true,
            });

            const geometry = new LineGeometry();
            const points = generateBezierCurve(flightPath.coords, numSegments);
            geometry.setPositions(points);

            return new Line2(geometry, material);
        },
        [numSegments]
    );

    return useMemo(
        () => (
            <Globe
                ref={globeRef}
                customLayerData={flightPaths}
                customThreeObject={createFlightPathObject}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            />
        ),
        [flightPaths, createFlightPathObject]
    );
}

export default GlobeComponent;