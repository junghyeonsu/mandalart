/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";

export const MANDAL_ART_KEY = "mandalart";

export enum Position {
  topLeft,
  topCenter,
  topRight,
  centerLeft,
  centerCenter,
  centerRight,
  bottomLeft,
  bottomCenter,
  bottomRight,
}

export interface IData {
  title: string;
}

export interface ICell {
  position: Position;
  data: IData[];
}

interface State {
  cells: ICell[];
  setCells: React.Dispatch<React.SetStateAction<ICell[]>>;
  resetCells: () => void;
}

const MandalartContext = createContext<State | undefined>(undefined);

const initialData = [
  {
    position: Position.topLeft,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.topCenter,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.topRight,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.centerLeft,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.centerCenter,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.centerRight,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.bottomLeft,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.bottomCenter,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
  {
    position: Position.bottomRight,
    data: [
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
      { title: "" },
    ],
  },
];

const MandalartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cells, setCells] = useState<ICell[]>(initialData);

  useEffect(() => {
    const data = localStorage.getItem(MANDAL_ART_KEY);

    if (data) {
      setCells(JSON.parse(data));
    }
  }, []);

  function resetCells() {
    setCells(initialData);
    localStorage.removeItem(MANDAL_ART_KEY);
  }

  return <MandalartContext.Provider value={{ cells, setCells, resetCells }}>{children}</MandalartContext.Provider>;
};

const useMandalart = () => {
  const context = useContext(MandalartContext);

  if (context === undefined) {
    throw new Error("useMandalart must be used within a MandalartProvider");
  }

  return context;
};

export { MandalartContext, useMandalart };

export default MandalartProvider;
