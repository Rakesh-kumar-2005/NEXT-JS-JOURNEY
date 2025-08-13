"use client";

import { Button } from "@/components/ui/button";
import UpgradeModal from "@/components/upgrade-modal";
import { useCanvas } from "@/context/context";
import { usePlanAccess } from "@/hooks/use-plan-access";
import {
  ArrowLeft,
  Crop,
  Expand,
  Eye,
  LockKeyhole,
  Maximize2,
  Palette,
  RotateCcw,
  RotateCw,
  Sliders,
  Text,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Tools...
const TOOLS = [
  {
    id: "resize",
    label: "Resize",
    icon: Expand,
    isActive: true,
  },
  {
    id: "crop",
    label: "Crop",
    icon: Crop,
  },
  {
    id: "adjust",
    label: "Adjust",
    icon: Sliders,
  },
  {
    id: "text",
    label: "Text",
    icon: Text,
  },
  {
    id: "background",
    label: "AI Background",
    icon: Palette,
    proOnly: true,
  },
  {
    id: "ai_extender",
    label: "AI Image Extender",
    icon: Maximize2,
    proOnly: true,
  },
  {
    id: "ai_edit",
    label: "AI Editing",
    icon: Eye,
    proOnly: true,
  },
];

const EditorTopBar = ({ project }) => {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);
  const [restrictedTool, setRestrictedTool] = useState(null);

  const { activeTool, onToolChange, canvasEditor } = useCanvas();
  const { hasAccess, canExport, isFree } = usePlanAccess();

  const handleBackToDashBoard = () => {
    router.push("/dashboard");
  };

  const handleToolChange = (toolId) => {
    if (!hasAccess(toolId)) {
      setRestrictedTool(toolId);
      setShowUpgradeModel(true);
      return;
    }

    onToolChange(toolId);
  };

  return (
    <>
      <div className="border-b px-6 py-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashBoard}
            className="text-white hover-text-grey-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Projects
          </Button>

          <h1 className="font-extrabold capitalize">{project.title}</h1>

          <div>Right actions</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              const hasToolAccess = hasAccess(tool.id);

              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolChange(tool.id)}
                  className={`gap-2 relative ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:text-gray-300 hover:bg-gray-100"} ${!hasToolAccess ? "opacity-60" : ""}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tool.label}
                  {tool.proOnly && !hasToolAccess && (
                    <LockKeyhole className="h-3 w-3 text-amber-400" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* undo and Redo Buttons */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="text-white">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModel}
        onClose={() => {
          setShowUpgradeModel(false);
          setRestrictedTool(null);
        }}
        restrictedTool={restrictedTool}
        reason={
          restrictedTool === "export"
            ? "Free plan is limited upto 20 exports per month. Upgrade to Pro for Unlimited exports"
            : undefined
        }
      />
    </>
  );
};

export default EditorTopBar;
