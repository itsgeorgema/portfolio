import Modal from "../Modal";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ABOUT">
      <div className="text-white">
        <p className="text-lg">About Me</p>
      </div>
    </Modal>
  );
}
