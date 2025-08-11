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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Edit, Edit2, Trash, Trash2 } from "lucide-react";
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
      toast.success("Project deleted successfully");
      setIsDialogOpen(false); // close dialog
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete project Please try again.");
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
          <Button variant="glass" size="sm" onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          {/* Delete Button */}
          <Button
            variant="glass"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 text-red-400 hover:text-red-300"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>

          {/* Delete Confirmation Dialog */}
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

      <CardContent className="pb-6 px-[6px]">
        <h3 className="font-semibold text-white truncate">{project.title}</h3>

        <div className="flex items-center justify-between text-[12px] text-white/70">
          <span>Updated {lastUpdated}</span>

          <Badge variant="ghost" className="text-xs text-white/80">
            {project.width} X {project.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
