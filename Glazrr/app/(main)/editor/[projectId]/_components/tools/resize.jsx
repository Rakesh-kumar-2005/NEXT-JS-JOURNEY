"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import {
  Expand,
  LockKeyholeIcon,
  Monitor,
  UnlockKeyholeIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Common aspect ratios
const ASPECT_RATIOS = [
  { name: "Instagram Story", ratio: [9, 16], label: "9:16" },
  { name: "Instagram Post", ratio: [1, 1], label: "1:1" },
  { name: "Youtube Thumbnail", ratio: [16, 9], label: "16:9" },
  { name: "Portrait", ratio: [2, 3], label: "2:3" },
  { name: "Facebook Cover", ratio: [851, 315], label: "2.7:1" },
  { name: "Twitter Header", ratio: [3, 1], label: "3:1" },
];

const ResizeControls = ({ project }) => {
  // Editor functions...
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas();

  // New height and width set state
  const [newWidth, setNewWidth] = useState(project?.width || 800);
  const [newHeight, setNewHeight] = useState(project?.height || 600);

  // setState for the locking system...
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  // Aspect ratio setSate...
  const [selectedPreset, setSelectedPreset] = useState(null);

  const {
    mutate: updateProject,
    data,
    isLoading,
  } = useConvexMutation(api.projects.updateProject);

  //   useEffect(() => {
  //   if (!isLoading && data) {
  //     window.location.reload();
  //   }
  // }, [data, isLoading]);

  // Handling the width change...
  const handleWidthChange = (value) => {
    const width = parseInt(value) || 0;
    setNewWidth(width);

    if (lockAspectRatio && project) {
      const ratio = project.height / project.width;
      setNewWidth(Math.round(width * ratio));
    }

    setSelectedPreset(null);
  };

  // Handling the height change...
  const handleHeightChange = (value) => {
    const height = parseInt(value) || 0;
    setNewHeight(height);

    if (lockAspectRatio && project) {
      const ratio = project.width / project.height;
      setNewHeight(Math.round(height * ratio));
    }

    setSelectedPreset(null);
  };

  // Calculating the aspect ratio...
  const calculateAspectRatioDimensions = (ratio) => {
    if (!project) {
      return {
        width: project.width,
        height: project.height,
      };
    }

    const [ratioW, ratioH] = ratio;
    const originalArea = project.width * project.height;

    // the new dimensions...
    const aspectRatio = ratioW / ratioH;
    const newHeight = Math.sqrt(originalArea / aspectRatio);
    const newWidth = newHeight * aspectRatio;

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  };

  // Applying the aspect ratio...
  const applyAspectRatio = (ratio, name) => {
    const dimensions = calculateAspectRatioDimensions(ratio);
    setNewWidth(dimensions.width);
    setNewHeight(dimensions.height);
    setSelectedPreset(name);
  };

  //Calculating viewPort size...
  const calculateVewPortScale = () => {
    const container = canvasEditor.getElement().parentNode;
    if (!container) return 1;

    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;

    return Math.min(scaleX, scaleY, 1);
  };

  const handleApplyResize = async () => {
    if (
      !canvasEditor ||
      !project ||
      (newWidth === project.width && newHeight === project.height)
    ) {
      return;
    }

    setProcessingMessage("Resizing Canvas...");

    try {
      canvasEditor.setWidth(newWidth);
      canvasEditor.setHeight(newHeight);

      const viewPortScale = calculateVewPortScale();

      canvasEditor.setDimensions(
        {
          // height and width updating...
          width: newWidth * viewPortScale,
          height: newHeight * viewPortScale,
        },
        {
          backstoreOnly: false, // update both canvas layer...
        }
      );

      canvasEditor.setZoom(viewPortScale); // setting the zoom...
      canvasEditor.calcOffset(); // Re-calculate the canvas offset...
      canvasEditor.requestRenderAll(); // Render the canvas...

      await updateProject({
        projectId: project._id,
        width: newWidth,
        height: newHeight,
        canvasState: canvasEditor.toJSON(), // current canvas state...
      });
    } catch (error) {
      console.error("Error applying resize:", error);
      toast.error("Failed to resize canvas. Please try again.");
    } finally {
      setProcessingMessage(null);
    }
  };



  if (!canvasEditor || !project) {
    return (
      <div className="p-4">
        <p className="text-sm text-white/70">Canvas is not ready...</p>
      </div>
    );
  }

  // checking for changes...
  const hasChanges = newWidth != project.width || newHeight != project.height;

  return (
    <div className="space-y-6">
      {/* Current size display */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white mb-2">Current Size</h4>
        <div className="text-xs text-white/70">
          {project.width} x {project.height} pixels
        </div>
      </div>

      {/* Manual size input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">Custom Size</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {setLockAspectRatio(!lockAspectRatio)}}
            className="text-white/70 hover:text-white p-1"
          >
            {lockAspectRatio ? (
              <LockKeyholeIcon className="h-4 w-4" />
            ) : (
              <UnlockKeyholeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Height and width input fields... */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 mb-1 block">Width</label>
            <Input
              type="number"
              value={newWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              min="100"
              max="5000"
              className={`bg-slate-700 border-white/20 text-white`}
            />
          </div>
          <div>
            <label className="text-xs text-white/70 mb-1 block">Height</label>
            <Input
              type="number"
              value={newHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              min="100"
              max="5000"
              className={`bg-slate-700 border-white/20 text-white`}
            />
          </div>
        </div>

        {/* Text of locked or unlocked aspect ratios... */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">
            {lockAspectRatio ? "Aspect ratio locked" : "Free resize"}
          </span>
        </div>

        {/* Aspect ratio presets... */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Aspect Ratios</h3>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {ASPECT_RATIOS.map((aspectRatio) => {
              const dimensions = calculateAspectRatioDimensions(
                aspectRatio.ratio
              );
              return (
                <Button
                  key={aspectRatio.name}
                  variant={
                    selectedPreset === aspectRatio.name ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    applyAspectRatio(aspectRatio.ratio, aspectRatio.name)
                  }
                  className={`justify-between h-auto py-2 ${selectedPreset === aspectRatio.name ? "bg-cyan-500 hover:bg-cyan-600" : "text-left"}`}
                >
                  <div>
                    <div className="font-medium">{aspectRatio.name}</div>
                    <div className="text-xs opacity-70">
                      {dimensions.width} x {dimensions.height} (
                      {aspectRatio.label})
                    </div>
                  </div>
                  <Monitor className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* New Size Preview... */}
        {hasChanges && (
          <div className="bg-slate-700/30 rounded-lg mb-2">
            <h4 className="text-sm font-medium text-white mb-2">
              New Size Preview
            </h4>
            <div className="text-xs text-white/70">
              <div>
                New Canvas: {newWidth} x {newHeight} pixels
              </div>
              <div className="text-cyan-400">
                {newWidth > project.width || newHeight > project.height
                  ? "canvas will be expanded"
                  : "Canvas will be cropped"}
              </div>
              <div className="text-white/50 mt-1">
                Objects will maintain their current size and position
              </div>
            </div>
          </div>
        )}

        {/* Apply Button... */}
        <Button
          onClick={handleApplyResize}
          disabled={!hasChanges || processingMessage}
          className="w-full"
          variant="primary"
        >
          <Expand className="h-4 w-4" />
          Apply Resize
        </Button>

        {/* Instructions... */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <p className="text-xs text-white/70">
            <strong>Resize Canvas:</strong> Changes canvas dimensions.
            <br />
            <strong>Aspect Ratio:</strong> Smart sizing based on your current
            canvas.
            <br />
            Objects maintain their size and position.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResizeControls;
