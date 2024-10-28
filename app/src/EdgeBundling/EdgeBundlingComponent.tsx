import useDataParsing, {FlightData} from './hooks/useDataParsing.tsx';
import useNodesAndEdges from './hooks/useNodesAndEdges.tsx';
import {FlightPath} from './EdgeBundling.types.ts';
import useEdgeBundling from './hooks/useEdgeBundling.tsx';
import Globe from 'react-globe.gl';
import {useMemo, useRef} from 'react';
import * as THREE from 'three';

function EdgeBundlingComponent() {
    const parseData: FlightData[] = useDataParsing('/small.csv');
    const { nodesMap, edges} = useNodesAndEdges(parseData);
    const flightPaths: FlightPath[] = useEdgeBundling(nodesMap, edges);
    const globeEl = useRef();

    console.log(flightPaths);

    const globe = useMemo(() => {
        return <Globe
                ref={globeEl}
                customLayerData={flightPaths}
                customThreeObject={(flightPath) => {
                const material = new THREE.LineBasicMaterial({ color: THREE.Color.NAMES.blue, linewidth: 3 });
                const geometry = new THREE.BufferGeometry();

                const coords = flightPath.coords.map(coord => {
                const { lat, lng } = coord;
                if (!globeEl.current) return new THREE.Vector3(0, 0, 0);
                const globeCoords = globeEl.current.getCoords(lat, lng, 0.1); // Adjust altitude if needed
                return new THREE.Vector3(globeCoords.x, globeCoords.y, globeCoords.z);
            });

                // Create line segments from the coordinates
                const lineSegments = [];
                for (let i = 0; i < coords.length - 1; i++) {
                lineSegments.push(coords[i], coords[i + 1]);
            }

                geometry.setFromPoints(lineSegments);
                return new THREE.LineSegments(geometry, material);
            }}
                customThreeObjectUpdate={(obj, flightPath) => {
                const coords = flightPath.coords.map(coord => {
                const { lat, lng } = coord;
                if (!globeEl.current) return new THREE.Vector3(0, 0, 0);
                const globeCoords = globeEl.current.getCoords(lat, lng, 0.1); // Adjust altitude if needed
                return new THREE.Vector3(globeCoords.x, globeCoords.y, globeCoords.z);
            });

                const lineSegments = [];
                for (let i = 0; i < coords.length - 1; i++) {
                lineSegments.push(coords[i], coords[i + 1]);
            }

                obj.geometry.setFromPoints(lineSegments);
            }}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                />
        }, [flightPaths]);

    return (
        <>
            {globe}
        </>
    );
}

export default EdgeBundlingComponent;
