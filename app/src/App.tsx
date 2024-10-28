import Globe from 'react-globe.gl';
import useDataParsing from './useDataParsing.tsx';
import useNodesAndEdges from './useNodesAndEdges.tsx';
import useEdgeBundling from './useEdgeBundling.tsx';

function App() {
  const parseData = useDataParsing('/medium.csv');
  const { nodesMap, edges} = useNodesAndEdges(parseData);
  const { edgeBundling } = useEdgeBundling();
  const flightPaths = edgeBundling(nodesMap, edges);

  console.log(flightPaths);

  return (
    <Globe
      arcsData={[]}
      arcColor={(d) => d.color}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    />
  );
}

export default App;
