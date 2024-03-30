import { type NodeId, NodePosition, type PositionType } from "@/stores/mandal-art";

const CELL_SIZE = 16;

const PreviewCell = ({
  selectedCellPosition,
  selectedGroupPosition,
  targetGroup,
}: {
  selectedCellPosition: PositionType;
  selectedGroupPosition: PositionType;
  targetGroup: PositionType;
}) => {
  const isGroupSelected = selectedGroupPosition === targetGroup;

  const getCurrentCell = (targetPosition: PositionType) => isGroupSelected && targetPosition === selectedCellPosition;

  const getRelatedCell = (targetPosition: PositionType) => {
    // 외각 그룹이고, 현재 셀이 중앙이 아닌 경우는 표시해 줄 필요가 없음
    if (selectedGroupPosition !== NodePosition.centerCenter && selectedCellPosition !== NodePosition.centerCenter)
      return false;

    // 외각 그룹이고 중앙 셀이면, 중앙의 외각 셀을 표시해줘야 함
    if (selectedGroupPosition !== NodePosition.centerCenter && selectedCellPosition === NodePosition.centerCenter) {
      return targetPosition === selectedGroupPosition && targetGroup === NodePosition.centerCenter;
    }

    // 중앙 그룹에 속하면 외각 셀을 표시해줘야 함
    return targetGroup === selectedCellPosition && targetPosition === NodePosition.centerCenter;
  };

  const getBgColor = (targetPosition: PositionType) => {
    if (getCurrentCell(targetPosition)) return "bg-gray-900";
    if (getRelatedCell(targetPosition)) return "bg-gray-300";
    return "bg-white";
  };

  return (
    <div
      className={`grid grid-cols-3 w-[${CELL_SIZE * 3}px] h-[${CELL_SIZE * 3}px] ${
        isGroupSelected && "border-2 border-gray-900"
      }`}
    >
      {Object.values(NodePosition).map((position) => {
        return (
          <div
            key={position}
            className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${getBgColor(position)}`}
          />
        );
      })}
    </div>
  );
};

export const PreviewBoard = ({ id }: { id: NodeId }) => {
  const [groupPosition, cellPosition] = id.split("-") as [PositionType, PositionType];

  return (
    <div className={`grid grid-cols-3 w-[144px] h-[144px] border rounded-sm bg-gray-100`}>
      {Object.values(NodePosition).map((position) => {
        return (
          <PreviewCell
            key={position}
            selectedCellPosition={cellPosition}
            selectedGroupPosition={groupPosition}
            targetGroup={position}
          />
        );
      })}
    </div>
  );
};
