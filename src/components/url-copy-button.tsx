import { LinkIcon } from "lucide-react";
import { compressToBase64 } from "lz-string";

import { useToast } from "@/components/ui/use-toast";
import { useMandalartDatas } from "@/stores/mandal-art";

export const UrlCopyButton = () => {
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

  return <LinkIcon onClick={copy} className="w-6 h-6 text-primary cursor-pointer z-10" />;
};
