import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';
import Papa from 'papaparse';

function App() {
  const [arcsData, setArcsData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the CSV file
    fetch('/small.csv')
      .then((response) => response.text())
      .then((csvText) => {
        // Parse CSV data
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            const parsedData = result.data;

            const formattedData = parsedData.map((flight: any) => ({
              startLat: parseFloat(flight['Source_Latitude']),
              startLng: parseFloat(flight['Source_Longitude']),
              endLat: parseFloat(flight['Destination_Latitude']),
              endLng: parseFloat(flight['Destination_Longitude']),
              color: ['blue', 'green'], // You can customize the colors
            }));

            setArcsData(formattedData);
          },
        });
      });
  }, []);

  return (
    <Globe
      arcsData={arcsData}
      arcColor={(d) => d.color}
      arcDashLength={0.4}
      arcDashGap={1}
      arcDashAnimateTime={1500}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    />
  );
}

export default App;
