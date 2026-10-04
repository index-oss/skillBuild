"use client";

import { Folder, ExternalLink, GitBranch, Code2 } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    repo_url?: string;
    live_url?: string;
    tech_stack?: string[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Folder className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <GitBranch className="w-4 h-4" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-3 mb-6">{project.description}</p>
      </div>

      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800/60">
          {project.tech_stack.map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
            >
              <Code2 className="w-3 h-3 text-indigo-400" />
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
