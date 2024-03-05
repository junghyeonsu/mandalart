/* eslint-disable no-unused-vars */
import type { OnNodesChange, ReactFlowInstance, ReactFlowJsonObject } from "reactflow";
import { applyNodeChanges, type Node } from "reactflow";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const GROUP_SIZE = 390;
const GROUP_GAP = 20;
const NODE_SIZE = 120;
const NODE_GAP = 8;

export const MANDAL_ART_DATA_STORAGE_KEY = "mandalart-data";
export const MANDAL_ART_FLOW_STORAGE_KEY = "mandalart-flow";

export type PositionType = (typeof NodePosition)[keyof typeof NodePosition];
export type NodeId = `${PositionType}-${PositionType}`;

export interface NodeData {
  id: NodeId;
  title?: string;
  description?: string;
  bgColor?: string;
}

export const NodePosition = {
  topLeft: "11",
  topCenter: "12",
  topRight: "13",
  centerLeft: "21",
  centerCenter: "22",
  centerRight: "23",
  bottomLeft: "31",
  bottomCenter: "32",
  bottomRight: "33",
} as const;

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
        type: "updater",
        data: { id },
        draggable: false,
        style: { width: NODE_SIZE, height: NODE_SIZE },
      };
    });

    return nodes;
  })
  .flat();

const initialDatas: NodeData[] = Object.values(NodePosition)
  .map((groupPosition) => {
    const nodes: NodeData[] = Object.values(NodePosition).map((nodePosition) => {
      const id = `${groupPosition}-${nodePosition}` as const;
      return {
        id,
      };
    });

    return nodes;
  })
  .flat();

interface MandalartState {
  datas: NodeData[];
  nodes: Node<NodeData>[];
  rfInstance: ReactFlowInstance | null;
  actions: {
    changeDatas: (datas: NodeData[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateNode: (id: NodeData["id"], data: any, part: Exclude<keyof NodeData, "id">) => void;
    reset: () => void;
    init: () => void;
    save: () => void;
    sync: () => void;

    /* NOTE: ReactFlow Actions */
    onNodesChange: OnNodesChange;
    setRfInstance: (instance: ReactFlowInstance) => void;
  };
}

const useMandalartStore = create<MandalartState>()(
  immer((set, get) => ({
    datas: initialDatas,
    nodes: initialNodes,
    rfInstance: null,
    actions: {
      changeDatas: (datas) => {
        set({ datas });
      },
      updateNode: (id, data, part) => {
        const [groupPosition, nodePosition] = id.split("-") as [PositionType, PositionType];
        const isCenterGroup = groupPosition === NodePosition.centerCenter;
        const isCenterNode = nodePosition === NodePosition.centerCenter;

        set((state) => {
          const node = state.datas.find((node) => node.id === id);
          if (!node) return;

          if (node) {
            node[part] = data;
          }

          if (isCenterGroup) {
            const relatedNode = state.datas.find((node) => node.id === `${nodePosition}-${NodePosition.centerCenter}`);
            if (relatedNode) {
              relatedNode[part] = data;
            }
          } else if (isCenterNode) {
            const relatedNode = state.datas.find((node) => node.id === `${NodePosition.centerCenter}-${groupPosition}`);
            if (relatedNode) {
              relatedNode[part] = data;
            }
          }

          return state;
        });
      },
      reset: () => {
        set({ datas: initialDatas });
        set({ nodes: initialNodes });

        localStorage.removeItem(MANDAL_ART_FLOW_STORAGE_KEY);
        localStorage.removeItem(MANDAL_ART_DATA_STORAGE_KEY);
      },
      init: () => {
        const flow = localStorage.getItem(MANDAL_ART_FLOW_STORAGE_KEY);
        const data = localStorage.getItem(MANDAL_ART_DATA_STORAGE_KEY);

        if (flow) {
          const flowData = JSON.parse(flow) as ReactFlowJsonObject;
          set({ nodes: flowData.nodes });
        }

        if (data) {
          const dataData = JSON.parse(data) as NodeData[];
          set({ datas: dataData });
        }
      },
      save: () => {
        const instance = get().rfInstance;
        if (instance) {
          const flow = instance.toObject();
          localStorage.setItem(MANDAL_ART_FLOW_STORAGE_KEY, JSON.stringify(flow));
          localStorage.setItem(MANDAL_ART_DATA_STORAGE_KEY, JSON.stringify(get().datas));
        }
      },
      sync: () => {
        set((state) => {
          state.nodes = state.nodes.map((node) => {
            const data = state.datas.find((d) => d.id === node.id);
            if (data) {
              node.data = data;
            }
            return node;
          });
        });
      },

      /* NOTE: ReactFlow Actions */
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      setRfInstance: (instance) => {
        set({ rfInstance: instance });
      },
    },
  })),
);

export const useMandalartNodes = () => useMandalartStore((state) => state.nodes);
export const useMandalartDatas = () => useMandalartStore((state) => state.datas);
export const useMandalartDataById = (id: NodeData["id"]) =>
  useMandalartStore((state) => state.datas.find((node) => node.id === id));
export const useMandalartActions = () => useMandalartStore((state) => state.actions);
