import { type NodeId, NodePosition, type PositionType } from "@/stores/mandal-art";

const CELL_SIZE = 16;

const PreviewCell = ({ cellPosition, isGroupSelected }: { cellPosition: PositionType; isGroupSelected: boolean }) => {
  return (
    <div
      className={`grid grid-cols-3 w-[${CELL_SIZE * 3}px] h-[${CELL_SIZE * 3}px] ${
        isGroupSelected && "border-2 border-gray-900"
      }`}
    >
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.topLeft ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.topCenter ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.topRight ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.centerLeft ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.centerCenter ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.centerRight ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.bottomLeft ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.bottomCenter ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.bottomRight ? "bg-black" : "bg-white"
        }`}
      ></div>
    </div>
  );
};

export const PreviewBoard = ({ id }: { id: NodeId }) => {
  const [groupPosition, cellPosition] = id.split("-") as [PositionType, PositionType];

  return (
    <div className={`grid grid-cols-3 w-[144px] h-[144px] border rounded-sm bg-gray-100`}>
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.topLeft} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.topCenter} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.topRight} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.centerLeft} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.centerCenter} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.centerRight} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.bottomLeft} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.bottomCenter} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.bottomRight} />
    </div>
  );
};
