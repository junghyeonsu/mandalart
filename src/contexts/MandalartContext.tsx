/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { produce } from "immer";
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

export interface MandalartItem {
  title: string;
}

export interface MandalartSection {
  position: Position;
  data: MandalartItem[];
}

export interface MandalartContextState {
  mandalartData: MandalartSection[];

  changeMandalartItemTitle: (sectionIndex: number, itemIndex: number, title: string) => void;
  resetMandalartData: () => void;
}

const MandalartContext = createContext<MandalartContextState | undefined>(undefined);

const initialData: MandalartSection[] = [
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
  const [mandalartData, setMandalartData] = useState<MandalartSection[]>(initialData);

  function loadMandalartData() {
    const data = localStorage.getItem(MANDAL_ART_KEY);
    if (data) setMandalartData(JSON.parse(data));
  }

  function resetMandalartData() {
    localStorage.removeItem(MANDAL_ART_KEY);

    setMandalartData((prevData) =>
      produce(prevData, (draft) => {
        draft.forEach((cell) => {
          cell.data.forEach((data) => {
            data.title = "";
          });
        });
      }),
    );
  }

  function changeMandalartItemTitle(sectionIndex: number, itemIndex: number, title: string) {
    setMandalartData((prevData) => {
      const newData = produce(prevData, (draft) => {
        draft[sectionIndex].data[itemIndex].title = title;
      });

      localStorage.setItem(MANDAL_ART_KEY, JSON.stringify(newData));

      return newData;
    });
  }

  useEffect(() => {
    loadMandalartData();
  }, []);

  return (
    <MandalartContext.Provider
      value={{
        mandalartData,
        resetMandalartData,
        changeMandalartItemTitle,
      }}
    >
      {children}
    </MandalartContext.Provider>
  );
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
