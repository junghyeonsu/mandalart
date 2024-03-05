import "reactflow/dist/style.css";

import { useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { useMandalartActions, useMandalartNodes } from "@/stores/mandal-art";

import { DataAdaptDialog } from "./data-adapt-dialog";
import { ImageDownloadButton } from "./image-download-button";
import { ResetButton } from "./reset-button";
import { Updater } from "./updater";
import { UrlCopyButton } from "./url-copy-button";

const nodeTypes = {
  updater: Updater,
};

const Mandalart = () => {
  const nodes = useMandalartNodes();
  const { onNodesChange, setRfInstance, init } = useMandalartActions();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <ResetButton />
      <ImageDownloadButton />
      <UrlCopyButton />
      <DataAdaptDialog />

      <div className="w-[100vh] h-[100vh]">
        <ReactFlow
          nodes={nodes}
          minZoom={0.3}
          maxZoom={2}
          fitView
          onNodesChange={onNodesChange}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background gap={20} size={1} />
        </ReactFlow>
      </div>
    </>
  );
};

export { Mandalart };
