import "reactflow/dist/style.css";

import { Label } from "@radix-ui/react-label";
import { RotateCcwIcon } from "lucide-react";
import { memo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { type NodeData, useMandalartDispatch, useMandalartState } from "@/contexts/MandalartContext";

import { Input } from "./ui/input";

const CustomTextNode = ({ data }: { data: NodeData }) => {
  const { changeData } = useMandalartDispatch();

  const { id, title, description } = data;

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeData(id, "title", e.target.value);
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeData(id, "description", e.target.value);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="w-[90px] h-[90px] flex flex-col items-center justify-center border border-primary rounded-sm cursor-pointer bg-white">
          <p className="text-primary">{title}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{id}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <div className="flex flex-col gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title">만다라트 제목</Label>
              <Input id="title" value={title} onInput={onChangeTitle} className={`resize-none`} />
              <p className="text-xs text-muted-foreground">핵심적인 문장을 적어주세요.</p>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title">만다라트 설명</Label>
              <Input id="title" value={description} onInput={onChangeDescription} className={`resize-none`} />
              <p className="text-xs text-muted-foreground">해당 만다라트에 대한 설명을 적어주세요.</p>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const nodeTypes = { textUpdater: CustomTextNode };

const Mandalart = () => {
  const { nodes } = useMandalartState();
  const { onNodesChange, setRfInstance } = useMandalartDispatch();

  return (
    <>
      <ResetButton />

      <div className="w-[100vh] h-[100vh]">
        <ReactFlow
          minZoom={0.3}
          maxZoom={2}
          fitView
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
        >
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
  return (
    <RotateCcwIcon onClick={resetNodes} className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer z-10" />
  );
});

export { Mandalart };
