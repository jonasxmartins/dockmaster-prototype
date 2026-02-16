import { useEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bot,
  ClipboardList,
  Database,
  FileCheck2,
  FileText,
  GitBranch,
  Mail,
  MessageCircle,
  MessageSquareText,
  Move,
  Network,
  SearchCheck,
  SendHorizonal,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserCheck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  architectureControlBus,
  architectureEdges,
  architectureNodes,
  architectureZones,
  type EdgeAnchorSide,
  type ArchitectureNode,
  type ArchitectureNodeCategory,
} from "@/data/architecture";

interface BoardOffset {
  x: number;
  y: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

const categoryStyles: Record<ArchitectureNodeCategory, string> = {
  channel: "border-emerald-400/50 bg-emerald-950/35 text-emerald-50",
  core: "border-cyan-400/50 bg-cyan-950/35 text-cyan-50",
  agent: "border-teal-300/55 bg-teal-900/25 text-teal-50",
  data: "border-indigo-300/55 bg-indigo-950/40 text-indigo-50",
  control: "border-amber-300/60 bg-amber-950/35 text-amber-50",
  output: "border-sky-300/55 bg-sky-950/35 text-sky-50",
};

const categoryPill: Record<ArchitectureNodeCategory, string> = {
  channel: "Channel",
  core: "Core",
  agent: "Agent",
  data: "Data",
  control: "Control",
  output: "Output",
};

const zoomMin = 0.25;
const zoomMax = 1.8;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getBounds(size: ViewportSize, scale: number) {
  const margin = 120;
  const scaledWidth = BOARD_WIDTH * scale;
  const scaledHeight = BOARD_HEIGHT * scale;
  const minX = Math.min(margin, size.width - scaledWidth - margin);
  const maxX = margin;
  const minY = Math.min(margin, size.height - scaledHeight - margin);
  const maxY = margin;
  return { minX, maxX, minY, maxY };
}

function getCenteredOffset(node: ArchitectureNode, size: ViewportSize, scale: number): BoardOffset {
  const targetX = size.width / 2 - (node.x + node.width / 2) * scale;
  const targetY = size.height / 2 - (node.y + node.height / 2) * scale;
  const { minX, maxX, minY, maxY } = getBounds(size, scale);
  return {
    x: clamp(targetX, minX, maxX),
    y: clamp(targetY, minY, maxY),
  };
}

function getAnchorPoint(node: ArchitectureNode, side: EdgeAnchorSide) {
  if (side === "left") return { x: node.x, y: node.y + node.height / 2 };
  if (side === "right") return { x: node.x + node.width, y: node.y + node.height / 2 };
  if (side === "top") return { x: node.x + node.width / 2, y: node.y };
  return { x: node.x + node.width / 2, y: node.y + node.height };
}

function getAutoSides(from: ArchitectureNode, to: ArchitectureNode) {
  const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      fromSide: (dx >= 0 ? "right" : "left") as EdgeAnchorSide,
      toSide: (dx >= 0 ? "left" : "right") as EdgeAnchorSide,
    };
  }

  return {
    fromSide: (dy >= 0 ? "bottom" : "top") as EdgeAnchorSide,
    toSide: (dy >= 0 ? "top" : "bottom") as EdgeAnchorSide,
  };
}

function getControlPoint(point: { x: number; y: number }, side: EdgeAnchorSide, distance: number) {
  if (side === "left") return { x: point.x - distance, y: point.y };
  if (side === "right") return { x: point.x + distance, y: point.y };
  if (side === "top") return { x: point.x, y: point.y - distance };
  return { x: point.x, y: point.y + distance };
}

export function ProductArchitecturePage() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 1280, height: 680 });
  const [offset, setOffset] = useState<BoardOffset>({ x: 80, y: 80 });
  const [scale, setScale] = useState(0.85);
  const [openNodeId, setOpenNodeId] = useState<string>("gateway");

  const nodesById = useMemo(
    () =>
      architectureNodes.reduce<Record<string, ArchitectureNode>>((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {}),
    []
  );

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      const rect = viewportRef.current.getBoundingClientRect();
      const nextSize = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
      setViewportSize(nextSize);

      if (!initializedRef.current) {
        const fitScale = clamp(
          Math.min((nextSize.width - 180) / BOARD_WIDTH, (nextSize.height - 180) / BOARD_HEIGHT),
          zoomMin,
          1
        );
        setScale(fitScale);
        const gateway = architectureNodes.find((node) => node.id === "gateway") ?? architectureNodes[0];
        setOffset(getCenteredOffset(gateway, nextSize, fitScale));
        initializedRef.current = true;
      } else {
        const { minX, maxX, minY, maxY } = getBounds(nextSize, scale);
        setOffset((prev) => ({
          x: clamp(prev.x, minX, maxX),
          y: clamp(prev.y, minY, maxY),
        }));
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [scale]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    
    // Use requestAnimationFrame for smoother updates if needed, 
    // but framer-motion usually handles this. 
    // Let's optimize by pre-calculating bounds on drag start.
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    
    setOffset({
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    });
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    
    // Clamp to bounds only on end to allow "rubber banding" feel or just for efficiency
    const { minX, maxX, minY, maxY } = getBounds(viewportSize, scale);
    setOffset(prev => ({
      x: clamp(prev.x, minX, maxX),
      y: clamp(prev.y, minY, maxY),
    }));
  };

  const zoomTo = (nextScale: number, center?: { x: number; y: number }) => {
    const clampedScale = clamp(nextScale, zoomMin, zoomMax);
    const viewportCenter = center ?? { x: viewportSize.width / 2, y: viewportSize.height / 2 };

    const boardX = (viewportCenter.x - offset.x) / scale;
    const boardY = (viewportCenter.y - offset.y) / scale;
    const nextOffset = {
      x: viewportCenter.x - boardX * clampedScale,
      y: viewportCenter.y - boardY * clampedScale,
    };
    const { minX, maxX, minY, maxY } = getBounds(viewportSize, clampedScale);

    setScale(clampedScale);
    setOffset({
      x: clamp(nextOffset.x, minX, maxX),
      y: clamp(nextOffset.y, minY, maxY),
    });
  };

  const fitBoard = () => {
    const fitScale = clamp(
      Math.min((viewportSize.width - 180) / BOARD_WIDTH, (viewportSize.height - 180) / BOARD_HEIGHT),
      zoomMin,
      1
    );
    setScale(fitScale);
    const gateway = nodesById.gateway ?? architectureNodes[0];
    setOffset(getCenteredOffset(gateway, viewportSize, fitScale));
  };

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const zoomDelta = event.deltaY > 0 ? -0.08 : 0.08;
    zoomTo(scale + zoomDelta, pointer);
  };

  const openNode = (nodeId: string) => {
    const node = nodesById[nodeId];
    if (!node) return;

    const focusScale = clamp(Math.max(scale, 1.12), zoomMin, zoomMax);
    setScale(focusScale);
    setOffset(getCenteredOffset(node, viewportSize, focusScale));
    setOpenNodeId(nodeId);
  };

  const closeNode = () => {
    setOpenNodeId("");
  };

  const nodeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    whatsapp: MessageCircle,
    sms: MessageSquareText,
    email: Mail,
    gateway: GitBranch,
    orchestrator: Network,
    triage: Bot,
    retrieval: SearchCheck,
    diagnosis: Stethoscope,
    "scope-assembly": ClipboardList,
    margin: TrendingUp,
    drafting: FileText,
    "data-bus": Database,
    "marina-data": Database,
    "network-data": Database,
    guardrails: ShieldCheck,
    review: UserCheck,
    delivery: SendHorizonal,
    "omnichannel-output": MessageSquareText,
    evaluation: Activity,
  };

  return (
    <div className="h-[calc(100vh-5rem)] w-full overflow-hidden relative bg-slate-900">
      <div
        ref={viewportRef}
        className="h-full w-full touch-none cursor-grab active:cursor-grabbing relative"
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        style={{
          backgroundColor: "#0f172a",
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="absolute top-5 left-6 z-20 pointer-events-none">
          <h2 className="text-white text-2xl font-semibold flex items-center gap-2">
            <Network className="w-6 h-6 text-teal-300" />
            Product Architecture
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            End-to-end operating model: inbound channels, LangChain-orchestrated agents, private and
            network intelligence, human approval, and customer delivery.
          </p>
        </div>

        <div className="absolute top-5 right-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => zoomTo(scale + 0.12)}
            className="rounded-md border border-slate-500/70 bg-slate-800/85 px-3 py-2 text-slate-100 hover:bg-slate-700/90 transition-colors"
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => zoomTo(scale - 0.12)}
            className="rounded-md border border-slate-500/70 bg-slate-800/85 px-3 py-2 text-slate-100 hover:bg-slate-700/90 transition-colors"
            onPointerDown={(event) => event.stopPropagation()}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={fitBoard}
            className="rounded-md border border-slate-500/70 bg-slate-800/85 px-3 py-2 text-xs text-slate-100 hover:bg-slate-700/90 transition-colors"
            onPointerDown={(event) => event.stopPropagation()}
          >
            Fit View
          </button>
        </div>

        <motion.div
          className="absolute"
          style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT, transformOrigin: "0 0" }}
          animate={{ x: offset.x, y: offset.y, scale }}
          transition={{ type: "spring", stiffness: 350, damping: 38, mass: 0.5 }}
        >
          <div className="absolute inset-0 pointer-events-none">
            {architectureZones.map((zone) => (
              <div
                key={zone.id}
                className="absolute rounded-2xl border border-dashed border-slate-300/25 bg-slate-400/5"
                style={{
                  left: zone.x,
                  top: zone.y,
                  width: zone.width,
                  height: zone.height,
                }}
              >
                <div className="absolute -top-9 left-2 text-[14px] font-bold uppercase tracking-wider text-slate-300/90">
                  {zone.title}
                </div>
                <div className="absolute -top-5 left-2 text-[12px] font-medium text-slate-400/90">
                  {zone.subtitle}
                </div>
              </div>
            ))}
          </div>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
            fill="none"
            aria-hidden
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="11"
                markerHeight="11"
                refX="8"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#93c5fd" />
              </marker>
            </defs>

            <line
              x1={architectureControlBus.x}
              y1={architectureControlBus.top}
              x2={architectureControlBus.x}
              y2={architectureControlBus.bottom}
              stroke="#5eead4"
              strokeWidth="3"
              strokeOpacity="0.85"
            />
            <text
              x={architectureControlBus.x + 10}
              y={architectureControlBus.top - 12}
              className="fill-teal-200 text-[12px]"
            >
              {architectureControlBus.label}
            </text>

            {["triage", "retrieval", "diagnosis", "margin"].map((agentId) => {
              const agent = nodesById[agentId];
              if (!agent) return null;
              const y = agent.y + agent.height / 2;
              const startX = agent.x;
              return (
                <path
                  key={`control-bus-${agentId}`}
                  d={`M ${architectureControlBus.x} ${y} C ${architectureControlBus.x + 10} ${y}, ${startX - 18} ${y}, ${startX} ${y}`}
                  stroke="#5eead4"
                  strokeWidth="2.4"
                  strokeOpacity="0.9"
                  markerEnd="url(#arrow)"
                />
              );
            })}

            {nodesById.orchestrator && (
              <path
                d={`M ${nodesById.orchestrator.x + nodesById.orchestrator.width} ${
                  nodesById.orchestrator.y + nodesById.orchestrator.height / 2
                } C ${architectureControlBus.x - 20} ${
                  nodesById.orchestrator.y + nodesById.orchestrator.height / 2
                }, ${architectureControlBus.x - 8} ${
                  nodesById.orchestrator.y + nodesById.orchestrator.height / 2
                }, ${architectureControlBus.x} ${nodesById.orchestrator.y + nodesById.orchestrator.height / 2}`}
                stroke="#5eead4"
                strokeWidth="2.8"
                strokeOpacity="0.95"
              />
            )}

            {architectureEdges.map((edge) => {
              const from = nodesById[edge.from];
              const to = nodesById[edge.to];
              if (!from || !to) return null;

              const auto = getAutoSides(from, to);
              const fromSide = edge.fromSide ?? auto.fromSide;
              const toSide = edge.toSide ?? auto.toSide;
              let start = getAnchorPoint(from, fromSide);
              let end = getAnchorPoint(to, toSide);

              // Staggered entry/exit points for the Data Bus component
              if (from.id === "data-bus" && (fromSide === "left" || fromSide === "right")) {
                start.y = end.y;
              }
              if (to.id === "data-bus" && (toSide === "left" || toSide === "right")) {
                end.y = start.y;
              }

              const distance = 76;
              const c1 = getControlPoint(start, fromSide, distance);
              const c2 = getControlPoint(end, toSide, distance);
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={`M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`}
                    stroke="#93c5fd"
                    strokeWidth="2.2"
                    strokeOpacity="0.74"
                    markerEnd="url(#arrow)"
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY - 8}
                      textAnchor="middle"
                      className="fill-slate-200 text-[12px]"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {architectureNodes.map((node) => {
            const Icon = nodeIcons[node.id] ?? FileCheck2;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => openNode(node.id)}
                onPointerDown={(event) => event.stopPropagation()}
                className={`absolute text-left rounded-xl border-2 p-5 shadow-lg hover:shadow-xl transition-all ${categoryStyles[node.category]} ${
                  openNodeId === node.id ? "ring-2 ring-teal-300" : ""
                }`}
                style={{
                  top: node.y,
                  left: node.x,
                  width: node.width,
                  height: node.height,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-semibold uppercase tracking-wide opacity-80">
                      {categoryPill[node.category]}
                    </div>
                    <div className="mt-2 text-xl font-semibold leading-snug">{node.title}</div>
                  </div>
                  <div className="rounded-lg border border-white/20 bg-white/10 p-3 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-base opacity-85 mt-3">{node.subtitle}</div>
              </button>
            );
          })}
        </motion.div>

        <div className="absolute bottom-4 left-6 text-base rounded-md border border-slate-500/70 bg-slate-800/85 px-4 py-2 text-slate-100 pointer-events-none flex items-center gap-2">
          <Move className="w-5 h-5 text-teal-300" />
          Drag to pan, mouse wheel to zoom, click a node to focus.
        </div>

        <div className="absolute top-20 right-6 w-[600px] pointer-events-none z-20">
          <AnimatePresence>
            {openNodeId && nodesById[openNodeId] && (
              <motion.div
                key={openNodeId}
                initial={{ opacity: 0, x: 50, y: -12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 40, y: -12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="pointer-events-auto rounded-2xl border-4 border-teal-300 bg-slate-950/95 shadow-2xl backdrop-blur-md p-8 text-slate-100"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold uppercase tracking-wide text-teal-300">
                      {categoryPill[nodesById[openNodeId].category]}
                    </div>
                    <h3 className="text-3xl font-semibold leading-tight mt-2">
                      {nodesById[openNodeId].title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeNode}
                    className="text-slate-300 hover:text-white transition-colors"
                    aria-label={`Close ${nodesById[openNodeId].title} details`}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <p className="text-lg text-slate-200 mt-4 leading-relaxed">
                  {nodesById[openNodeId].description}
                </p>
                <ul className="mt-6 space-y-3.5">
                  {nodesById[openNodeId].bullets.map((bullet) => (
                    <li key={bullet} className="text-lg text-slate-200 flex gap-3 leading-relaxed">
                      <span className="text-teal-300 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
