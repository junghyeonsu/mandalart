import "reactflow/dist/style.css";

import { Label } from "@radix-ui/react-label";
import { RotateCcwIcon } from "lucide-react";
import { memo } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import type { NodeId, PositionType } from "@/contexts/MandalartContext";
import { type NodeData, useMandalartDispatch, useMandalartState } from "@/contexts/MandalartContext";

import { Input } from "./ui/input";

const CELL_SIZE = 16;
const PreviewCell = ({ cellPosition, isGroupSelected }: { cellPosition: PositionType; isGroupSelected: boolean }) => {
  return (
    <div
      className={`grid grid-cols-3 w-[${CELL_SIZE * 3 + 4}px] h-[${CELL_SIZE * 3 + 4}px] ${
        isGroupSelected && "border-2 border-gray-900"
      }`}
    >
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "topLeft" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "topCenter" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "topRight" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "centerLeft" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "centerCenter" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "centerRight" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "bottomLeft" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "bottomCenter" ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === "bottomRight" ? "bg-black" : "bg-white"
        }`}
      ></div>
    </div>
  );
};

const PreviewBoard = ({ id }: { id: NodeId }) => {
  const [groupPosition, cellPosition] = id.split("-") as [PositionType, PositionType];

  return (
    <div className={`grid grid-cols-3 w-[${CELL_SIZE * 3 * 3 + 4}px] border rounded-sm bg-gray-100`}>
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "topLeft"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "topCenter"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "topRight"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "centerLeft"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "centerCenter"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "centerRight"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "bottomLeft"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "bottomCenter"} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === "bottomRight"} />
    </div>
  );
};

const CustomTextNode = ({ data }: { data: NodeData }) => {
  const { changeData } = useMandalartDispatch();

  const { id, title, description } = data;

  const [, cellPosition] = id.split("-") as [PositionType, PositionType];
  const isCenterCell = cellPosition === "centerCenter";

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeData(id, "title", e.target.value);
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeData(id, "description", e.target.value);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className={`w-[90px] h-[90px] flex flex-col items-center justify-center border border-primary rounded-sm cursor-pointer break-all overflow-auto ${
            isCenterCell ? "bg-gray-100" : "bg-white"
          }`}
        >
          <p className="text-primary font-bold text-sm">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center justify-center">
          <PreviewBoard id={id} />
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
