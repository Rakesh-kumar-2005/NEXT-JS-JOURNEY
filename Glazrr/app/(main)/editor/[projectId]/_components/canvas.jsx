"use client";

import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Canvas, FabricImage } from "fabric";
import React, { useRef, useState, useEffect } from "react";
import { BounceLoader } from "react-spinners";

const CanvasEditor = ({ project }) => {

  const canvasRef = useRef();
  const containerRef = useRef();

  // isLoading state...
  const [isLoading, setIsLoading] = useState(true);

  const { canvasEditor, setCanvasEditor, activeTool, onToolChange } =
    useCanvas();

  // updating the project...
  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );

  //Calculating viewPort size...
  const calculateVewPortScale = () => {
    // If the containerRef is null, return
    if (!containerRef.current || !project) return 1;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;

    return Math.min(scaleX, scaleY, 1);
  };

  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initializeCanvas = async () => {
      setIsLoading(true);

      const viewportScale = calculateVewPortScale();

      const canvas = new Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,
        backgroundColor: "#fff",
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
        selection: true,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        allowTouchScrolling: false,
        renderOnAddRemove: true,
        skipTargetFind: false,
      });

      // Setting the canvas dimensions...
      canvas.setDimensions(
        {
          width: project.width * viewportScale,
          height: project.height * viewportScale,
        },
        {
          backstoreOnly: false,
        }
      );

      // Applying the zoom...
      canvas.setZoom(viewportScale);

      const scaleFactor = window.devicePixelRatio || 1;
      if (scaleFactor > 1) {
        // Increasing the canvas resolution for high resolution screens...
        canvas.getElement().width = project.width * scaleFactor;
        canvas.getElement().height = project.height * scaleFactor;

        // Scale the drawing context to match...
        canvas.getContext().scale(scaleFactor, scaleFactor);
      }

      // Load Image...
      if (project.currentImageUrl || project.originalImageUrl) {
        try {
          const imageUrl = project.currentImageUrl || project.originalImageUrl;
          const fabricImage = await FabricImage.fromURL(imageUrl, {
            crossOrigin: "anonymous",
          });

          const imgAspectRatio = fabricImage.width / fabricImage.height;
          const canvasAspectRatio = project.width / project.height;
          let scaleX, scaleY;

          if (imgAspectRatio > canvasAspectRatio) {
            scaleX = project.width / fabricImage.width;
            scaleY = scaleX;
          } else {
            scaleY = project.height / fabricImage.height;
            scaleX = scaleY;
          }

          fabricImage.set({
            left: project.width / 2,
            top: project.height / 2,
            originX: "center",
            originY: "center",
            scaleX,
            scaleY,
            selectable: true,
            evented: true,
          });

          // Adding the image to the canvas...
          canvas.add(fabricImage);
          canvas.centerObject(fabricImage);
        } catch (error) {
          console.error("Error loading project image:", error);
        }
      }

      // Load saved canvas data...
      if(project.canvasState) {
        try {
          // loading the canvas data...
          await canvas.loadFromJSON(project.canvasState);
          //Rendering the canvas...
          canvas.requestRenderAll();
        } catch (error) {
          console.error("Error loading project image:", error);
        }
      }


      canvas.calcOffset(); // Re-calculate the canvas offset...
      canvas.requestRenderAll(); // Render the canvas...
      setCanvasEditor(canvas); // setting the canvas editor...

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 500);
      
      setIsLoading(false);
    };

    // calling the initializeCanvas function...
    initializeCanvas();

    return () => {
      if(canvasEditor) {
        canvasEditor.dispose(); // clean up...
        setCanvasEditor(null);
      }
    };
  }, [project]);

  // Function for saving the canvas state...
  const saveCanvasState = async () => {
    if(!canvasEditor || !project) return;

    try {
      const canvasJSON = canvasEditor.toJSON();
      
      await updateProject({
        projectId: project._id,
        canvasState: canvasJSON,
      })
    } catch (error) {
      console.error("Error saving canvas state:", error);
      r
    }
  }

  // The 2 second delay save...
  useEffect(() => {
    if(!canvasEditor) return;
    let saveTimeOut;

    const handleCanvasChange = () => {
      clearTimeout(saveTimeOut);
      saveTimeOut = setTimeout(() => {
        saveCanvasState();
      }, 2000);
    };

    canvasEditor.on("object:modified", handleCanvasChange);
    canvasEditor.on("object:added", handleCanvasChange);
    canvasEditor.on("object:removed", handleCanvasChange);

    return () => {
      clearTimeout(saveTimeOut);
      canvasEditor.off("object:modified", handleCanvasChange);
      canvasEditor.off("object:added", handleCanvasChange);
      canvasEditor.off("object:removed", handleCanvasChange);
    }
  }, [canvasEditor])
  

  // Handling the resize... 
  useEffect(() => {
    
    const handleResize = () => {
      if(!canvasEditor || !project) return;

      const newScale = calculateVewPortScale();
      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        {
          backstoreOnly: false,
        }
      );

      canvasEditor.setZoom(newScale);
      canvasEditor.calcOffset(); // Re-calculate the canvas offset...
      canvasEditor.requestRenderAll(); // Render the canvas...
    };
    
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [canvasEditor, project])
  

  // Cursor Changing for the crop operation...
  useEffect(() => {
    if(!canvasEditor) return;
    
    switch(activeTool){
      case 'crop':
        canvasEditor.defaultCursor = 'crosshair';
        canvasEditor.hoverCursor = 'crosshair';
        break;
      default:
        canvasEditor.defaultCursor = 'default';
        canvasEditor.hoverCursor = 'move';
        break;
    }
    
  }, [canvasEditor, activeTool])
  

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
          <div className="flex flex-col items-center gap-4">
            <BounceLoader size={38} color="cyan" />{" "}
            <p className="text-2xl text-white/70">Loading...</p>
          </div>
        </div>
      )}

      <div className="px-5">
        <canvas id="canvas" ref={canvasRef} className="border" />
      </div>
    </div>
  );
};

export default CanvasEditor;
