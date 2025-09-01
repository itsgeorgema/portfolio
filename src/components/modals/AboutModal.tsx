import Modal from "../Modal";
import Image from "next/image";
import SlideInFadeIn from "../animations/SlideInFadeIn";
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

  // Convert JSON data to array format
  const experiences: Experience[] = Object.values(experienceData);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="/ABOUT">
      <div className="modal-container text-white flex flex-col h-full">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Main content area - scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-default min-h-0 experience-scroll-container">
            {/* Hero Section - Bio and Scroll Arrow */}
            <div className="flex flex-col items-center justify-center min-h-full space-y-4 -mt-10">
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
            </div>
            
            {/* Experience Timeline */}
            <div className="w-full experience-section -mt-8">
              <h3 className="text-2xl font-bold text-accent-cyanLight text-center font-orbitron">Experience</h3>
              
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
                    threshold={0.4}
                  >
                    <div 
                      data-index={index}
                      className="relative mb-8"
                    >
                      <div className="flex items-center">
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent-cyanLight z-10"></div>
                        <div className={`${index % 2 === 0 ? 'w-5/12 ml-auto' : 'w-5/12 mr-auto'}`}>
                          <div className="bg-nardo-600/20 rounded-lg p-6 shadow-lg border border-accent-cyanLight/30">
                            <h4 className="text-lg font-bold text-accent-cyanLight ">{experience.title}</h4>
                            <p className="text-accent-cyanLight font-semibold mb-2">
                              {experience.url ? (
                                <a
                                  href={experience.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  tabIndex={-1}
                                  className="hover:underline"
                                >
                                  {experience.company}
                                </a>
                              ) : (
                                experience.company
                              )}
                            </p>
                            <p className="text-gray-300 text-sm font-oxanium mb-3">{experience.date}</p>
                            <ul className="text-gray-300 text-sm font-oxanium space-y-1">
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
