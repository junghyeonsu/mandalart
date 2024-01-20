import ga from "react-ga";

import { Mandalart } from "./components/Mandalart";
import MandalartProvider from "./contexts/MandalartContext";

ga.initialize("G-7S52Y1P368");

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
