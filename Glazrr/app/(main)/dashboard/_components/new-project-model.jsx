"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { Badge } from "@/components/ui/badge";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Crown, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NewProjectModel = ({ isOpen, onClose }) => {


    // uploading state...
    const [isUploading, setIsUploading] = useState(false);

    // project title...
    const [projectTitle, setProjectTitle] = useState("");

    // selected file...
    const [selectedFile, setSelectedFile] = useState(null);

    // previewing the url...
    const [previewUrl, setPreviewUrl] = useState(null);

  // getting the plan access...
  const { isFree, canCreateProject } = usePlanAccess();

  // getting the current project count...
  const { data: projects } = useConvexQuery(api.projects.getUserProjects);
  const currentProjectCount = projects?.length || 0;

  // Can Create project according to the project count...
  const canCreate = canCreateProject(currentProjectCount);

  // Project creating function...
  const { mutate: createProject } = useConvexMutation(api.projects.create);

  // Handling the create project function...
  const handleCreateProject = () => {
    
  };

  //handling the closing function...
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-white font-bold">
              Create a new project
            </DialogTitle>
            <DialogDescription>
              {isFree && (
                <Badge variant="" className="text-black/70 ">
                  {currentProjectCount} / 3 projects
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {isFree && currentProjectCount >= 2 && (
              <Alert className='bg-amber-500/10 border-amber-500/20'>
                <Crown color="#fbbf24" className="animate-bounce"/>
                <AlertDescription>
                  <div className="text-amber-400 mb-1">
                    {currentProjectCount === 2 ? 'Last Free Project...' : 'Project Limit Reached...'}

                    {currentProjectCount === 2 ? 'This will be your last free project. Upgrade to Glazrr Pro for unlimited projects...' : 'Free Plan is limited to 3 projects. Upgrade to Glazrr Pro to create unlimited projects...'}


                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* upload Area */}
          </div>
          <DialogFooter>
            <Button variant='ghost' disabled={isUploading} onClick={handleClose} className='text-white/70 hover:text-white transition-all duration-300 border border-white/50 hover:border-white'>
                Cancel
            </Button>
            <Button variant='primary' onClick={handleCreateProject} disabled={!selectedFile || !projectTitle.trim() || isUploading}>
                {isUploading? <>
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    Creating...
                </> : (
                    'Create Project'
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewProjectModel;
