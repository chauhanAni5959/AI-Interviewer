import React, { memo } from "react";
import { FiChevronLeft, FiChevronRight, FiCheck, FiEye } from "react-icons/fi";

const StepNavigation = memo(function StepNavigation({
  isFirstStep,
  isLastStep,
  onPrev,
  onNext,
  onFinish,
  onOpenPreview,
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-black/10">
      <button
        type="button"
        disabled={isFirstStep}
        onClick={onPrev}
        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-black/15 text-[#0A0A0A] hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <FiChevronLeft size={15} />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPreview}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-black/15 text-[#0A0A0A] hover:bg-black/5 transition-colors cursor-pointer"
        >
          <FiEye size={14} />
          <span>See Resume</span>
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-[#0A0A0A] text-white hover:bg-black/85 transition-colors cursor-pointer shadow-xs"
          >
            <span>Next</span>
            <FiChevronRight size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinish}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
          >
            <FiCheck size={15} />
            <span>Finish & View</span>
          </button>
        )}
      </div>
    </div>
  );
});

export default StepNavigation;