"use client";

import { useCanvas } from "@/context/context";
import {
  Crop,
  Expand,
  Eye,
  Maximize,
  Palette,
  Sliders,
  Text,
} from "lucide-react";
import React, { act } from "react";
import ResizeControls from "./tools/resize";
import CropContent from "./tools/crop";
import AdjustControls from "./tools/adjust";

const TOOL_CONFIGS = {
  resize: {
    title: "Resize",
    icon: Expand,
    description: "Change project dimensions",
  },
  crop: {
    title: "Crop",
    icon: Crop,
    description: "Crop and trim your image",
  },
  adjust: {
    title: "Adjust",
    icon: Sliders,
    description: "Brightness, contrast, and more (Manual saving required)",
  },
  background: {
    title: "Background",
    icon: Palette,
    description: "Remove or change background",
  },
  ai_extender: {
    title: "AI Image Extender",
    icon: Maximize,
    description: "Extend image boundaries with AI",
  },
  text: {
    title: "Add Text",
    icon: Text,
    description: "Customize in Various Fonts",
  },
  ai_edit: {
    title: "AI Editing",
    icon: Eye,
    description: "Enhance image quality with AI",
  },
};

const EditorSideBar = ({ project }) => {
  // Getting the active tool from useCanvas...
  const { activeTool } = useCanvas();

  const toolConfig = TOOL_CONFIGS[activeTool];

  if (!toolConfig) {
    return null;
  }

  const Icon = toolConfig.icon;

  return (
    <div className="min-w-96 border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-white" />
          <h2 className="text-lg font-semibold text-white">
            {toolConfig.title}
          </h2>
        </div>
        <p className="text-sm text-white mt-1">{toolConfig.description}</p>
      </div>

      {/* Side Bar Content... */}
      <div className="flex-1 p-4 overflow-y-scroll">
        {renderToolContent(activeTool, project)}
      </div>
    </div>
  );
};

export default EditorSideBar;

function renderToolContent(activeTool, project) {
    switch (activeTool) {
      case "resize":
        return <ResizeControls project={project} />;
      case "crop":
        return <CropContent />
      case "adjust":
        return <AdjustControls />
      case "background":
        return <div>Background Content</div>;
      case "ai_extender":
        return <div>AI Extender Content</div>;
      case "text":
        return <div>Text Content</div>;
      case "ai_edit":
        return <div>AI Edit Content</div>;
      default:
        return null;
    }
}