import "reactflow/dist/style.css";

import { RotateCcwIcon } from "lucide-react";
import { memo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { type NodeData, useMandalartDispatch, useMandalartState } from "@/contexts/MandalartContext";

import { Textarea } from "./ui/textarea";

const CustomTextNode = ({ data }: { data: NodeData }) => {
  const { changeTitle } = useMandalartDispatch();

  const { id, title } = data;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeTitle(id, e.target.value);
  };

  return <Textarea value={title} onChange={onChange} className={`resize-none text-center`} />;
};

const nodeTypes = { textUpdater: CustomTextNode };

const Mandalart = () => {
  const { nodes } = useMandalartState();
  const { onNodesChange, setRfInstance } = useMandalartDispatch();

  return (
    <>
      <ResetButton />

      <div className="w-[100vh] h-[100vh] border-2 border-rose-500">
        <ReactFlow fitView nodes={nodes} onNodesChange={onNodesChange} nodeTypes={nodeTypes} onInit={setRfInstance}>
          <Controls />
          <MiniMap />
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>
    </>
  );
};

const ResetButton = memo(() => {
  const { resetNodes } = useMandalartDispatch();
  return <RotateCcwIcon onClick={resetNodes} className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer" />;
});

export { Mandalart };
