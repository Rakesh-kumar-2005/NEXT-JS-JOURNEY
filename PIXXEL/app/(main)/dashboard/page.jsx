"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import NewProjectModel from "./_components/new-project-model";
import { ProjectGrid } from "./_components/project-grid";

const Dashboard = () => {
  const [showNewProjectModel, setShowNewProjectModel] = useState(false);

  const { data: projects, isLoading } = useConvexQuery(
    api.projects.getUserProjects
  );

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="mx-auto px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Projects
            </h1>
            <p className="text-white/70 text-sm">
              Create and manage your AI_powered image designs
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="gap-2"
            onClick={() => setShowNewProjectModel(true)}
          >
            <Plus className="h-7 w-7" />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <BarLoader width={"100%"} color={"#fff"} />
        ) : projects && projects.length > 0 ? (

          // Rendering all the projects...
          <ProjectGrid projects={projects} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl text-white font-semibold mb-3">
              Create Your First Project
            </h3>

            <p className="text-white/70 mb-8 max-w-md">
              Upload an Image to start editing with our powerful AI tools
            </p>

            <Button
              variant="primary"
              size="xl"
              className="gap-2"
              onClick={() => setShowNewProjectModel(true)}
            >
              <span className="animate-bounce">🌟</span>
              Start Creating
            </Button>
          </div>
        )}

        <NewProjectModel
           isOpen={showNewProjectModel}
           onClose={() => setShowNewProjectModel(false)} 
        />

      </div>
    </div>
  );
};

export default Dashboard;
