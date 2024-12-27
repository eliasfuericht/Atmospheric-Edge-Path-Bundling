import {useCallback, useEffect, useState} from 'react';
import Papa, {ParseResult} from 'papaparse';

export type FlightData = {
    index: string;
    Source_airport: string;
    Destination_airport: string;
    Source_Latitude: string;
    Source_Longitude: string;
    Destination_Latitude: string;
    Destination_Longitude: string;
};

function useDataParsing( file: string ): FlightData[] {
        const [parsedData, setParsedData] = useState<FlightData[]>([]);

        const parseData = useCallback((csvText: string) => {
            Papa.parse<FlightData>(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (result: ParseResult<FlightData>) => {
                    if (result.errors.length > 0) {
                        console.error('Error parsing data:', result.errors);
                        setParsedData([]);  // set empty on parse error
                    } else {
                        setParsedData(result.data);
                    }
                },
            });
        }, []);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(file);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch file: ${response.statusText}`);
                    }
                    const csvText = await response.text();
                    parseData(csvText);
                } catch (error) {
                    console.error('Error fetching or parsing data:', error);
                    setParsedData([]);  // set empty on fetch error
                }
            };

            void fetchData();
        }, [file, parseData]);

        return parsedData; // Will be empty if file is not found
    }

export default useDataParsing;
