import {useEffect, useState} from "react";
import {useWorker, WORKER_STATUS} from "@koale/useworker";
import {performEdgeBundling} from "../utils/edgeBundling.worker.ts";
import {Edge, FlightPath, Node} from "../EdgeBundling.types.ts";

/**
 * This hook uses a web worker to perform edge bundling asynchronously.
 * @param nodesMap - The map of nodes.
 * @param edges - The list of edges.
 * @param k - The deroute parameter.
 * @returns The flight paths, loading state, and worker status.
 */
export function useEdgeBundlingWorker(
    nodesMap: Map<string, Node>,
    edges: Edge[],
    k: number
) {
    const [flightPaths, setFlightPaths] = useState<FlightPath[]>([]);
    const [loading, setLoading] = useState(false);

    const [edgeBundlingWorker, { status, kill }] = useWorker(performEdgeBundling, {autoTerminate: true});

    useEffect(() => {
        const runEdgeBundling = async () => {
            if (status === WORKER_STATUS.RUNNING) {
                console.warn("Worker is already running. Ignoring new invocation.");
                return;
            }

            setLoading(true);

            try {
                const result = await edgeBundlingWorker(nodesMap, edges, k);
                console.log("Worker done");
                setFlightPaths(result);
            } catch (error) {
                console.error("Worker error:", error);
            } finally {
                setLoading(false);
            }
        };

        void runEdgeBundling();

        return () => {
            kill(); // Kill the worker when inputs change or component unmounts
        };
    }, [edgeBundlingWorker, edges, k, kill, nodesMap]);

    return { flightPaths, loading, status };
}