import { Label } from "@radix-ui/react-label";
import { useDebounce } from "@toss/react";
import { useCallback } from "react";
import { GithubPicker } from "react-color";
import { useMediaQuery } from "react-responsive";
import type { NodeProps } from "reactflow";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import {
  type NodeId,
  NodePosition,
  type PositionType,
  useMandalartActions,
  useMandalartDataById,
} from "@/stores/mandal-art";

import { PreviewBoard } from "./preview-board";

export const Updater = (props: NodeProps) => {
  const id = props.id as NodeId;
  const { updateNode, save } = useMandalartActions();
  const isDesktop = useMediaQuery({
    query: "(min-width: 600px)",
  });
  const data = useMandalartDataById(id);
  const [, cellPosition] = id.split("-") as [PositionType, PositionType];
  const isCenterCell = cellPosition === NodePosition.centerCenter;

  const saveDebounced = useDebounce(save, 300);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNode(id, e.target.value, "title");
      saveDebounced();
    },
    [id, saveDebounced, updateNode],
  );
  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNode(id, e.target.value, "description");
      saveDebounced();
    },
    [id, saveDebounced, updateNode],
  );
  const onChangeBgColor = useCallback(
    (color: { hex: string }) => {
      updateNode(id, color.hex, "bgColor");
      saveDebounced();
    },
    [id, saveDebounced, updateNode],
  );

  const trigger = (
    <div
      className={`w-[120px] h-[120px] flex flex-col items-center justify-center border border-primary rounded-sm cursor-pointer break-all overflow-auto text-center`}
      style={{
        backgroundColor: data?.bgColor ? `${data?.bgColor}` : isCenterCell ? "#f3f4f6" : "white",
      }}
    >
      <p className="text-primary font-bold text-sm whitespace-pre">{data?.title}</p>
      <p className="text-muted-foreground text-xs whitespace-pre">{data?.description}</p>
    </div>
  );

  const content = (
    <>
      <div className="flex items-center justify-evenly space-y-1.5 p-2">
        <div className="flex flex-col gap-2 items-center justify-center">
          <PreviewBoard id={id} />
          <div className="flex gap-3">
            <div className="flex justify-center items-center gap-1">
              <div className="w-[10px] h-[10px] bg-gray-900 rounded-[1px]" />
              <span className="text-gray-500 text-xs">현재칸</span>
            </div>
            <div className="flex justify-center items-center gap-1">
              <div className="w-[10px] h-[10px] bg-gray-400 rounded-[1px]" />
              <span className="text-gray-500 text-xs">연관칸</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div
            className={`flex flex-col items-center justify-center w-[144px] h-[144px] border border-primary rounded-sm break-all overflow-auto text-center`}
            style={{
              backgroundColor: data?.bgColor ? `${data?.bgColor}` : "white",
            }}
          >
            <p className="text-primary font-bold text-[16px] whitespace-pre">{data?.title}</p>
            <p className="text-muted-foreground text-sm whitespace-pre">{data?.description}</p>
          </div>
          <span className="text-gray-500 text-xs">미리보기</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-evenly gap-2">
        <GithubPicker
          width="264px"
          triangle="hide"
          color={data?.bgColor}
          onChange={onChangeBgColor}
          styles={{
            default: {
              card: {
                boxShadow: "none",
              },
              triangleShadow: {
                display: "none",
              },
            },
          }}
          colors={[
            "#FFF",
            "#F3F4F6",
            "#EB9694",
            "#FAD0C3",
            "#FEF3BD",
            "#C1E1C5",
            "#BEDADC",
            "#C4DEF6",
            "#BED3F3",
            "#D4C4FB",
          ]}
        />
        <span className="text-gray-500 text-xs">배경색</span>
      </div>

      <div className="flex flex-col gap-4 mt-auto p-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="title">만다라트 제목</Label>
          <Textarea id="title" value={data?.title} onChange={onChangeTitle} spellCheck={false} />
          <p className="text-xs text-muted-foreground">핵심적인 문장을 적어주세요.</p>
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="title">만다라트 설명</Label>
          <Textarea id="title" value={data?.description} onChange={onChangeDescription} spellCheck={false} />
          <p className="text-xs text-muted-foreground">해당 만다라트에 대한 설명을 적어주세요.</p>
        </div>
      </div>
    </>
  );

  return isDesktop ? (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>{content}</DrawerContent>
    </Drawer>
  );
};
