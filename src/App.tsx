import ga from "react-ga";

import { Mandalart } from "./components/Mandalart";
import MandalartProvider from "./contexts/MandalartContext";

const gtagId = import.meta.env.VITE_GTAG_ID;
ga.initialize(gtagId);

function App() {
  return (
    <div className="flex items-center justify-center w-full h-dvh">
      <MandalartProvider>
        <Mandalart />
      </MandalartProvider>
    </div>
  );
}

export default App;
