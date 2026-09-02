import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPrinter, FiX } from "react-icons/fi";
import ResumePaperPreview from "./ResumePaperPreview";

const ResumePreviewModal = memo(function ResumePreviewModal({ isOpen, onClose, data }) {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-100 border border-black/10 rounded-3xl p-4 sm:p-6 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Live Reactive Preview
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 transition-colors cursor-pointer"
                >
                  <FiPrinter size={13} />
                  <span>Print / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200/60 transition-colors cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Content View */}
            <div className="overflow-y-auto pr-1">
              <ResumePaperPreview data={data} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default ResumePreviewModal;