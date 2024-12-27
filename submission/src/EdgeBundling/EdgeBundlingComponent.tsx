import useDataParsing from './hooks/useDataParsing.tsx';
import useNodesAndEdges from './hooks/useNodesAndEdges.tsx';
import GlobeComponent from './GlobeComponent.tsx';
import {ReactElement} from 'react';

import useEdgeBundlingWorker from "./hooks/useEdgeBundlingWorker.tsx";
import { Backdrop, CircularProgress } from '@mui/material';

type EdgeBundlingComponentProps = {
    k: number;
    d: number;
    numSegments: number;
    file: string;
};

function EdgeBundlingComponent({ k, d, numSegments, file }: EdgeBundlingComponentProps): ReactElement {
    const parseData = useDataParsing(file);
    const { nodesMap, edges } = useNodesAndEdges(parseData, d);
    const {flightPaths, loading} = useEdgeBundlingWorker(nodesMap, edges, k);

    return (
        <>
            <Backdrop
                open={loading}
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <GlobeComponent flightPaths={flightPaths} numSegments={numSegments} />
        </>
    );
}

export default EdgeBundlingComponent;