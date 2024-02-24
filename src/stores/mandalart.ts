/* eslint-disable no-unused-vars */
import { create } from "zustand";

import type { NodeData } from "@/contexts/MandalartContext";

const Position = {
  topLeft: "topLeft",
  topCenter: "topCenter",
  topRight: "topRight",
  centerLeft: "centerLeft",
  centerCenter: "centerCenter",
  centerRight: "centerRight",
  bottomLeft: "bottomLeft",
  bottomCenter: "bottomCenter",
  bottomRight: "bottomRight",
} as const;

const initialDatas: NodeData[] = Object.values(Position)
  .map((position) => {
    const groupId = `${position}Group` as const;
    const group: NodeData = {
      id: groupId,
      title: "",
    };

    const nodes: NodeData[] = Object.values(Position).map((nodePosition) => {
      const id = `${position}-${nodePosition}` as const;
      return {
        id,
        title: "",
      };
    });

    return [group, ...nodes];
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
