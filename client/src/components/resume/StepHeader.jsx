import React, { memo } from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";

const StepHeader = memo(function StepHeader({ 
  currentStep, 
  totalSteps, 
  stepMeta, 
  showPreview, 
  onTogglePreview 
}) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-black/45">
          Step {currentStep} of {totalSteps}
        </span>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-black/60">
            {progressPercentage}% Done
          </span>
          <button
            type="button"
            onClick={onTogglePreview}
            className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 sm:hidden"
          >
            <FiEye size={12} />
            <span>{showPreview ? "Close" : "Preview"}</span>
          </button>
        </div>
      </div>

      <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black rounded-full"
          initial={false}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </div>

      <div className="mt-3">
        <h2 className="text-xl font-bold text-[#0A0A0A]">{stepMeta?.title}</h2>
        <p className="text-xs text-black/50 mt-0.5">{stepMeta?.subtitle}</p>
      </div>
    </div>
  );
});

export default StepHeader;