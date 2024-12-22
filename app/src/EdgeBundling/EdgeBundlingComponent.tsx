import useDataParsing from './hooks/useDataParsing.tsx';
import useNodesAndEdges from './hooks/useNodesAndEdges.tsx';
import GlobeComponent from './GlobeComponent.tsx';
import {ReactElement} from 'react';

import useEdgeBundlingWorker from "./hooks/useEdgeBundlingWorker.tsx";

type EdgeBundlingComponentProps = {
    k: number;
    d: number;
    numSegments: number;
    file: string;
};

const styles = {
    spinnerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid rgba(255, 255, 255, 0.3)',
        borderTop: '5px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

function EdgeBundlingComponent({ k, d, numSegments, file }: EdgeBundlingComponentProps): ReactElement {
    const parseData = useDataParsing(file);
    const { nodesMap, edges } = useNodesAndEdges(parseData, d);
    //const flightPaths: FlightPath[]  = useEdgeBundling(nodesMap, edges, k);

    const {flightPaths, loading} = useEdgeBundlingWorker(nodesMap, edges, k);

    //const loading = false;
    return (
        <>
            {loading && (
                <div>
                    <div style={styles.spinner} />
                </div>
            )}
            <GlobeComponent flightPaths={flightPaths} numSegments={numSegments} />
        </>
    );
}

export default EdgeBundlingComponent;