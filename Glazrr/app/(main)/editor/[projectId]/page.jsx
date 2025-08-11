"use client";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { CanvasContext } from "@/context/context";
import { Loader2, Monitor } from "lucide-react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { RingLoader } from "react-spinners";
import CanvasEditor from "./_components/canvas";

const Editor = () => {
  const params = useParams();
  const projectId = params.projectId;

  // Canvas Editor state...
  const [canvasEditor, setCanvasEditor] = useState(null);

  // processing Message state...
  const [processingMessage, setProcessingMessage] = useState(null);

  // Active tool state...
  const [activeTool, setActiveTool] = useState("resize");

  const { 
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getProject, {projectId});

  // Loading screen...
  if(isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-cyan-400" />
          <p className="text-2xl text-white/70">Loading...</p>
        </div>
      </div>
    )
  }
  
  
  if(error || !project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-white mb-4">
            Project Not Found...
          </h1>
          <p className="text-white/70">The project you're looking for does not exist or you don't have access to it.</p>
        </div>
      </div>
    )
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        activeTool,
        onToolChange: setActiveTool,
        processingMessage,
        setProcessingMessage,
      }}
    >
      <div className="lg:hidden min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Desktop Required</h1>
          <p className="text-white/70 text-sm">
            Please use a larger screen to access the full editing experience...
          </p>
        </div>
      </div>

      {/* Editor screen... */}
      <div className="hidden lg:block min-h-screen bg-slate-900">
        <div className="flex flex-col h-screen">
          {processingMessage && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="rounded-lg p-6 flex flex-col items-center justify-center">
                <RingLoader color="#22d3ee" />
                <div className="text-center">
                  <p className="text-white font-medium">{processingMessage}</p>
                  <p className="text-white/70 text-sm mt-1">
                    Please wait, do not switch tabs or navigate away...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Bar */}
          <div className="overflow-hidden flex flex-1">

            {/* Side Bar */}
            <div className="flex-1">

              {/* Canvas */}
              <CanvasEditor project={project} />

            </div>


          </div>
        </div>
      </div>

    </CanvasContext.Provider>
  );
};

export default Editor;
