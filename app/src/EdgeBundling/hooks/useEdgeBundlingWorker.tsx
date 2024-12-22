import {useEffect, useMemo, useState} from "react";
import {useWorker, WORKER_STATUS} from "@koale/useworker";
import {performEdgeBundling} from "../utils/workers/edgeBundling.worker.ts";
import {Edge, FlightPath, Node} from "../EdgeBundling.types.ts";


function useEdgeBundlingWorker(
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

            //setLoading(true);

            try {
                const result = await edgeBundlingWorker(
                    nodesMap,
                    edges,
                    k
                );
                if (status !== WORKER_STATUS.KILLED) {
                    console.log("Worker done");
                    setFlightPaths(result);
                }
            } catch (error) {
                console.error("Worker error:", error);
            } finally {
                if (status !== WORKER_STATUS.KILLED) {
                    setLoading(false);
                }
            }
        };

        void runEdgeBundling();

        return () => {
            kill(); // Kill the worker when the component unmounts or input changes.
        };
    }, [flightPaths]);

    return { flightPaths, loading, status };
}


export default useEdgeBundlingWorker;