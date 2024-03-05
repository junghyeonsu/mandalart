import { RotateCcwIcon } from "lucide-react";
import { memo } from "react";

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
import { useMandalartActions } from "@/stores/mandal-art";

export const ResetButton = memo(() => {
  const { reset } = useMandalartActions();
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
          <AlertDialogAction onClick={reset}>삭제하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
