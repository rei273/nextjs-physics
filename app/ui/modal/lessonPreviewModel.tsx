
import React from "react";
import {ModalProps} from "@/app/lib/definitions";

// type ModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   children: ReactNode;
// };
import {XMarkIcon} from "@heroicons/react/20/solid";
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-end">
          <button onClick={onClose}> <XMarkIcon className="w-6" /></button>
          {/* <Button onClick={onClose}>Cancel</Button> */}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

{/* <Modal isOpen={isPreviewOpen} onClose={closePreviewModal}>
  <h3>{selectedLesson.title}</h3>
  <p>{selectedLesson.summary}</p>
  {selectedLesson.prerequisites.length > 0 && (
    <p>
      This lesson builds on:
      {selectedLesson.prerequisites.map((prerequisite) => (
        <span key={prerequisite.id}>{prerequisite.title}</span>
      ))}
    </p>
  )}
  <button onClick={() => navigateToLesson(selectedLesson.prerequisites[0].id)}>
    Go to Prerequisite
  </button>
  <button onClick={() => previewLesson(selectedLesson.id)}>Preview Lesson</button>
</Modal>
  */}