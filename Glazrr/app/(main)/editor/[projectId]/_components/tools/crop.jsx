import { Button } from "@/components/ui/button";
import { useCanvas } from "@/context/context";
import {
  Crop,
  Maximize,
  RectangleHorizontal,
  RectangleVertical,
  Scissors,
  ScissorsIcon,
  Smartphone,
  Square,
} from "lucide-react";
import { initialize } from "next/dist/server/lib/render-server";
import React, { useEffect, useState } from "react";

// Aspect Ratios...
const ASPECT_RATIOS = [
  { label: "Freeform", value: null, icon: Maximize },
  { label: "Square", value: 1, icon: Square, ratio: "1:1" },
  {
    label: "Widescreen",
    value: 16 / 9,
    icon: RectangleHorizontal,
    ratio: "16:9",
  },
  { label: "Portrait", value: 4 / 5, icon: RectangleVertical, ratio: "4:5" },
  { label: "Story", value: 9 / 16, icon: Smartphone, ratio: "9:16" },
];

const CropContent = () => {
  // Canvas Editor...
  const { canvasEditor, activeTool } = useCanvas();

  // State for selected Image...
  const [selectedImage, setSelectedImage] = useState(null);

  // State for crop-mode...
  const [isCropMode, setIsCropMode] = useState(false);

  // State for the ratio which is selected...
  const [selectedRatio, setSelectedRatio] = useState(null);

  // State for the Crop Rect...
  const [cropRect, setCropRect] = useState(null);

  // State for the original props...
  const [originalProps, setOriginalProps] = useState(null);

  // Getting the active image...
  const getActiveImage = () => {
    if (!canvasEditor) return null;

    const activeObject = canvasEditor.getActiveObject();

    if (activeObject && activeObject.typ === "image") {
      return activeObject;
    }

    const objects = canvasEditor.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  };

  // Remove all Rect objects from canvas (Clean up crop rectangles)...
  const removeAllCropRectangles = () => {
    if (!canvasEditor) return;

    const objects = canvasEditor.getObjects();
    const reactsToRemove = objects.filter((obj) => obj.type == "rect");

    reactsToRemove.forEach((rect) => {
      canvasEditor.remove(rect);
    });

    canvasEditor.requestRenderAll();
  };

  // Initialize the crop model when tool becomes active...
  useEffect(() => {
    if (activeTool == "crop" && canvasEditor && isCropMode) {
      const image = getActiveImage();

      if (image) {
        initializeCropMode(image);
      }
    } else if (activeTool !== "crop && isCropMode") {
      exitCropMode();
    }

  }, [activeTool, canvasEditor]);


  // Clean up when component unmounts...
  useEffect(() => {
    
    return () => {
      if(isCropMode) {
        exitCropMode();
      }
    };
  }, []);


  // Initialization of the crop mode...
  const initializeCropMode = (image) => {
    
    if(!image || isCropMode) {
      return;
    }

    // first, remove any existing crop rectangles...
    removeAllCropRectangles();

    // Store original image properties...
    const original = {
      left: image.left,
      top: image.top,
      width: image.width,
      height: image.height,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      angle: image.angle || 0,
      selectable: image.selectable,
      evented: image.evented,
    };

    selectOriginalProps(original);
    setSelectedImage(image);
    setIsCropMode(true);

    // Make the image non selectable to prevent default scaling... 
    image.set({
      selectable: false,
      evented: false
    })

    // Create crop rectangle overlay...
    createCropRectangle(image);

    canvasEditor.requestRenderAll();
  };

  // Create Crop Rectangle Overlay...
  

  return (
    <div className="space-y-6">
      {/* Crop mode status */}
      {isCropMode && (
        <div className="bg-cyan-500/20 border-cyan-500/40 rounded-lg p-3">
          <p className="text-cyan-300/80 text0xs font-medium">
            <Scissors className="h-4 w-4 text-cyan-300" />
            Crop Mode Active
          </p>
          <p className="text-cyan-300/80 text0xs mt-1">
            Adjust the blue rectangle to set the crop area
          </p>
        </div>
      )}

      {/* Start crop button... */}
      {!isCropMode && activeImage && (
        <Button>
          <Crop className="'h-4 w-4" />
          Start Cropping
        </Button>
      )}

      {isCropMode && (
        <div>
          <h3 className="text-sm font-medium text-white mb-3">
            Crop Aspect Ratios
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const IconComponent = ratio.icon;
              return (
                <button
                  key={ratio.label}
                  onClick={() => applyAspectRatio(ratio.value)}
                  className={`text-center p-3 border rounded-lg transition-colors cursor-pointer ${selectedRatio === ratio.value ? "bg-cyan-400/10 border-cyan-400" : "border-white/20 hover:border-white/40 hover-bg-white/5"}
                    `}
                >
                  <IconComponent className="h-6 w-6 mx-auto mb-2 text-white" />
                  <div className="text-xs text-white">{ratio.label}</div>
                  {ratio.ratio && (
                    <div className="text-xs text-white">{ratio.ratio}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Crop Actions - only show in crop mode... */}
      {isCropMode && (
        <div className="space-y-3 pt-4 border-t border-white.10">
          <Button variant="primary" onClick={applyCrop} className={`w-full`}>
            Apply Crop
          </Button>
          <Button variant="outline" className={`w-full`} onClick={cancelCrop}>
            Cancel
          </Button>
        </div>
      )}

      {/* Instructions... */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <p className="text-xs text-white/70">
          <strong>How to crop:</strong>
          <br />
          1. Click "Start Cropping"
          <br />
          2. Drag the blue rectangle to select crop area
          <br />
          3. Choose aspect ratio (optional)
          <br />
          4. Click "Apply Crop" to finalize
        </p>
      </div>
    </div>
  );
};

export default CropContent;
