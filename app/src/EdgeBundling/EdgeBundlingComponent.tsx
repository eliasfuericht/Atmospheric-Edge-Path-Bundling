import useDataParsing, {FlightData} from './hooks/useDataParsing.tsx';
import useNodesAndEdges from './hooks/useNodesAndEdges.tsx';
import {FlightPath} from './EdgeBundling.types.ts';
import useEdgeBundling from './hooks/useEdgeBundling.tsx';
import GlobeComponent from './GlobeComponent.tsx';

const k = 1.0; // deroute parameter
const d = 1.0; // Edge weight parameter
const numSegments = 1; // Controls the smoothness of the curve

function EdgeBundlingComponent() {
    const parseData: FlightData[] = useDataParsing('/small.csv');
    const { nodesMap, edges} = useNodesAndEdges(parseData, d);
    const flightPaths: FlightPath[] = useEdgeBundling(nodesMap, edges, k);

    return (
        <GlobeComponent flightPaths={flightPaths} numSegments={numSegments} />
    );
}

export default EdgeBundlingComponent;
