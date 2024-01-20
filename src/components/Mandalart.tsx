/* eslint-disable no-unused-vars */
import { RotateCcwIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import type { MandalartSection } from "@/contexts/MandalartContext";
import { Position, useMandalart } from "@/contexts/MandalartContext";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

const Mandalart = () => {
  const isLarge = useMediaQuery({ query: "(min-width: 1024px)" });
  const { mandalartData, resetMandalartData } = useMandalart();

  return (
    <>
      <RotateCcwIcon onClick={resetMandalartData} className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer" />
      <div className="grid grid-cols-3 gap-2 lg:gap-4">
        {mandalartData.map((section, sectionPosition) => {
          return isLarge ? (
            <Section key={sectionPosition} sectionData={section} sectionPosition={sectionPosition} modal={false} />
          ) : (
            <Dialog key={sectionPosition}>
              <DialogTrigger>
                <Section sectionData={section} sectionPosition={sectionPosition} />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center">
                <ModalPreviewSection position={sectionPosition} />
                <Section modal sectionData={section} sectionPosition={sectionPosition} />
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </>
  );
};

const ModalPreviewSection = ({ position }: { position: Position }) => {
  return (
    <div className="grid grid-cols-3 gap-1 w-16 h-16">
      <div className={`w-4 h-4 ${position === Position.topLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.topCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.topRight ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.centerLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.centerCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.centerRight ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.bottomLeft ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.bottomCenter ? "bg-primary" : "bg-gray-300"}`} />
      <div className={`w-4 h-4 ${position === Position.bottomRight ? "bg-primary" : "bg-gray-300"}`} />
    </div>
  );
};

interface SectionProps {
  sectionData: MandalartSection;
  sectionPosition: Position;
  modal?: boolean;
}

const Section = ({ sectionData, sectionPosition, modal }: SectionProps) => {
  const { changeMandalartItemTitle } = useMandalart();

  return (
    <div className="grid grid-cols-3 gap-1 lg:gap-2 items-center">
      {sectionData.data.map((item, itemPosition) => {
        const isCenterItem = itemPosition === Position.centerCenter;
        const isCenterSection = sectionPosition === Position.centerCenter;
        const isOutsideSectionCenter = isCenterItem && !isCenterSection;

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          changeMandalartItemTitle(sectionPosition, itemPosition, e.target.value);

          if (isCenterSection) {
            changeMandalartItemTitle(itemPosition, sectionPosition, e.target.value);
          }
        };

        return (
          <div key={itemPosition} className={`lg:w-20 lg:h-20 ${modal ? "w-24 h-24" : "w-10 h-10"}`}>
            <Textarea
              className={`resize-none text-xxs lg:text-sm text-center ${isCenterItem && " font-bold"} ${
                isOutsideSectionCenter && " bg-gray-100"
              }`}
              value={item.title}
              onChange={handleChange}
              readOnly={isOutsideSectionCenter}
            />
          </div>
        );
      })}
    </div>
  );
};

export { Mandalart };
