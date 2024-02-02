/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { useDebounce } from "@toss/react";
import { produce } from "immer";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { OnNodesChange, ReactFlowInstance, ReactFlowJsonObject } from "reactflow";
import { type Node, useNodesState } from "reactflow";

interface MandalartContextState {
  nodes: Node[];
}

interface MandalartContextDispatch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setRfInstance: (instance: any) => void;

  onNodesChange: OnNodesChange;

  save: () => void;

  resetNodes: () => void;

  changeData: (id: string, prop: "title" | "description", value: string) => void;
}

const MandalartStateContext = createContext<MandalartContextState | undefined>(undefined);
const MandalartDispatchContext = createContext<MandalartContextDispatch | undefined>(undefined);

const FLOW_KEY = "mandalart-flow";

const GROUP_SIZE = 300;
const GROUP_GAP = 20;
const NODE_SIZE = 90;
const NODE_GAP = 8;

export const Position = {
  topLeft: "topLeft",
  topCenter: "topCenter",
  topRight: "topRight",
  centerLeft: "centerLeft",
  centerCenter: "centerCenter",
  centerRight: "centerRight",
  bottomLeft: "bottomLeft",
  bottomCenter: "bottomCenter",
  bottomRight: "bottomRight",
};

export interface NodeData {
  id: string;
  title: string;
  description?: string;
}

const initialNodes: Node<NodeData>[] = Object.values(Position)
  .map((position, index) => {
    const groupId = `${position}Group`;
    const group: Node<NodeData> = {
      id: groupId,
      type: "group",
      position: { x: (index % 3) * (GROUP_SIZE + GROUP_GAP), y: Math.floor(index / 3) * (GROUP_SIZE + GROUP_GAP) },
      data: { id: groupId, title: "" },
      draggable: false,
      style: { width: GROUP_SIZE, height: GROUP_SIZE },
    };

    const nodes: Node<NodeData>[] = Object.values(Position).map((nodePosition, index) => {
      const id = `${position}-${nodePosition}`;
      return {
        id,
        extent: "parent",
        position: {
          x: (index % 3) * (NODE_SIZE + NODE_GAP) + NODE_GAP,
          y: Math.floor(index / 3) * (NODE_SIZE + NODE_GAP) + NODE_GAP,
        },
        type: "textUpdater",
        data: { id, title: "" },
        draggable: false,
        parentNode: `${position}Group`,
        style: { width: NODE_SIZE, height: NODE_SIZE },
      };
    });

    return [group, ...nodes];
  })
  .flat();

const MandalartProvider = ({ children }: { children: React.ReactNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const save = useCallback(() => {
    if (rfInstance) {
      console.log("save 실행!", nodes);
      const flow = rfInstance.toObject();
      localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
    }
  }, [nodes, rfInstance]);

  const resetNodes = useCallback(() => {
    setNodes(initialNodes);
    localStorage.removeItem(FLOW_KEY);
  }, [setNodes]);

  const saveDebounced = useDebounce(save, 300);

  const changeData = useCallback(
    (id: string, prop: "title" | "description", value: string) => {
      setNodes((prevNodes) => {
        return produce(prevNodes, (draft) => {
          const node = draft.find((node) => node.id === id);
          if (node) {
            node.data[prop] = value;
          }
        });
      });
      saveDebounced();
    },
    [saveDebounced, setNodes],
  );

  // init
  useEffect(() => {
    const flow = localStorage.getItem(FLOW_KEY);

    if (flow) {
      const flowData = JSON.parse(flow) as ReactFlowJsonObject;
      setNodes(flowData.nodes);
    }
  }, [setNodes]);

  return (
    <MandalartDispatchContext.Provider
      value={{
        setRfInstance,
        onNodesChange,
        save,
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
