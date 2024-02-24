/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useDebounce } from "@toss/react";
import { produce } from "immer";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { OnNodesChange, ReactFlowInstance, ReactFlowJsonObject } from "reactflow";
import { type Node, useNodesState } from "reactflow";

import { NodePosition } from "@/stores/mandalart";
import { useMandalartActions, useMandalartDatas } from "@/stores/mandalart";

interface MandalartContextState {
  nodes: Node[];
}

interface MandalartContextDispatch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRfInstance: (instance: any) => void;

  onNodesChange: OnNodesChange;

  save: () => void;

  init: () => void;

  resetNodes: () => void;

  syncData: () => void;

  changeData: (id: NodeId, prop: "title" | "description", value: string) => void;
}

const MandalartStateContext = createContext<MandalartContextState | undefined>(undefined);
const MandalartDispatchContext = createContext<MandalartContextDispatch | undefined>(undefined);

export const MANDAL_ART_FLOW_STORAGE_KEY = "mandalart-flow";
export const MANDAL_ART_DATA_STORAGE_KEY = "mandalart-data";

const GROUP_SIZE = 390;
const GROUP_GAP = 20;
const NODE_SIZE = 120;
const NODE_GAP = 8;

export type PositionType = (typeof NodePosition)[keyof typeof NodePosition];
export type NodeId = `${PositionType}-${PositionType}`;

export interface NodeData {
  id: NodeId;
  title: string;
  description?: string;
}

const initialNodes: Node<NodeData>[] = Object.values(NodePosition)
  .map((position, index) => {
    const groupPosition = {
      x: (index % 3) * (GROUP_SIZE + GROUP_GAP),
      y: Math.floor(index / 3) * (GROUP_SIZE + GROUP_GAP),
    };

    const nodes: Node<NodeData>[] = Object.values(NodePosition).map((nodePosition, index) => {
      const id = `${position}-${nodePosition}` as const;
      return {
        id,
        position: {
          x: (index % 3) * (NODE_SIZE + NODE_GAP) + NODE_GAP + groupPosition.x,
          y: Math.floor(index / 3) * (NODE_SIZE + NODE_GAP) + NODE_GAP + groupPosition.y,
        },
        type: "textUpdater",
        data: { id, title: "", description: "" },
        draggable: false,
        style: { width: NODE_SIZE, height: NODE_SIZE },
      };
    });

    return nodes;
  })
  .flat();

const MandalartProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const datas = useMandalartDatas();
  const { updateNode, reset: resetDatas } = useMandalartActions();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const init = useCallback(() => {
    const flow = localStorage.getItem(MANDAL_ART_FLOW_STORAGE_KEY);
    const data = localStorage.getItem(MANDAL_ART_DATA_STORAGE_KEY);

    if (flow) {
      const flowData = JSON.parse(flow) as ReactFlowJsonObject;
      setNodes(flowData.nodes);
    }

    if (data) {
      const dataData = JSON.parse(data) as NodeData[];
      dataData.forEach((node) => {
        updateNode(node.id, node);
      });
    }
  }, [setNodes, updateNode]);

  const save = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(MANDAL_ART_FLOW_STORAGE_KEY, JSON.stringify(flow));
      localStorage.setItem(MANDAL_ART_DATA_STORAGE_KEY, JSON.stringify(datas));
      console.log("save", datas);
    }
  }, [datas, rfInstance]);

  const syncData = useCallback(() => {
    setNodes((prevNodes) => {
      return produce(prevNodes, (draft) => {
        draft.forEach((node) => {
          const data = datas.find((d) => d.id === node.id);
          if (data) {
            node.data = data;
          }
        });
      });
    });
  }, [datas, setNodes]);

  const resetNodes = useCallback(() => {
    setNodes(initialNodes);
    resetDatas();

    localStorage.removeItem(MANDAL_ART_FLOW_STORAGE_KEY);
    localStorage.removeItem(MANDAL_ART_DATA_STORAGE_KEY);

    syncData();
  }, [resetDatas, setNodes, syncData]);

  const saveDebounced = useDebounce(save, 300);

  const changeData = useCallback(
    (id: NodeId, prop: "title" | "description", value: string) => {
      setNodes((prevNodes) => {
        const [groupPosition, cellPosition] = id.split("-") as [PositionType, PositionType];
        const isCenterGroupCell = groupPosition === NodePosition.centerCenter;
        const isCenterCell = cellPosition === NodePosition.centerCenter;

        return produce(prevNodes, (draft) => {
          const node = draft.find((node) => node.id === id);
          if (node) {
            node.data[prop] = value;
            updateNode(id, { [prop]: value });
          }

          if (isCenterGroupCell) {
            const relatedCell = draft.find((node) => node.id === `${cellPosition}-centerCenter`);
            if (relatedCell) {
              relatedCell.data[prop] = value;
              updateNode(`${cellPosition}-${NodePosition.centerCenter}`, { [prop]: value });
            }
          } else if (isCenterCell) {
            const relatedCell = draft.find((node) => node.id === `centerCenter-${groupPosition}`);
            if (relatedCell) {
              relatedCell.data[prop] = value;
              updateNode(`${NodePosition.centerCenter}-${groupPosition}`, { [prop]: value });
            }
          }
        });
      });

      saveDebounced();
    },
    [saveDebounced, setNodes, updateNode],
  );

  // init
  useEffect(() => {
    init();
  }, [init]);

  return (
    <MandalartDispatchContext.Provider
      value={{
        setRfInstance,
        onNodesChange,
        save,
        init,
        syncData,
        resetNodes,
        changeData,
      }}
    >
      <MandalartStateContext.Provider
        value={{
          nodes,
        }}
      >
        {children}
      </MandalartStateContext.Provider>
    </MandalartDispatchContext.Provider>
  );
};

const useMandalartState = () => {
  const context = useContext(MandalartStateContext);

  if (context === undefined) {
    throw new Error("useMandalartState must be used within a MandalartProvider");
  }

  return context;
};

const useMandalartDispatch = () => {
  const context = useContext(MandalartDispatchContext);

  if (context === undefined) {
    throw new Error("useMandalartDispatch must be used within a MandalartProvider");
  }

  return context;
};

export { useMandalartDispatch, useMandalartState };

export default MandalartProvider;
