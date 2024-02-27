import { decompressFromBase64 } from "lz-string";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MANDAL_ART_DATA_STORAGE_KEY, type NodeData, useMandalartActions } from "@/stores/mandalart";

export const DataAdaptDialog = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NodeData[] | null>(null);

  const { updateNode, sync } = useMandalartActions();

  const adaptData = () => {
    setOpen(false);
    if (!data) return;

    data.forEach((node) => updateNode(node.id, node));
    localStorage.setItem(MANDAL_ART_DATA_STORAGE_KEY, JSON.stringify(data));
    sync();

    const url = new URL(window.location.href);
    url.searchParams.delete("data");
    window.history.pushState({}, "", url.toString());
  };

  const cancelData = () => {
    setOpen(false);

    const url = new URL(window.location.href);
    url.searchParams.delete("data");
    window.history.pushState({}, "", url.toString());
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const data = url.searchParams.get("data");

    if (data) {
      const decompressed = decompressFromBase64(data);

      try {
        const parsed = JSON.parse(decompressed);
        console.log("parsed", parsed);

        if (parsed) {
          setOpen(true);
          setData(parsed);
        }
      } catch (error) {
        console.warn("데이터를 파싱하는데 실패했습니다.");
      }
    }
  }, []);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>복사된 데이터로 적용하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            복사된 데이터로 변경되고 기존의 데이터는 날라가요. 신중하게 결정해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelData}>취소하기</AlertDialogCancel>
          <AlertDialogAction onClick={adaptData}>적용하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
