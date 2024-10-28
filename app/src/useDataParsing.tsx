import {useCallback, useEffect, useMemo, useState} from 'react';
import Papa, {ParseResult} from 'papaparse';
import {F} from 'vite/dist/node/types.d-aGj9QkWt';

export type FlightData = {
    index: string;
    Source_airport: string;
    Destination_airport: string;
    Source_Latitude: string;
    Source_Longitude: string;
    Destination_Latitude: string;
    Destination_Longitude: string;
};

type Flight = {
    startLat: string;
    startLng: string;
    endLat: string;
    endLng: string;
    color: string[];
};

function useDataParsing( file: string): FlightData[] {

    const [parsedData, setParsedData] = useState<FlightData[]>([]);

    const parseData = useCallback((csvText: string) => {
        Papa.parse<FlightData>(csvText, {
            header: true,
            complete: (result: ParseResult<FlightData>) => {
                setParsedData(result.data);
            },
        });
    }, []);

    useEffect(() => {
        fetch(file)
            .then((response) => response.text())
            .then(parseData)
            .catch((error) => console.error('Error parsing data:', error));
    }, [file, parseData]);

    return parsedData;
}

export default useDataParsing;
