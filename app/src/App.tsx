import {useEffect} from 'react';
import Globe from 'react-globe.gl';
import useDataParsing from './useDataParsing.tsx';

function App() {
  const { data, parseData } = useDataParsing();

  useEffect(() => {
    fetch('/medium.csv')
        .then(response => response.text())
        .then(parseData);
  }, []);

  return (
    <Globe
      arcsData={data}
      arcColor={(d) => d.color}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    />
  );
}

export default App;
