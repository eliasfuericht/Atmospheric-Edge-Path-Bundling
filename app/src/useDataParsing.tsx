import {useCallback, useState} from 'react';
import Papa, {ParseResult} from 'papaparse';

type FlightData = {
    index: string;
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

function useDataParsing() {
    const [data, setData] = useState<Flight[]>([]);

    const parseData = useCallback((csvText: any) => {
        Papa.parse(csvText, {
            header: true,
            complete: (result  : ParseResult<FlightData>) => {
                const parsedData = result.data;

                const formattedData: Flight[] = parsedData.map((flight: FlightData) => ({
                    startLat: flight.Source_Latitude,
                    startLng: flight.Source_Longitude,
                    endLat: flight.Destination_Latitude,
                    endLng: flight.Destination_Longitude,
                    color: ['white', 'white'],
                }));

                setData(formattedData);
            },
        });
    }, []);

    return {parseData, data};
}

export default useDataParsing;
