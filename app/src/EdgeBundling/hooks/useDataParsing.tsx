import {useCallback, useEffect, useState} from 'react';
import Papa, {ParseResult} from 'papaparse';

/**
 * The FlightData type.
 * In order to work with the CSV library, the *FlightData*
 * members are named after the columns in the CSV data file.
 */
export type FlightData = {
    /**
     * The index of the flight entry.
     */
    index: string;
    /**
     * The source airline code.
     */
    Source_airport: string;
    /**
     * The destination airline code.
     */
    Destination_airport: string;
    /**
     * The source airport name.
     */
    Source_Latitude: string;
    /**
     * The source airport name.
     */
    Source_Longitude: string;
    /**
     * The destination airport name.
     */
    Destination_Latitude: string;
    /**
     * The destination airport name.
     */
    Destination_Longitude: string;
};

/**
 * This hook fetches and parses the data from the given file.
 *  @param file - The file to fetch and parse.
 *  @returns The parsed data.
 */
export function useDataParsing( file: string ): FlightData[] {
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
