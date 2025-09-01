"use client";
import { useState, useRef } from "react";
import Modal from "../Modal";
import Image from "next/image";
import { FaCode, FaGithub, FaPlay } from "react-icons/fa";
import projectsData from "../../../projects.json";
import BackButton from "../BackButton";
import FolderGrid from "../FolderGrid";
import FolderTransition from "../animations/FolderTransition";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const demoSectionRef = useRef<HTMLDivElement | null>(null);

  // Convert JSON data to array format
  const projects: Project[] = Object.values(projectsData);

  // Convert projects to folder format
  const projectFolders = projects.map(project => ({
    name: project.name,
    displayName: project.name
  }));

  const handleProjectClick = (projectName: string, event: React.MouseEvent<HTMLDivElement>) => {
    // Get the position of the clicked folder for the transition origin
    const rect = event.currentTarget.getBoundingClientRect();
    const modalContainer = document.querySelector('.modal-container');
    const modalRect = modalContainer?.getBoundingClientRect();
    
    if (modalRect) {
      const folderCenterX = rect.left + rect.width / 2 - modalRect.left;
      const folderCenterY = rect.top + rect.height / 2 - modalRect.top;
      
      setClickPosition({
        x: folderCenterX,
        y: folderCenterY,
      });
    }
    
    // Find the project data
    const project = projects.find(p => p.name === projectName);
    if (project) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setSelectedProject(project);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 150);
      }, 200);
    }
  };

  const handleBack = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setSelectedProject(null);
      setClickPosition(null);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 100);
  };

  // Reset to grid view when modal is closed and reopened
  const handleReset = () => {
    setSelectedProject(null);
    setClickPosition(null);
    setIsTransitioning(false);
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
                    className="px-3 py-1 bg-nardo-700 text-accent-white text-xs rounded-full"
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



  const getModalTitle = () => {
    if (selectedProject) {
      return `/PROJECTS/${selectedProject.name}`;
    }
    return "/PROJECTS";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} onReset={handleReset}>
      <div className="modal-container text-white flex flex-col h-full">
        {selectedProject && <BackButton onClick={handleBack} />}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedProject ? (
            <FolderTransition
              isTransitioning={isTransitioning}
              clickPosition={clickPosition}
              className="flex-1 flex flex-col"
            >
              {/* Project content - scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-default space-y-6 min-h-0">
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
                          className="px-4 py-2 bg-nardo-700 text-white rounded-lg hover:bg-accent-greyDark hover:scale-115 transition-all duration-200 ease-out flex items-center gap-2 shrink-0 whitespace-nowrap"
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
            </FolderTransition>
          ) : (
            <FolderGrid
              folders={projectFolders}
              onFolderClick={handleProjectClick}
              isTransitioning={isTransitioning}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
