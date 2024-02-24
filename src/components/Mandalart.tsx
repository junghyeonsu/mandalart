import "reactflow/dist/style.css";

import { Label } from "@radix-ui/react-label";
import { toPng } from "html-to-image";
import { ImageDownIcon, LinkIcon, RotateCcwIcon } from "lucide-react";
import { compressToBase64 } from "lz-string";
import { memo, useCallback } from "react";
import type { NodeProps } from "reactflow";
import ReactFlow, {
  Background,
  Controls,
  getNodesBounds,
  getViewportForBounds,
  MiniMap,
  useReactFlow,
} from "reactflow";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import type { NodeId, PositionType } from "@/contexts/MandalartContext";
import { useMandalartDispatch, useMandalartState } from "@/contexts/MandalartContext";
import { NodePosition, useMandalartDataById, useMandalartDatas } from "@/stores/mandalart";

import { DataAdaptDialog } from "./DataAdaptDialog";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

const CELL_SIZE = 16;
const PreviewCell = ({ cellPosition, isGroupSelected }: { cellPosition: PositionType; isGroupSelected: boolean }) => {
  return (
    <div
      className={`grid grid-cols-3 w-[${CELL_SIZE * 3}px] h-[${CELL_SIZE * 3}px] ${
        isGroupSelected && "border-2 border-gray-900"
      }`}
    >
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.topLeft ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.topCenter ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.topRight ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.centerLeft ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.centerCenter ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.centerRight ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.bottomLeft ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.bottomCenter ? "bg-black" : "bg-white"
        }`}
      ></div>
      <div
        className={`w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-300 ${
          isGroupSelected && cellPosition === NodePosition.bottomRight ? "bg-black" : "bg-white"
        }`}
      ></div>
    </div>
  );
};

const PreviewBoard = ({ id }: { id: NodeId }) => {
  const [groupPosition, cellPosition] = id.split("-") as [PositionType, PositionType];

  return (
    <div className={`grid grid-cols-3 w-[144px] h-[144px] border rounded-sm bg-gray-100`}>
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.topLeft} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.topCenter} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.topRight} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.centerLeft} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.centerCenter} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.centerRight} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.bottomLeft} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.bottomCenter} />
      <PreviewCell cellPosition={cellPosition} isGroupSelected={groupPosition === NodePosition.bottomRight} />
    </div>
  );
};

const CustomTextNode = (props: NodeProps) => {
  const id = props.id as NodeId;
  const { changeData } = useMandalartDispatch();
  const data = useMandalartDataById(id);
  const [, cellPosition] = id.split("-") as [PositionType, PositionType];
  const isCenterCell = cellPosition === NodePosition.centerCenter;

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeData(id, "title", e.target.value);
    },
    [changeData, id],
  );
  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeData(id, "description", e.target.value);
    },
    [changeData, id],
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className={`w-[120px] h-[120px] flex flex-col items-center justify-center border border-primary rounded-sm cursor-pointer break-all overflow-auto text-center ${
            isCenterCell ? "bg-gray-100" : "bg-white"
          }`}
        >
          <p className="text-primary font-bold text-sm whitespace-pre">{data?.title}</p>
          <p className="text-muted-foreground text-xs whitespace-pre">{data?.description}</p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-evenly">
          <div className="flex flex-col gap-2 items-center justify-center">
            <PreviewBoard id={id} />
            <span className="text-gray-500 text-xs">현재 칸</span>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="flex flex-col items-center justify-center w-[144px] h-[144px] border border-primary rounded-sm break-all overflow-auto text-center">
              <p className="text-primary font-bold text-[16px] whitespace-pre">{data?.title}</p>
              <p className="text-muted-foreground text-sm whitespace-pre">{data?.description}</p>
            </div>
            <span className="text-gray-500 text-xs">미리보기</span>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <div className="flex flex-col gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title">만다라트 제목</Label>
              <Textarea id="title" value={data?.title} onChange={onChangeTitle} />
              <p className="text-xs text-muted-foreground">핵심적인 문장을 적어주세요.</p>
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="title">만다라트 설명</Label>
              <Textarea id="title" value={data?.description} onChange={onChangeDescription} />
              <p className="text-xs text-muted-foreground">해당 만다라트에 대한 설명을 적어주세요.</p>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const nodeTypes = { textUpdater: CustomTextNode };

const Mandalart = () => {
  const { nodes } = useMandalartState();
  const { onNodesChange, setRfInstance } = useMandalartDispatch();

  return (
    <>
      <ResetButton />
      <ImageDownloadButton />
      <CopyUrlButton />
      <DataAdaptDialog />

      <div className="w-[100vh] h-[100vh]">
        <ReactFlow
          minZoom={0.3}
          maxZoom={2}
          fitView
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onInit={setRfInstance}
        >
          <Controls />
          <MiniMap />
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>
    </>
  );
};

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "mandalart.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const CopyUrlButton = () => {
  const { toast } = useToast();
  const datas = useMandalartDatas();

  const copy = () => {
    const stringified = JSON.stringify(datas);
    const compressed = compressToBase64(stringified);

    const url = new URL(window.location.href);
    url.searchParams.set("data", compressed);
    navigator.clipboard.writeText(url.href);

    toast({
      title: "URL이 복사되었습니다.",
      description: "만다라트를 공유할 수 있습니다.",
      duration: 3000,
    });
  };

  return <LinkIcon onClick={copy} className="fixed top-4 right-20 w-6 h-6 text-primary cursor-pointer z-10" />;
};

const ImageDownloadButton = memo(() => {
  const { getNodes } = useReactFlow();

  const download = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const transform = getViewportForBounds(nodesBounds, 1024, 768, 0.5, 2);

    const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;

    toPng(viewport, {
      backgroundColor: "#ffffff",
      width: 1024,
      height: 768,
      style: {
        width: `1024`,
        height: `768`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    }).then(downloadImage);
  };

  return <ImageDownIcon onClick={download} className="fixed top-4 right-12 w-6 h-6 text-primary cursor-pointer z-10" />;
});

const ResetButton = memo(() => {
  const { resetNodes } = useMandalartDispatch();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <RotateCcwIcon className="fixed top-4 right-4 w-6 h-6 text-primary cursor-pointer z-10" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>모든 데이터를 삭제하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>모든 데이터가 날아가요.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소하기</AlertDialogCancel>
          <AlertDialogAction onClick={resetNodes}>삭제하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export { Mandalart };
