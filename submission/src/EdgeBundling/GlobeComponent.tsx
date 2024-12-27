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

    const createFlightPathObject = useCallback(
        (d: object) => {
            const flightPath = d as FlightPath;

            const geometry = new LineGeometry();
            const points = generateBezierCurve(flightPath.coords, numSegments);
            geometry.setPositions(points);

            // Generate interpolated colors for each segment
            const colors = [];
            for (let i = 0; i < flightPath.color.length - 1; i++) {
                const startColor = flightPath.color[i];
                const endColor = flightPath.color[i + 1];
                const segmentColors = interpolateColors(startColor, endColor, numSegments);
                colors.push(...segmentColors);
            }

            // Flatten and set colors in the geometry
            geometry.setColors(colors.flat());

            // Create the material
            const material = new LineMaterial({
                vertexColors: true, // Enable vertex-based coloring
                linewidth: 0.175,
                worldUnits: true,
            });

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
                globeImageUrl="/Vis2_project/earth_july.jpg"
                backgroundImageUrl = "/Vis2_project/night-sky.png"
            />
        ),
        [flightPaths, createFlightPathObject]
    );
}

function interpolateColors(
    startColor: number, // Hexadecimal color, e.g., 0xff0000
    endColor: number,   // Hexadecimal color, e.g., 0x00ff00
    steps: number
): number[] {
    const colors = [];
    
    // Extract RGB components from hex values
    const startR = (startColor >> 16) & 0xff;
    const startG = (startColor >> 8) & 0xff;
    const startB = startColor & 0xff;

    const endR = (endColor >> 16) & 0xff;
    const endG = (endColor >> 8) & 0xff;
    const endB = endColor & 0xff;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        // Interpolate each color channel
        const r = Math.round(startR + t * (endR - startR));
        const g = Math.round(startG + t * (endG - startG));
        const b = Math.round(startB + t * (endB - startB));

        // Push the interpolated color in RGB format
        colors.push(r / 255, g / 255, b / 255); // Normalize to [0, 1] if needed
    }
    return colors;
}


export default GlobeComponent;