import { ReactFlowProvider } from "reactflow";

import { Mandalart } from "./components/Mandalart";
import MandalartProvider from "./contexts/MandalartContext";

function App() {
  return (
    <div className="flex items-center justify-center w-full h-dvh h-vh">
      <ReactFlowProvider>
        <MandalartProvider>
          <Mandalart />
        </MandalartProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
