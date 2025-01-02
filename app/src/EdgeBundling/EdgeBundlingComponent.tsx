import {ReactElement} from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { GlobeComponent } from './GlobeComponent.tsx';
import {useDataParsing} from "./hooks/useDataParsing.tsx";
import {useNodesAndEdges} from "./hooks/useNodesAndEdges.tsx";
import {useEdgeBundlingWorker} from "./hooks/useEdgeBundlingWorker.tsx";

/**
 * The EdgeBundlingComponentProps type.
 */
export type EdgeBundlingComponentProps = {
    /**
     * Deroute parameter
     */
    k: number;
    /**
     * Edge weight parameter
     */
    d: number;
    /**
     * Defines curve smoothness
     */
    numSegments: number;
    /**
     * Data set to load for edge bundling
     */
    file: string;
};

/**
 * This component renders the globe and computes the edge bundling.
 *
 * @param props - The EdgeBundlingComponentProps object.
 * @param props.k - Deroute parameter
 * @param props.d - Edge weight parameter
 * @param props.numSegments - Defines curve smoothness
 * @param props.file - Data set to load for edge bundling
 * @returns The EdgeBundlingComponent component.
 */
export function EdgeBundlingComponent({ k, d, numSegments, file }: EdgeBundlingComponentProps): ReactElement {
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