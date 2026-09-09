import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiX, FiLoader } from "react-icons/fi";
import { jsPDF } from "jspdf";
import ResumePaperPreview from "./ResumePaperPreview";
import { spendCoins } from "../../apis/user.api.js";

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof skills === "string") {
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const normalizeBulletLines = (value) => {
  if (!value) return [];
  return String(value)
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
};

const ResumePreviewModal = memo(function ResumePreviewModal({
  isOpen,
  onClose,
  data = {},
  setUser,
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);

      // 1. Deduct coins from backend
      const res = await spendCoins({ coins: 10, action: "resume-preview" });

      if (res?.success) {
        if (setUser) {
          setUser((prev) => ({
            ...prev,
            interviewCoin: res.interviewCoin ?? res.remainingCoins,
          }));
        }

        // Support both data.fullName and data.name
        const candidateName = (data.fullName || data.name || "Resume").trim();
        const filename = `${candidateName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "resume"}.pdf`;

        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 42;
        const textWidth = pageWidth - margin * 2;
        let cursorY = margin;

        const ensureSpace = (height = 18) => {
          if (cursorY + height > pageHeight - margin) {
            pdf.addPage();
            cursorY = margin;
          }
        };

        const addText = (text, options = {}) => {
          if (!text) return;
          const content = String(text);
          const fontSize = options.fontSize || 10;
          const lineHeight = options.lineHeight || fontSize + 4;
          const lines = pdf.splitTextToSize(content, textWidth);
          ensureSpace(lines.length * lineHeight);
          pdf.setFont("helvetica", options.bold ? "bold" : "normal");
          pdf.setFontSize(fontSize);
          pdf.text(lines, margin, cursorY);
          cursorY += lines.length * lineHeight;
        };

        const addSection = (title, content) => {
          if (!content || (Array.isArray(content) && content.length === 0)) return;

          ensureSpace(18);
          pdf.setDrawColor(203, 213, 225);
          pdf.setLineWidth(0.3);
          pdf.line(margin, cursorY, pageWidth - margin, cursorY);
          cursorY += 5;

          pdf.setTextColor(15, 23, 42);
          pdf.setFont("times", "bold");
          pdf.setFontSize(9.25);
          pdf.text(title.toUpperCase(), margin, cursorY);

          cursorY += 9;
          pdf.setTextColor(39, 39, 39);
          pdf.setFont("times", "normal");
          addText(content, { fontSize: 8.9, lineHeight: 11 });
        };

        // Header Section
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("times", "bold");
        pdf.setFontSize(18);
        pdf.text(candidateName.toUpperCase(), pageWidth / 2, margin + 18, { align: "center" });

        pdf.setFont("times", "normal");
        pdf.setFontSize(8.5);
        pdf.text(
          [data.location, data.phone, data.email, data.github, data.linkedin]
            .filter(Boolean)
            .join("   |   "),
          pageWidth / 2,
          margin + 36,
          { align: "center" },
        );

        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.4);
        pdf.line(margin, margin + 45, pageWidth - margin, margin + 45);

        cursorY = margin + 55;
        pdf.setTextColor(39, 39, 39);

        // Summary & Skills
        if (data.summary) {
          addSection("Professional Summary", String(data.summary).trim());
        }

        const skillsList = normalizeSkills(data.skills);
        if (skillsList.length > 0) {
          addSection("Core Competencies", skillsList.join(" • "));
        }

        // Work Experience
        (data.experience || []).forEach((entry) => {
          const bulletLines = normalizeBulletLines(entry.responsibilities);
          const experienceText = [
            [entry.role, entry.company].filter(Boolean).join(" - "),
            entry.duration,
            ...bulletLines.map((line) => `• ${line}`),
          ]
            .filter(Boolean)
            .join("\n");

          addSection("Experience", experienceText);
        });

        // Key Projects
        (data.projects || []).forEach((entry) => {
          const bulletLines = normalizeBulletLines(entry.description);
          const projectText = [
            entry.title || entry.projectTitle,
            entry.techStack || entry.projectTech,
            entry.link || entry.projectLink,
            ...bulletLines.map((line) => `• ${line}`),
          ]
            .filter(Boolean)
            .join("\n");

          addSection("Projects", projectText);
        });

        // Education
        (data.education || []).forEach((entry) => {
          const educationText = [
            entry.degree,
            entry.institution || entry.college,
            entry.duration || entry.gradYear,
            entry.score || entry.cgpa,
          ]
            .filter(Boolean)
            .join("\n");

          addSection("Education", educationText);
        });

        const additionalInfo = (data.additionalInfo || [])
          .map((entry) => [entry.title, entry.detail].filter(Boolean).join(": "))
          .filter(Boolean)
          .join("\n");

        if (additionalInfo) {
          addSection("Additional Information", additionalInfo);
        }

        pdf.save(filename);
      } else {
        alert(res?.message || "Insufficient coins or failed to process request.");
      }
    } catch (error) {
      console.error("Resume PDF download error:", error);
      alert(error.response?.data?.message || "Failed to download the resume PDF.");
    } finally {
      setLoading(false);
    }
  }, [data, loading, setUser]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
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
                  disabled={loading}
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <FiLoader className="animate-spin" size={13} />
                  ) : (
                    <FiDownload size={13} />
                  )}
                  <span>{loading ? "Preparing PDF..." : "Download PDF"}</span>
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

            {/* Content View with internal scrolling fix */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 sm:p-6">
                <ResumePaperPreview data={data} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default ResumePreviewModal;