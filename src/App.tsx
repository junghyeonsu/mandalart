import { Mandalart } from "./components/Mandalart";
import MandalartProvider from "./contexts/MandalartContext";

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
