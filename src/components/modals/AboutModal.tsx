import Modal from "../Modal";
import Image from "next/image";
import ScrollArrow from "../ScrollArrow";
import SlideInFadeIn from "../animations/SlideInFadeIn";
import { useState, useEffect, useRef } from "react";
import experienceData from "../../../experience.json";

interface Experience {
  title: string;
  company: string;
  url?: string;
  date: string;
  description: string;
  highlights: string[];
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Convert JSON data to array format
  const experiences: Experience[] = Object.values(experienceData);



  // Calculate which timeline item is closest to the center of the viewport
  useEffect(() => {
    if (experiences.length === 0) return;

    const calculateClosestItem = () => {
      const scrollContainer = document.querySelector('.experience-scroll-container');
      if (!scrollContainer) return;
      
      // Get the scroll container's dimensions and scroll position
      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      
      // Calculate the center of the visible area within the scroll container
      const visibleCenter = scrollTop + containerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      entryRefs.current.forEach((item, index) => {
        if (!item) return;
        
        // Get the item's position relative to the scroll container
        const itemTop = item.offsetTop; // Position relative to scroll container
        const itemHeight = item.offsetHeight;
        const itemCenter = itemTop + itemHeight / 2;
        
        const distance = Math.abs(itemCenter - visibleCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    const scrollContainer = document.querySelector('.experience-scroll-container');
    if (scrollContainer) {
      calculateClosestItem();
      scrollContainer.addEventListener('scroll', calculateClosestItem);
      window.addEventListener('resize', calculateClosestItem);
      
      return () => {
        scrollContainer.removeEventListener('scroll', calculateClosestItem);
        window.removeEventListener('resize', calculateClosestItem);
      };
    }
  }, [activeIndex, experiences.length]);



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="/ABOUT">
      <div className="modal-container text-white flex flex-col h-full">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Main content area - scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-default space-y-8 min-h-0 experience-scroll-container">
            {/* Hero Section - Bio and Scroll Arrow */}
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              {/* Introduction Section */}
              <div className="flex flex-row items-start space-x-8 justify-center">
                {/* Profile Image - Left Side */}
                <div className="flex-shrink-0">
                  <Image 
                    src="/GeorgeMa1.jpg" 
                    alt="George Ma" 
                    width={300}
                    height={300}
                    className="object-cover object-center shadow-2xl"
                  />
                </div>
                
                {/* About Text - Right Side */}
                <div className="flex-1 max-w-2xl">
                  <h3 className="text-4xl font-bold text-accent-cyanLight mb-6 font-orbitron">
                    Hi, I&apos;m George <span className="inline-block animate-wave">👋</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed font-oxanium">
                      I&apos;m a Data Science student at UCSD minoring in Business Analytics. I have extensive experience in web and app development as well as machine learning, and am pursuing a career in software engineering. I currently work as a Software Engineer Intern at Praxie AI, a startup that provides an AI-powered coaching platform for youth golfers.
                    </p>
                    
                    <p className="text-lg leading-relaxed font-oxanium">
                      In my free time, I enjoy snowboarding, rock climbing, hiking, and playing basketball and guitar, though I wouldn&apos;t say I am the best...
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Scroll Arrow Section - Smaller spacing */}
              <div className="w-full flex justify-center py-4">
                <ScrollArrow targetSelector=".experience-section" />
              </div>
            </div>
            
            {/* Experience Timeline */}
            <div className="w-full experience-section">
              <h3 className="text-2xl font-bold text-accent-cyanLight mb-8 text-center font-orbitron">Experience</h3>
              
              <div className="relative">
                {/* Timeline Center Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-accent-cyanLight/30"></div>
                
                {/* Dynamic Timeline Entries */}
                {experiences.map((experience, index) => (
                  <SlideInFadeIn 
                    key={index}
                    delay={index * 0.1}
                    direction="up"
                    distance={30}
                  >
                    <div 
                      ref={(el) => { entryRefs.current[index] = el; }}
                      data-index={index}
                      className="relative mb-8"
                    >
                      <div className="flex items-center">
                        <div className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 transition-all duration-300 ${
                          index === activeIndex ? 'bg-accent-cyanLight scale-110' : 'bg-accent-cyanLight/70 scale-100'
                        }`}>
                          {index + 1}
                        </div>
                        <div className={`${index % 2 === 0 ? 'w-5/12 ml-auto' : 'w-5/12 mr-auto'}`}>
                          <div className={`bg-nardo-600/20 rounded-lg p-6 shadow-lg transition-all duration-300 ${
                            index === activeIndex 
                              ? 'border-2 border-accent-cyanLight scale-110' 
                              : 'border border-accent-cyanLight/30 scale-100'
                          }`}>
                            <h4 className="text-lg font-bold text-accent-cyanLight mb-2">{experience.title}</h4>
                            <p className="text-accent-cyanLight font-semibold mb-2">
                              {experience.url ? (
                                <a
                                  href={experience.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {experience.company}
                                </a>
                              ) : (
                                experience.company
                              )}
                            </p>
                            <p className="text-gray-300 text-sm mb-3">{experience.date}</p>
                            <ul className="text-gray-300 text-base space-y-2">
                              {experience.highlights.map((highlight, highlightIndex) => (
                                <li key={highlightIndex}>• {highlight}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SlideInFadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
