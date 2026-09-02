import React, { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResumeForm from "../components/resume/ResumeForm.jsx";
import initialData from "../components/resume/initialData.js";
import { TOTAL_STEPS, STEP_MAP } from "../components/resume/constants/resumeSteps.js";

import ResumeNavbar from "../components/resume/ResumeNavbar";
import StepHeader from "../components/resume/StepHeader";
import StepNavigation from "../components/resume/StepNavigation";

// Code-split preview modal: not loaded until user asks for preview
const ResumePreviewModal = lazy(() => import("../components/resume/ResumePreviewModal"));

export default function ResumeBuilder({ user, setUser }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [showPreview, setShowPreview] = useState(false);

  // O(1) step lookup without recomputing arrays
  const activeStepMeta = useMemo(() => STEP_MAP[currentStep] || STEP_MAP[1], [currentStep]);
  
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;

  // Stable callbacks to protect memoized child components
  const handleTogglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  const handleOpenPreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const handleFinish = useCallback(() => {
    setShowPreview(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#0A0A0A]">
      <ResumeNavbar
        label="Resume Builder"
        showPreview={showPreview}
        onTogglePreview={handleTogglePreview}
      />

      <main className="max-w-3xl w-full mx-auto px-4 pt-20 pb-16">
        <StepHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepMeta={activeStepMeta}
          showPreview={showPreview}
          onTogglePreview={handleTogglePreview}
        />

        <div className="bg-white border-2 border-black/10 rounded-2xl p-5 sm:p-6 shadow-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <ResumeForm step={currentStep} data={data} setData={setData} />
            </motion.div>
          </AnimatePresence>

          <StepNavigation
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onPrev={handlePrev}
            onNext={handleNext}
            onFinish={handleFinish}
            onOpenPreview={handleOpenPreview}
          />
        </div>
      </main>

      {/* Lazy loaded: Zero overhead on first render */}
      {showPreview && (
        <Suspense fallback={null}>
          <ResumePreviewModal
            isOpen={showPreview}
            onClose={handleClosePreview}
            data={data}
          />
        </Suspense>
      )}
    </div>
  );
}