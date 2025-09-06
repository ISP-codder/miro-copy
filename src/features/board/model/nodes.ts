import { useState } from "react";
import type { Point } from "../domain/point";

type NodeBase = {
  id: string;
  type: string;
};

type StickerNode = NodeBase & {
  type: "sticker";
  text: string;
  x: number;
  y: number;
};

type ArrowNode = NodeBase & {
  type: "arrow";
  start: Point;
  end: Point;
};

type DrawingNode = NodeBase & {
  type: "drawing";
  points: Point[];
};

export type Node = StickerNode | ArrowNode | DrawingNode;

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      type: "sticker",
      text: "Hello 1",
      x: 100,
      y: 100,
    },
    {
      id: "2",
      type: "sticker",
      text: "Hello 2",
      x: 200,
      y: 200,
    },
    {
      id: "3",
      type: "arrow",
      start: { x: 10, y: 10, relativeTo: "1" },
      end: { x: 20, y: 20, relativeTo: "2" },
    },
  ]);

  const addSticker = (data: { text: string; x: number; y: number }) => {
    setNodes((lastNodes) => [
      ...lastNodes,
      {
        id: crypto.randomUUID(),
        type: "sticker",
        ...data,
      },
    ]);
  };

  const addArrow = (data: { start: Point; end: Point }) => {
    setNodes((lastNodes) => [
      ...lastNodes,
      { ...data, id: crypto.randomUUID(), type: "arrow" },
    ]);
  };

  const addDrawing = (data: { points: Point[] }) => {
    setNodes((lastNodes) => [
      ...lastNodes,
      { ...data, id: crypto.randomUUID(), type: "drawing" },
    ]);
  };

  const updateStickerText = (id: string, text: string) => {
    setNodes((lastNodes) =>
      lastNodes.map((node) => (node.id === id ? { ...node, text } : node)),
    );
  };

  const deleteNodes = (ids: string[]) => {
    setNodes((lastNodes) => {
      const arrowsRelativeIds = lastNodes
        .filter(
          (node) =>
            (node.type === "arrow" &&
              node.start.relativeTo &&
              ids.includes(node.start.relativeTo)) ||
            (node.type === "arrow" &&
              node.end.relativeTo &&
              ids.includes(node.end.relativeTo)),
        )
        .map((node) => node.id);

      return lastNodes.filter(
        (node) =>
          !ids.includes(node.id) && !arrowsRelativeIds.includes(node.id),
      );
    });
  };

  const updateNodesPositions = (
    positions: {
      id: string;
      point: Point;
      type?: "start" | "end";
      pointIndex?: number;
    }[],
  ) => {
    const record = Object.fromEntries(
      positions.map((p) => [`${p.id}${p.type ?? ""}`, p]),
    );

    setNodes((lastNodes) =>
      lastNodes.map((node) => {
        if (node.type === "arrow") {
          const newPosition = record[`${node.id}start`];
          const newEndPosition = record[`${node.id}end`];

          return {
            ...node,
            start: newPosition?.point ?? node.start,
            end: newEndPosition?.point ?? node.end,
          };
        }
        if (node.type === "sticker") {
          const newPosition = record[node.id];
          if (newPosition) {
            return { ...node, ...newPosition.point };
          }
        }
        if (node.type === "drawing") {
          // Update specific points of the drawing
          const drawingUpdates = positions.filter(
            (p) => p.id === node.id && p.pointIndex !== undefined,
          );
          if (drawingUpdates.length > 0) {
            const newPoints = [...node.points];
            drawingUpdates.forEach((update) => {
              if (
                update.pointIndex !== undefined &&
                update.pointIndex < newPoints.length
              ) {
                newPoints[update.pointIndex] = update.point;
              }
            });
            return { ...node, points: newPoints };
          }
        }

        return node;
      }),
    );
  };

  return {
    nodes,
    addArrow,
    addSticker,
    addDrawing,
    updateStickerText,
    updateNodesPositions,
    deleteNodes,
  };
}

export type NodesModel = ReturnType<typeof useNodes>;
