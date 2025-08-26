import Modal from "../Modal";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GALLERY">
      <div className="text-white">
        <p className="text-lg">Gallery Images</p>
      </div>
    </Modal>
  );
}
