/* eslint-disable no-unused-vars */
import { RotateCcwIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import type { ICell, IData } from "@/contexts/MandalartContext";
import { MANDAL_ART_KEY, Position, useMandalart } from "@/contexts/MandalartContext";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

function Mandalart() {
  const isLarge = useMediaQuery({ query: "(min-width: 1024px)" });
  const { cells, setCells, resetCells } = useMandalart();

  return (
    <>
      <RotateCcwIcon onClick={resetCells} className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer" />
      <div className="grid grid-cols-3 gap-2 lg:gap-4">
        {cells.map((cell, index) => {
          return isLarge ? (
            <Cell key={cell.position} datas={cell.data} setCells={setCells} cellIndex={index} />
          ) : (
            <Dialog key={cell.position}>
              <DialogTrigger>
                <Cell datas={cell.data} setCells={setCells} cellIndex={index} />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center">
                <ModalPreviewCell index={index} />
                <Cell modal datas={cell.data} setCells={setCells} cellIndex={index} />
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </>
  );
}

function ModalPreviewCell({ index }: { index: Position }) {
  return (
    <div className="grid grid-cols-3 gap-1 w-16 h-16">
      <div className={`w-4 h-4 ${index === Position.topLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.topCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.topRight ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.centerLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.centerCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.centerRight ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.bottomLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.bottomCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${index === Position.bottomRight ? "bg-primary" : "bg-gray-300"}`} />
    </div>
  );
}

interface CellProps {
  datas: IData[];
  setCells: React.Dispatch<React.SetStateAction<ICell[]>>;
  cellIndex: number;
  modal?: boolean;
}

function Cell({ datas, setCells, cellIndex, modal }: CellProps) {
  return (
    <div className="grid grid-cols-3 gap-1 lg:gap-2 items-center">
      {datas.map((data, dataIndex) => {
        const isCenterData = dataIndex === Position.centerCenter;
        const isCenterCell = cellIndex === Position.centerCenter;
        const isReadOnly = isCenterData && !isCenterCell;

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setCells((prev) => {
            const newData = [...prev];
            newData[cellIndex].data[dataIndex].title = e.target.value;

            if (isCenterCell) {
              newData[dataIndex].data[cellIndex].title = e.target.value;
            }

            localStorage.setItem(MANDAL_ART_KEY, JSON.stringify(newData));
            return newData;
          });
        };

        return (
          <div key={dataIndex} className={`lg:w-20 lg:h-20 ${modal ? "w-24 h-24" : "w-10 h-10"}`}>
            <Textarea
              className={`resize-none text-xxs lg:text-sm text-center ${isCenterData && " font-bold"} ${
                isReadOnly && " bg-gray-100"
              }`}
              value={data.title}
              onChange={handleChange}
              readOnly={isReadOnly}
            />
          </div>
        );
      })}
    </div>
  );
}

export { Mandalart };
