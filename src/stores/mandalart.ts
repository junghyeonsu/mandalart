/* eslint-disable no-unused-vars */
import { create } from "zustand";

import type { NodeData } from "@/contexts/MandalartContext";

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

const initialDatas: NodeData[] = Object.values(NodePosition)
  .map((position) => {
    const nodes: NodeData[] = Object.values(NodePosition).map((nodePosition) => {
      const id = `${position}-${nodePosition}` as const;
      return {
        id,
        title: "",
      };
    });

    return nodes;
  })
  .flat();

interface MandalartState {
  datas: NodeData[];
  actions: {
    updateNode: (id: NodeData["id"], data: Partial<NodeData>) => void;
  };
}

const useMandalartStore = create<MandalartState>((set) => ({
  datas: initialDatas,
  actions: {
    updateNode: (id, data) => {
      set((state) => {
        const index = state.datas.findIndex((node) => node.id === id);
        state.datas[index] = { ...state.datas[index], ...data };
        return state;
      });
    },
  },
}));

export const useMandalartDatas = () => useMandalartStore((state) => state.datas);
export const useMandalartDataById = (id: NodeData["id"]) =>
  useMandalartStore((state) => state.datas.find((node) => node.id === id));
export const useMandalartActions = () => useMandalartStore((state) => state.actions);
