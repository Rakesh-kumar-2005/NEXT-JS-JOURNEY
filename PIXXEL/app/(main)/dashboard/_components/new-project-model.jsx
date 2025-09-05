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
import { Crown, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UpgradeModal from '@/components/upgrade-modal';

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

  // showing the upgrade model...
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);

  const router = useRouter();

  // getting the current project count...
  const { data: projects } = useConvexQuery(api.projects.getUserProjects);
  const currentProjectCount = projects?.length || 0;

  // Can Create project according to the project count...
  const canCreate = canCreateProject(currentProjectCount);

  // Project creating function...
  const { mutate: createProject } = useConvexMutation(api.projects.create);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setProjectTitle(nameWithoutExt || "Untitled Project");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB...
  });

  // Handling the create project function...
  const handleCreateProject = async () => {
    // if the user can't create a project...
    if (!canCreate) {
      setShowUpgradeModel(true);
      return;
    }

    // if the user has not selected a file or has not entered a project title...
    if (!selectedFile || !projectTitle.trim()) {
      toast.error("Please select an image file and enter a project title.");
      return;
    }

    setIsUploading(true);

    try {

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", projectTitle.name);

      // Fetching tje response from the api... 
      const  uploadResponse = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      // if the upload was not successful...
      if(!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload image.");
      }


      // Creating the project...
      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width || 800,
        height: uploadData.height || 600,
        canvasState: null,
      });

      toast.success("Project created successfully!", {
        style: {
          background: "#000000",
          color: "#22c55e",
          border: "2px dashed #22c55e",
        },
      });
    
      // Navigate to Editor page...
      // Navigate to Editor page...
      router.push(`/editor/${projectId}`);
    } catch (err) {
      console.log('Error creating project',err);
      toast.error(err.message || "Failed to create project. Please try again.", {
        style: {
          background: "#000000",
          color: "#c52222",
          border: "2px dashed #ff0000",
        },
      });
    }finally{
      setIsUploading(false);
    }
  };

  //handling the closing function...
  const handleClose = () => {
    onClose();
    setSelectedFile(null);
    setIsUploading(false);
    setPreviewUrl(null);
    setProjectTitle("");
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
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <Crown color="#fbbf24" className="animate-bounce" />
                <AlertDescription>
                  <div className="text-amber-400 mb-1">
                    {currentProjectCount === 2
                      ? "Last Free Project..."
                      : "Project Limit Reached..."}

                    {currentProjectCount === 2
                      ? "This will be your last free project. Upgrade to Pixxel Pro for unlimited projects..."
                      : "Free Plan is limited to 3 projects. Upgrade to Pixxel Pro to create unlimited projects..."}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* upload Area */}

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-cyan-400 bg-cyan-400/5" : "border-white/20 hover:border-white/40"} ${!canCreate ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-white/70 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? "Drop your image here..." : "Upload an Image"}
                </h3>
                <p className="text-white/70 mb-4">
                  {canCreate
                    ? "Drag and drop your image, or click to browse"
                    : "UpGrade to Pro to create unlimited projects"}
                </p>{" "}
                <p className="text-white/50 text-sm">
                  Supports PNG, JPG, WEBP, JPEG upto 20MB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border-2 border-dashed border-white/20"                  />
                  <Button
                    variant="glass"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/30 hover:bg-black/70 text-white"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setProjectTitle("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-title" className="text-white">
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter a project name..."
                    className="bg-slate-700 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    <p className="font-medium text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-white/70">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="ghost"
              disabled={isUploading}
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-all duration-300 border border-white/50 hover:border-white"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={!selectedFile || !projectTitle.trim() || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModel}
        onClose={() => setShowUpgradeModel(false)} restrictedTool='projects' reason='Free plan is limited to 3 projects. Upgrade to Glazrr Pro to create unlimited projects and get access to all AI editing tools...'
      />

    </>
  );
};

export default NewProjectModel;
