/* eslint-disable no-unused-vars */
import { RotateCcwIcon } from "lucide-react";

import type { ICell, IData } from "@/contexts/MandalartContext";
import { MANDAL_ART_KEY, Position, useMandalart } from "@/contexts/MandalartContext";

import { Textarea } from "./ui/textarea";

function Mandalart() {
  const { cells, setCells, resetCells } = useMandalart();

  return (
    <>
      <RotateCcwIcon onClick={resetCells} className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer" />
      <div className="grid grid-cols-3 gap-4">
        {cells.map((cell, index) => {
          return <Cell key={cell.position} datas={cell.data} setCells={setCells} cellIndex={index} />;
        })}
      </div>
    </>
  );
}

interface CellProps {
  datas: IData[];
  setCells: React.Dispatch<React.SetStateAction<ICell[]>>;
  cellIndex: number;
}

function Cell({ datas, setCells, cellIndex }: CellProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
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
          <div className="w-20 h-20" key={dataIndex}>
            <Textarea
              className="w-full h-full resize-none text-xs"
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
