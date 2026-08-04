import React, { useMemo } from "react";
import ReactFlow, {
  Handle,
  Position,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

interface WorkflowCanvasProps {
  showEarnpaste: boolean;
  onGetKeyClick: () => void;
  onEarnpasteClick: () => void;
}

// Custom Node for Get Key Button (Clean, no dots, no resize on click)
const GetKeyNode = ({ data }: { data: { onClick: () => void } }) => {
  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={data.onClick}
        className="flex items-center justify-center px-8 py-4 rounded-full bg-[#1c1c21] border border-zinc-700/60 hover:bg-[#26262d] hover:border-zinc-500/70 transition-all duration-200 shadow-lg group cursor-pointer"
      >
        <span className="text-white text-xl font-bold tracking-wide">Get Key</span>
      </button>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0,
          width: 1,
          height: 1,
          minWidth: 1,
          minHeight: 1,
          bottom: 0,
          background: "transparent",
          border: "none",
        }}
      />
    </div>
  );
};

// Custom Node for Earnpaste Button (Clean, no dots, no resize on click)
const EarnpasteNode = ({ data }: { data: { onClick: () => void } }) => {
  return (
    <div className="relative flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0,
          width: 1,
          height: 1,
          minWidth: 1,
          minHeight: 1,
          top: 0,
          background: "transparent",
          border: "none",
        }}
      />
      <button
        type="button"
        onClick={data.onClick}
        className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#1c1c21] border border-zinc-700/60 hover:bg-[#26262d] hover:border-zinc-500/70 transition-all duration-200 shadow-lg group cursor-pointer"
      >
        <img
          src="https://yt3.ggpht.com/OV2tg0DmV-NvTvzSr6bxSXMXRG8TMBTOJOzgBfHTzV2x0KPSLDP5yufzsmKEmzfovbSDd3A1=s88-c-k-c0xffffffff-no-rj-mo"
          alt="Earnpaste"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="w-6 h-6 rounded-full object-cover shrink-0"
        />
        <span className="text-white text-xl font-bold tracking-wide">Earnpaste</span>
      </button>
    </div>
  );
};

const nodeTypes = {
  getKeyNode: GetKeyNode,
  earnpasteNode: EarnpasteNode,
};

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  showEarnpaste,
  onGetKeyClick,
  onEarnpasteClick,
}) => {
  const nodes: Node[] = useMemo(() => {
    const list: Node[] = [
      {
        id: "get-key",
        type: "getKeyNode",
        position: { x: 140, y: 10 },
        data: { onClick: onGetKeyClick },
        selectable: false,
        draggable: false,
      },
    ];

    if (showEarnpaste) {
      list.push({
        id: "earnpaste",
        type: "earnpasteNode",
        position: { x: 125, y: 130 },
        data: { onClick: onEarnpasteClick },
        selectable: false,
        draggable: false,
      });
    }

    return list;
  }, [showEarnpaste, onGetKeyClick, onEarnpasteClick]);

  const edges: Edge[] = useMemo(() => {
    if (!showEarnpaste) return [];

    return [
      {
        id: "edge-getkey-earnpaste",
        source: "get-key",
        target: "earnpaste",
        animated: true,
        style: {
          stroke: "#ffffff",
          strokeWidth: 2.5,
          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7))",
        },
      },
    ];
  }, [showEarnpaste]);

  return (
    <div className={`relative transition-all duration-300 w-[450px] ${showEarnpaste ? "h-[220px]" : "h-[90px]"}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        panOnScroll={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleTap={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        fitView={false}
        className="w-full h-full bg-transparent overflow-visible"
      />
    </div>
  );
};
