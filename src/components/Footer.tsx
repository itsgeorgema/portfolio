import { FaLinkedin, FaGithub } from "react-icons/fa";
import { nardoGrayColors } from "@/styles/colors";

export default function Footer() {
  return (
    <footer 
      className="text-accent-white" 
      style={{ backgroundColor: nardoGrayColors.primary[500] }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 text-center text-sm">
          
          <div className="flex justify-center gap-4">
          <a href="https://www.linkedin.com/in/ggeorgema" className="text-accent-charcoal">
            <FaLinkedin className="text-2xl" />
          </a>
          <a href="https://github.com/itsgeorgema" className="text-accent-charcoal">
            <FaGithub className="text-2xl" />
          </a>
          </div>
          <p className="font-oxanium">&copy; {new Date().getFullYear()}, Made on lots of Red Bull.</p>
        </div>
      </div>
    </footer>
  );
}