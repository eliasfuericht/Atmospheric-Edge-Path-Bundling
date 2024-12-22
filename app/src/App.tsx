import { useState } from 'react';
import EdgeBundlingComponent from './EdgeBundling/EdgeBundlingComponent.tsx';
import UserControls from "./GUI/UserControls.tsx";
import {DataSet} from "./EdgeBundling/EdgeBundling.types.ts";

function App() {

  const [k, setK] = useState(4.0); // Deroute parameter
  const [d, setD] = useState(2.0); // Edge weight parameter
  const [numSegments, setNumSegments] = useState(50); // Curve smoothness
    const [file, setFile] = useState<DataSet | ''>('');

  return (
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
          <EdgeBundlingComponent k={k} d={d} numSegments={numSegments} file={file} />
          <UserControls setK={setK} k={k} setD={setD} d={d} setNumSegments={setNumSegments} numSegments={numSegments} dataSet={file} setDataSet={setFile} />
      </div>
  );
}

export default App;
