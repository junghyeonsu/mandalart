import { toPng } from "html-to-image";
import { ImageDownIcon } from "lucide-react";
import { memo } from "react";
import { getNodesBounds, getViewportForBounds, useReactFlow } from "reactflow";

import { download } from "@/lib/donwload";

export const ImageDownloadButton = memo(() => {
  const { getNodes } = useReactFlow();

  const downloadMandalartImage = async () => {
    const nodesBounds = getNodesBounds(getNodes());
    const transform = getViewportForBounds(nodesBounds, 1024, 768, 0.5, 2);
    const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;

    const data = await toPng(viewport, {
      backgroundColor: "#ffffff",
      width: 1024,
      height: 768,
      style: {
        width: `1024`,
        height: `768`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
    });

    download("mandalart.png", data);
  };

  return (
    <ImageDownIcon
      onClick={downloadMandalartImage}
      className="fixed top-4 right-12 w-6 h-6 text-primary cursor-pointer z-10"
    />
  );
});
