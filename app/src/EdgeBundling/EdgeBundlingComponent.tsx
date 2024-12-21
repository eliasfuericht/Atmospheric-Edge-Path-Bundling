import useDataParsing, {FlightData} from './hooks/useDataParsing.tsx';
import useNodesAndEdges from './hooks/useNodesAndEdges.tsx';
import {FlightPath} from './EdgeBundling.types.ts';
import useEdgeBundling from './hooks/useEdgeBundling.tsx';
import GlobeComponent from './GlobeComponent.tsx';
import { ReactElement } from 'react';

type EdgeBundlingComponentProps = {
    k: number;
    d: number;
    numSegments: number;
    file: string;
};

export enum DataSet {
    SMALL = '/small.csv',
    MEDIUM = '/medium.csv',
    FULL = '/full.csv',
}

function EdgeBundlingComponent({ k, d, numSegments, file }: EdgeBundlingComponentProps): ReactElement {
    const parseData: FlightData[] = useDataParsing(file);
    const { nodesMap, edges} = useNodesAndEdges(parseData, d);
    const flightPaths: FlightPath[] = useEdgeBundling(nodesMap, edges, k);

    return (
        <GlobeComponent flightPaths={flightPaths} numSegments={numSegments} />
    );
}

export default EdgeBundlingComponent;