/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { produce } from "immer";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

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
}

export interface MandalartContextDispatch {
  changeMandalartItemTitle: (sectionIndex: number, itemIndex: number, title: string) => void;
  resetMandalartData: () => void;
}

const MandalartStateContext = createContext<MandalartContextState | undefined>(undefined);
const MandalartDispatchContext = createContext<MandalartContextDispatch | undefined>(undefined);

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

  const loadMandalartData = useCallback(() => {
    const data = localStorage.getItem(MANDAL_ART_KEY);
    if (data) setMandalartData(JSON.parse(data));
  }, []);

  const resetMandalartData = useCallback(() => {
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
  }, []);

  const changeMandalartItemTitle = useCallback((sectionIndex: number, itemIndex: number, title: string) => {
    setMandalartData((prevData) => {
      const newData = produce(prevData, (draft) => {
        draft[sectionIndex].data[itemIndex].title = title;
      });

      localStorage.setItem(MANDAL_ART_KEY, JSON.stringify(newData));

      return newData;
    });
  }, []);

  useEffect(() => {
    loadMandalartData();
  }, [loadMandalartData]);

  return (
    <MandalartDispatchContext.Provider
      value={{
        resetMandalartData,
        changeMandalartItemTitle,
      }}
    >
      <MandalartStateContext.Provider
        value={{
          mandalartData,
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
