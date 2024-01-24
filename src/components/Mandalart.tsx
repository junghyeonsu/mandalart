/* eslint-disable no-unused-vars */
import "reactflow/dist/style.css";

import { RotateCcwIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import type { Edge, Node, OnEdgesChange, OnNodesChange } from "reactflow";
import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap } from "reactflow";

import type { MandalartItem, MandalartSection } from "@/contexts/MandalartContext";
import { Position, useMandalartDispatch, useMandalartState } from "@/contexts/MandalartContext";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

const centerNodes: Node[] = [
  { id: "A", type: "group", position: { x: 100, y: 100 }, data: { label: null }, style: { width: 300, height: 500 } },
  { id: "B", type: "input", extent: "parent", position: { x: 80, y: 100 }, data: { label: "1" }, parentNode: "A" },
  { id: "C", type: "input", extent: "parent", position: { x: 80, y: 200 }, data: { label: "2" }, parentNode: "A" },
  { id: "D", type: "input", extent: "parent", position: { x: 80, y: 300 }, data: { label: "3" }, parentNode: "A" },
  { id: "E", type: "input", extent: "parent", position: { x: 80, y: 400 }, data: { label: "4" }, parentNode: "A" },
];

const initialNodes: Node[] = [...centerNodes];
const initialEdges: Edge[] = [{ id: "eB-C", source: "B", target: "C" }];

const Mandalart = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const isLarge = useMediaQuery({ query: "(min-width: 1024px)" });
  const { mandalartData } = useMandalartState();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  return (
    <>
      <ResetButton />

      <div className="w-[100vh] h-[100vh] border-4 border-rose-500">
        <ReactFlow fitView nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
          <Controls />
          <MiniMap />
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* <div className="grid grid-cols-3 gap-2 lg:gap-4">
        {mandalartData.map((section, sectionPosition) => {
          return isLarge ? (
            <Section key={sectionPosition} sectionData={section} sectionPosition={sectionPosition} modal={false} />
          ) : (
            <Dialog key={sectionPosition}>
              <DialogTrigger>
                <Section sectionData={section} sectionPosition={sectionPosition} />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center">
                <ModalPreviewSection position={sectionPosition} />
                <Section modal sectionData={section} sectionPosition={sectionPosition} />
              </DialogContent>
            </Dialog>
          );
        })}
      </div> */}
    </>
  );
};

const ResetButton = memo(() => {
  const { resetMandalartData } = useMandalartDispatch();
  return (
    <RotateCcwIcon onClick={resetMandalartData} className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer" />
  );
});

const ModalPreviewSection = ({ position }: { position: Position }) => {
  return (
    <div className="grid grid-cols-3 gap-1 w-16 h-16">
      <div className={`w-4 h-4 ${position === Position.topLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.topCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.topRight ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.centerLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.centerCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.centerRight ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.bottomLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.bottomCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.bottomRight ? "bg-primary" : "bg-gray-300"}`} />
    </div>
  );
};

interface SectionProps {
  sectionData: MandalartSection;
  sectionPosition: Position;
  modal?: boolean;
}

const Section = ({ sectionData, sectionPosition, modal }: SectionProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 lg:gap-2 items-center">
      {sectionData.data.map((item, itemPosition) => {
        return (
          <Item
            key={`${sectionPosition}+${itemPosition}`}
            item={item}
            itemPosition={itemPosition}
            sectionPosition={sectionPosition}
            modal={modal}
          />
        );
      })}
    </div>
  );
};

interface ItemProps {
  item: MandalartItem;
  itemPosition: Position;
  sectionPosition: Position;
  modal?: boolean;
}

const Item = memo(({ item, itemPosition, sectionPosition, modal }: ItemProps) => {
  const { changeMandalartItemTitle } = useMandalartDispatch();

  const isCenterItem = useMemo(() => itemPosition === Position.centerCenter, [itemPosition]);
  const isCenterSection = useMemo(() => sectionPosition === Position.centerCenter, [sectionPosition]);
  const isOutsideSectionCenter = useMemo(() => isCenterItem && !isCenterSection, [isCenterItem, isCenterSection]);
  const title = useMemo(() => item.title, [item.title]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeMandalartItemTitle(sectionPosition, itemPosition, e.target.value);

      if (isCenterSection) {
        changeMandalartItemTitle(itemPosition, sectionPosition, e.target.value);
      }
    },
    [changeMandalartItemTitle, isCenterSection, itemPosition, sectionPosition],
  );

  return (
    <div key={itemPosition} className={`lg:w-20 lg:h-20 ${modal ? "w-24 h-24" : "w-10 h-10"}`}>
      <Textarea
        className={`resize-none text-xxs lg:text-sm text-center ${isCenterItem && "font-bold"} ${
          isOutsideSectionCenter && "bg-gray-100"
        }`}
        value={title}
        onChange={handleChange}
        readOnly={isOutsideSectionCenter}
      />
    </div>
  );
});

export { Mandalart };
