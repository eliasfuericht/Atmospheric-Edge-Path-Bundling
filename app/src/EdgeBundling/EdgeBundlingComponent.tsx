import useDataParsing, {FlightData} from './hooks/useDataParsing.tsx';
import useNodesAndEdges from './hooks/useNodesAndEdges.tsx';
import {FlightPath} from './EdgeBundling.types.ts';
import useEdgeBundling from './hooks/useEdgeBundling.tsx';
import Globe from 'react-globe.gl';

function EdgeBundlingComponent() {
    const parseData: FlightData[] = useDataParsing('/medium.csv');
    const { nodesMap, edges} = useNodesAndEdges(parseData);
    const flightPaths: FlightPath[] = useEdgeBundling(nodesMap, edges);

    console.log(flightPaths);

    return (
        <Globe
            arcsData={[]}
            arcColor={(d) => d.color}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        />
    );
}

export default EdgeBundlingComponent;
