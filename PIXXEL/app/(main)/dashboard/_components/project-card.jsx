"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ProjectCard = ({ project, onEdit }) => {
  const { mutate: deleteProject } = useConvexMutation(
    api.projects.deleteProject
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Last update time...
  const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });

  // Delete project function...
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProject({ projectId: project._id });
      toast.success("Project deleted successfully", {
        style: {
          background: "#000000",
          color: "#22c55e",
          border: "2px dashed #22c55e",
        },
      });
      setIsDialogOpen(false); // close dialog
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete project Please try again.", {
        style: {
          background: "#000000",
          color: "#c52222",
          border: "2px dashed #ff0000",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="py-0 group relative bg-transparent overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105">
      <div className="aspect-video bg-slate-700 relative overflow-hidden">
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.target.style.display = "none";
            }}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300">
          {/* Edit Button */}
          <Button variant="glass" size="sm" onClick={onEdit} className="gap-2 text-[12px]">
            <Edit className="h-3 w-3" />
            Edit
          </Button>

          {/* Delete Button */}
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 text-red-400 text-[12px] hover:text-red-400"
            disabled={isLoading}
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>

          {/* Delete Confirmation Dialog... */}
          <Dialog
            className="bg-black/20"
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete item</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="transition-all duration-300 hover:bg-red-600 bg-red-500/80 text-white hover:text-white"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CardContent className="pb-3 px-[6px]">
        <h3 className="font-semibold text-white text-lg truncate">{project.title}</h3>

        <div className="flex items-center justify-between text-[10px] text-white/70">
          <span>Updated {lastUpdated}</span>

          <Badge variant="ghost" className="text-[10px] text-white/80">
            {project.width} X {project.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
