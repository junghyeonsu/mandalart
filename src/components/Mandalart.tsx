/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { Textarea } from "./ui/textarea";

enum Position {
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

const KEY = "mandalart";

interface Data {
  title: string;
  // type?: "text" | "image";
}

interface Cell {
  position: Position;
  data: Data[];
}

function Mandalart() {
  const [cells, setCells] = useState<Cell[]>([
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
  ]);

  useEffect(() => {
    const data = localStorage.getItem(KEY);

    if (data) {
      setCells(JSON.parse(data));
    }
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {cells.map((cell, index) => {
        return (
          <div key={cell.position}>
            <Cell datas={cell.data} setCells={setCells} cellIndex={index} />
          </div>
        );
      })}
    </div>
  );
}

interface CellProps {
  datas: Data[];
  setCells: React.Dispatch<React.SetStateAction<Cell[]>>;
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

            localStorage.setItem(KEY, JSON.stringify(newData));
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
