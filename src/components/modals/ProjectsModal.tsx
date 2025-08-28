"use client";
import { useState, useRef } from "react";
import Modal from "../Modal";
import Image from "next/image";
import { FaCode, FaGithub, FaPlay } from "react-icons/fa";
import projectsData from "../../../projects.json";
import { nardoGrayColors } from "@/styles/colors";

interface Project {
  name: string;
  description: string;
  thumbnail: string;
  github: string;
  demo?: string;
  website?: string;
  languages?: string[];
  frontend?: string[];
  backend?: string[];
  data?: string[];
  tools?: string[];
  deployment?: string[];
}

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView] = useState<'grid' | 'project'>('grid');
  const demoSectionRef = useRef<HTMLDivElement | null>(null);

  // Convert JSON data to array format
  const projects: Project[] = Object.values(projectsData);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setView('project');
  };

  const handleBack = () => {
    setView('grid');
    setSelectedProject(null);
  };

  // Reset to grid view when modal is closed and reopened
  const handleClose = () => {
    setView('grid');
    setSelectedProject(null);
    onClose();
  };

  const handleScrollToDemo = () => {
    if (demoSectionRef.current) {
      demoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderTechStack = (project: Project) => {
    const sections = [
      { title: 'Languages', data: project.languages },
      { title: 'Frontend', data: project.frontend },
      { title: 'Backend', data: project.backend },
      { title: 'Data', data: project.data },
      { title: 'Tools', data: project.tools },
      { title: 'Deployment', data: project.deployment }
    ];

    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-6">
        {sections.map((section) => 
          section.data && section.data.length > 0 ? (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-accent-cyanLight mb-2 uppercase tracking-wide">
                {section.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {section.data.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-nardo-600 text-accent-white text-xs rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null
        )}
        </div>
      </div>
    );
  };

  if (view === 'project' && selectedProject) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title={selectedProject.name} backgroundColor={nardoGrayColors.accent.charcoal} titleClassName="text-accent-cyanLight">
        <div className="text-white flex flex-col h-full">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 hover:text-accent-cyanLight transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-default space-y-6 mt-4 min-h-0">

          {/* Project thumbnail and description side by side */}
          <div className="flex gap-8 items-center justify-center">
            {/* Project thumbnail */}
            <div className="flex-shrink-0">
              <Image
                src={selectedProject.thumbnail}
                alt={selectedProject.name}
                width={500}
                height={375}
                className="w-144 h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Project description and buttons */}
            <div className="flex-1 max-w-md">
              <p className="text-lg leading-relaxed font-oxanium mb-6">
                {selectedProject.description}
              </p>
              
              {/* Links */}
              <div className="flex flex-wrap items-center gap-4">
                {selectedProject.website && (
                  <a
                    href={selectedProject.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyanDark hover:scale-115 transition-all duration-200 ease-out flex items-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    <FaCode className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-nardo-600 text-white rounded-lg hover:bg-accent-greyDark hover:scale-115 transition-all duration-200 ease-out flex items-center gap-2 shrink-0 whitespace-nowrap"
                  >
                    <FaGithub className="w-5 h-5" />
                    View Code
                  </a>
                )}
                {selectedProject.demo && (
                  <button
                    onClick={handleScrollToDemo}
                    className="px-4 py-2 bg-accent-white text-accent-charcoal rounded-lg hover:bg-accent-greyLight hover:scale-115 transition-all duration-200 ease-out flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <FaPlay className="w-4 h-4" />
                    Watch Demo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tech stack */}
          {renderTechStack(selectedProject)}



            {/* Demo video if available */}
            {selectedProject.demo && (
              <div ref={demoSectionRef}>
                <h4 className="text-sm font-semibold text-accent-cyanLight mb-2 uppercase tracking-wide">
                  Demo Video
                </h4>
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedProject.demo.replace('watch?v=', 'embed/')}
                    title={`${selectedProject.name} Demo`}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="PROJECTS">
      <div className="text-white flex flex-col h-full">
        {/* Projects Grid */}
        <div className="flex-1 pb-[28px] -mb-[28px] min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto scrollbar-default">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-accent-charcoal rounded-lg p-4 hover:bg-accent-greyDark transition-colors duration-200 cursor-pointer group"
                onClick={() => handleProjectClick(project)}
              >
                {/* Project thumbnail */}
                <div className="flex justify-center mb-3">
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    width={300}
                    height={208}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                </div>
                
                {/* Project title */}
                <h4 className="text-lg font-semibold text-accent-cyan mb-2 text-center">
                  {project.name}
                </h4>
                
                {/* Project description */}
                <p className="text-sm text-accent-white mb-3 text-center line-clamp-2 font-oxanium">
                  {project.description}
                </p>
                
                {/* See more button */}
                <div className="flex justify-center">
                  <button className="text-accent-cyan group-hover:text-accent-cyanLight group-hover:scale-115 transition-all duration-200 ease-out flex items-center gap-1 cursor-pointer">
                    see more <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
