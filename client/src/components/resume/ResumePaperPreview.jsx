import React, { memo } from "react";

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
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

const ResumePaperPreview = memo(function ResumePaperPreview({ data }) {
  const {
    name,
    location,
    phone,
    email,
    github,
    linkedin,
    summary,
    skills,
    experience,
    projects,
    education,
    additionalInfo,
  } = data;

  const formattedSkills = normalizeSkills(skills);
  const contactItems = [location, phone, email, github, linkedin].filter(Boolean);

  return (
    <div className="max-w-[760px] mx-auto bg-white text-neutral-900 font-serif text-[11px] leading-relaxed border-0 shadow-none">
      <div className="px-6 sm:px-8 pt-5 sm:pt-6">
        <h1 className="text-center text-[22px] sm:text-[24px] font-bold uppercase tracking-[0.06em] text-slate-900">
          {name || "Your Name"}
        </h1>

        {contactItems.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center items-center gap-1 text-[8px] sm:text-[9px] text-slate-700 uppercase tracking-[0.02em]">
            {contactItems.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center">
                {item}
                {index < contactItems.length - 1 && <span className="mx-1.5 text-slate-400">|</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 sm:px-8 py-4 sm:py-5">
        <div className="space-y-2.5">
          {summary && (
            <section>
              <h2 className="pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-900 border-b border-slate-300">
                Summary
              </h2>
              <p className="mt-1.5 text-neutral-700 whitespace-pre-line">{summary}</p>
            </section>
          )}

          {formattedSkills.length > 0 && (
            <section>
              <h2 className="pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-900 border-b border-slate-300">
                Technical Skills
              </h2>
              <p className="mt-1.5 text-neutral-700">{formattedSkills.join(" • ")}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section>
              <h2 className="pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-900 border-b border-slate-300">
                Experience
              </h2>

              <div className="mt-2 space-y-4">
                {experience.map((exp, idx) => {
                  const bulletLines = normalizeBulletLines(exp.responsibilities);

                  return (
                    <div key={exp.id || `exp-${idx}`}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="font-bold text-neutral-900">{exp.role || "Role Title"}</div>
                          <div className="text-[11px] text-neutral-700">{exp.company}</div>
                        </div>
                        {exp.duration && (
                          <div className="text-[10px] text-neutral-500 whitespace-nowrap">
                            {exp.duration}
                          </div>
                        )}
                      </div>

                      {bulletLines.length > 0 ? (
                        <ul className="mt-2 list-disc pl-4 text-neutral-700 space-y-1">
                          {bulletLines.map((line, lineIndex) => (
                            <li key={`${exp.id || idx}-line-${lineIndex}`}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        exp.responsibilities && (
                          <p className="mt-2 text-neutral-700 whitespace-pre-line">
                            {exp.responsibilities}
                          </p>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {projects?.length > 0 && (
            <section>
              <h2 className="pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-900 border-b border-slate-300">
                Projects
              </h2>

              <div className="mt-2 space-y-3">
                {projects.map((proj, idx) => {
                  const bulletLines = normalizeBulletLines(proj.description);

                  return (
                    <div key={proj.id || `proj-${idx}`}>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div className="font-bold text-neutral-900">
                          {proj.title || "Project Name"}
                        </div>
                        {proj.techStack && (
                          <div className="text-[10px] text-slate-600 font-mono whitespace-nowrap">
                            {proj.techStack}
                          </div>
                        )}
                      </div>

                      {proj.link && (
                        <div className="mt-1 text-[10px] text-sky-700 break-all">
                          {proj.link}
                        </div>
                      )}

                      {bulletLines.length > 0 ? (
                        <ul className="mt-1.5 list-disc pl-4 text-neutral-700 space-y-1">
                          {bulletLines.map((line, lineIndex) => (
                            <li key={`${proj.id || idx}-line-${lineIndex}`}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        proj.description && (
                          <p className="mt-1.5 text-neutral-700 whitespace-pre-line">{proj.description}</p>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {education?.length > 0 && (
            <section>
              <h2 className="pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-900 border-b border-slate-300">
                Education
              </h2>

              <div className="mt-2 space-y-2">
                {education.map((edu, idx) => (
                  <div key={edu.id || `edu-${idx}`} className="flex justify-between gap-3">
                    <div>
                      <div className="font-bold text-neutral-900">{edu.degree || "Degree"}</div>
                      <div className="text-[11px] text-neutral-600">{edu.institution}</div>
                    </div>

                    <div className="text-right text-[11px] text-neutral-500">
                      <div>{edu.duration}</div>
                      {edu.score && <div className="font-mono text-neutral-600">{edu.score}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {additionalInfo?.length > 0 && (
            <section>
              <h2 className="pb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-900 border-b border-slate-300">
                Additional Information
              </h2>

              <div className="mt-2 space-y-1.5 text-neutral-700">
                {additionalInfo.map((info, idx) => (
                  <div key={info.id || `info-${idx}`}>
                    {info.title && <span className="font-bold text-neutral-900">{info.title}</span>}
                    {info.title && info.detail ? ": " : ""}
                    {info.detail}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
});

export default ResumePaperPreview;