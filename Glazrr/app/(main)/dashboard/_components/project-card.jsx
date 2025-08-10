import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const ProjectCard = ({ project, onEdit }) => {
  return (
    <Card className='py-0 group relative bg-slate-800/50 overflow-hidden hover:border-white/20 transition-all duration-300 hover:scale-105'>
      <div className="aspect-video bg-slate-700 relative overflow-hidden">
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            loading="lazy"
          />
        )}      </div>
      <CardContent>
        <p>{project.title}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
