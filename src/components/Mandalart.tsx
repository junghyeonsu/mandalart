/* eslint-disable no-unused-vars */
import { useState } from "react";

import { Textarea } from "./ui/textarea";

function Mandalart() {
  const [data, setData] = useState([
    {
      position: "top-left",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "top-center",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "top-right",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "center-left",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "center-center",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "center-right",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "bottom-left",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "bottom-center",
      data: ["", "", "", "", "", "", "", "", ""],
    },
    {
      position: "bottom-right",
      data: ["", "", "", "", "", "", "", "", ""],
    },
  ]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((cell, index) => {
        return (
          <div key={cell.position}>
            <Cell data={cell.data} setData={setData} cellIndex={index} />
          </div>
        );
      })}
    </div>
  );
}

interface CellProps {
  data: string[];
  setData: React.Dispatch<
    React.SetStateAction<
      {
        position: string;
        data: string[];
      }[]
    >
  >;
  cellIndex: number;
}

function Cell({ data, setData, cellIndex }: CellProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((text, dataIndex) => {
        const isCenter = dataIndex === 4;
        const isCenterCell = cellIndex === 4;
        const isReadOnly = isCenter && !isCenterCell;

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setData((prev) => {
            const newData = [...prev];
            newData[cellIndex].data[dataIndex] = e.target.value;

            if (isCenterCell) {
              newData[dataIndex].data[cellIndex] = e.target.value;
            }

            return newData;
          });
        };

        return (
          <div className="w-20 h-20" key={dataIndex}>
            <Textarea
              className="w-full h-full resize-none text-xs"
              value={text}
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
