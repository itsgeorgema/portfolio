import Modal from "../Modal";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PROJECTS">
      <div className="text-white">
        <p className="text-lg">Projects</p>
      </div>
    </Modal>
  );
}
