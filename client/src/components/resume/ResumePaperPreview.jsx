import React, { memo } from "react";

const ResumePaperPreview = memo(function ResumePaperPreview({ data }) {
  const { 
    name, location, phone, email, github, linkedin, 
    summary, skills, experience, projects, education, additionalInfo 
  } = data;

  return (
    <div className="bg-white text-neutral-900 shadow-xl rounded-2xl border border-black/10 p-6 sm:p-8 max-w-2xl mx-auto space-y-4 font-sans text-xs leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-neutral-900 pb-3 text-center">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-neutral-900">
          {name || "Your Name"}
        </h1>
        <div className="text-[11px] text-neutral-600 mt-1 flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          {location && <span>{location} •</span>}
          {phone && <span>{phone} •</span>}
          {email && <span>{email} •</span>}
          {github && <span>{github} •</span>}
          {linkedin && <span>{linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-neutral-700">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Core Competencies
          </h2>
          <p className="text-neutral-700">{skills}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || `exp-${idx}`}>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>{exp.role || "Role Title"}</span>
                  <span className="text-[11px] font-normal text-neutral-500">{exp.duration}</span>
                </div>
                <div className="text-[11px] font-medium text-neutral-700 italic">
                  {exp.company}
                </div>
                {exp.responsibilities && (
                  <p className="text-neutral-600 mt-1 whitespace-pre-line">
                    {exp.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
            Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={proj.id || `proj-${idx}`}>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>{proj.title || "Project Name"}</span>
                  {proj.techStack && (
                    <span className="text-[10px] text-neutral-500 font-mono font-normal">
                      {proj.techStack}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-neutral-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || `edu-${idx}`} className="flex justify-between">
                <div>
                  <div className="font-bold text-neutral-900">{edu.degree || "Degree"}</div>
                  <div className="text-[11px] text-neutral-600">{edu.institution}</div>
                </div>
                <div className="text-right text-[11px] text-neutral-500">
                  <div>{edu.duration}</div>
                  {edu.score && <div className="font-mono">{edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      {additionalInfo?.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-0.5 mb-1.5">
            Additional Information
          </h2>
          <div className="space-y-1.5">
            {additionalInfo.map((info, idx) => (
              <div key={info.id || `info-${idx}`}>
                <span className="font-bold text-neutral-900">{info.title}: </span>
                <span className="text-neutral-700">{info.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default ResumePaperPreview;