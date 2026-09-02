import React from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";

function Input({
  label,
  value,
  onChange,
  name,
  type = "text",
  placeholder = "",
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        value={value || ""}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 
        py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  name,
  placeholder = "",
  rows = 3,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold text-black/70 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        rows={rows}
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        value={value || ""}
        className="bg-white border-2 border-black/25 text-[#0A0A0A] text-xs rounded-lg px-2.5 
        py-2 outline-none focus:border-black/60 transition-colors placeholder-black/30 
        shadow-[0_2px_8px_rgba(0,0,0,0.04)] resize-none"
      />
    </div>
  );
}

function EntryCard({ children, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-[#F8F9FA] border-2 border-black/15 rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2.5 right-2.5 z-10 text-black/35 hover:text-red-500 transition-colors p-1 cursor-pointer"
      >
        <FiTrash2 size={14} />
      </button>
      <div className="relative flex flex-col gap-2.5 pr-6">{children}</div>
    </div>
  );
}

function ResumeForm({ step, data = {}, setData }) {
  const handleFieldChange = (key, val) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  // Helper for updating array-of-objects items
  const handleArrayItemChange = (listKey, index, field, val) => {
    setData((prev) => {
      const updatedList = [...(prev[listKey] || [])];
      updatedList[index] = { ...updatedList[index], [field]: val };
      return { ...prev, [listKey]: updatedList };
    });
  };

  // Helper for adding new item to an array field
  const handleAddItem = (listKey, template) => {
    setData((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] || []), template],
    }));
  };

  // Helper for deleting an item by index
  const handleRemoveItem = (listKey, indexToRemove) => {
    setData((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  // Step 1: Personal Info
  if (step === 1) {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Full Name"
          name="name"
          placeholder="Animesh Singh"
          onChange={handleFieldChange}
          value={data.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="animesh.singh@example.com"
          onChange={handleFieldChange}
          value={data.email}
        />
        <Input
          label="Phone"
          name="phone"
          placeholder="123-456-7890"
          onChange={handleFieldChange}
          value={data.phone}
        />
        <Input
          label="Location"
          name="location"
          placeholder="New York, NY"
          onChange={handleFieldChange}
          value={data.location}
        />
        <Input
          label="LinkedIn"
          name="linkedin"
          placeholder="linkedin.com/in/example"
          onChange={handleFieldChange}
          value={data.linkedin}
        />
        <Input
          label="GitHub / Portfolio"
          name="github"
          placeholder="github.com/example"
          onChange={handleFieldChange}
          value={data.github}
        />
      </div>
    );
  }

  // Step 2: Summary
  if (step === 2) {
    return (
      <div className="flex flex-col gap-3">
        <TextArea
          label="Professional Summary"
          name="summary"
          rows={5}
          placeholder="Results-driven software engineer with experience building scalable microservices..."
          onChange={handleFieldChange}
          value={data.summary}
        />
        <p className="text-[10px] text-black/50">
          Leave empty to skip or keep it concise for standard ATS scoring.
        </p>
      </div>
    );
  }

  // Step 3: Skills (comma-separated string)
  if (step === 3) {
    return (
      <div className="flex flex-col gap-3">
        <TextArea
          label="Skills (comma separated)"
          name="skills"
          rows={4}
          placeholder="JavaScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS"
          onChange={handleFieldChange}
          value={data.skills}
        />
        <p className="text-[10px] text-black/50">Separate skills with commas.</p>
      </div>
    );
  }

  // Step 4: Experience (array of objects)
  if (step === 4) {
    const experiences = data.experience || [];

    return (
      <div className="flex flex-col gap-3">
        {experiences.length === 0 && (
          <p className="text-[10px] text-black/50">
            No experience entries added yet. Click below to add your job history.
          </p>
        )}

        {experiences.map((exp, index) => (
          <EntryCard
            key={index}
            onRemove={() => handleRemoveItem("experience", index)}
          >
            <Input
              label="Company"
              name="company"
              placeholder="TechNova Solutions"
              value={exp.company}
              onChange={(name, val) =>
                handleArrayItemChange("experience", index, name, val)
              }
            />
            <Input
              label="Role"
              name="role"
              placeholder="Backend Developer"
              value={exp.role}
              onChange={(name, val) =>
                handleArrayItemChange("experience", index, name, val)
              }
            />
            <Input
              label="Duration"
              name="duration"
              placeholder="Jan 2023 - Present"
              value={exp.duration}
              onChange={(name, val) =>
                handleArrayItemChange("experience", index, name, val)
              }
            />
            <TextArea
              label="Responsibilities"
              name="responsibilities"
              rows={3}
              placeholder="• Architected microservices with 99.9% uptime&#10;• Decreased read latency with Redis"
              value={exp.responsibilities}
              onChange={(name, val) =>
                handleArrayItemChange("experience", index, name, val)
              }
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={() =>
            handleAddItem("experience", {
              company: "",
              role: "",
              duration: "",
              responsibilities: "",
            })
          }
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border-2 border-dashed border-black/20 text-xs font-semibold text-black/70 hover:border-black/50 hover:text-black transition-colors cursor-pointer"
        >
          <FiPlus size={14} /> Add Experience
        </button>
      </div>
    );
  }

  // Step 5: Projects (array of objects)
  if (step === 5) {
    const projects = data.projects || [];

    return (
      <div className="flex flex-col gap-3">
        {projects.length === 0 && (
          <p className="text-[10px] text-black/50">
            No projects added yet. Click below to add projects.
          </p>
        )}

        {projects.map((proj, index) => (
          <EntryCard
            key={index}
            onRemove={() => handleRemoveItem("projects", index)}
          >
            <Input
              label="Project Title"
              name="title"
              placeholder="AI Interviewer Platform"
              value={proj.title}
              onChange={(name, val) =>
                handleArrayItemChange("projects", index, name, val)
              }
            />
            <Input
              label="Tech Stack"
              name="techStack"
              placeholder="React, Node.js, Express, MongoDB, Redis"
              value={proj.techStack}
              onChange={(name, val) =>
                handleArrayItemChange("projects", index, name, val)
              }
            />
            <Input
              label="Project Link / Repo"
              name="link"
              placeholder="https://github.com/user/project"
              value={proj.link}
              onChange={(name, val) =>
                handleArrayItemChange("projects", index, name, val)
              }
            />
            <TextArea
              label="Description"
              name="description"
              rows={3}
              placeholder="Engineered end-to-end resume scoring pipelines using Groq APIs and LangChain..."
              value={proj.description}
              onChange={(name, val) =>
                handleArrayItemChange("projects", index, name, val)
              }
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={() =>
            handleAddItem("projects", {
              title: "",
              techStack: "",
              link: "",
              description: "",
            })
          }
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border-2 border-dashed border-black/20 text-xs font-semibold text-black/70 hover:border-black/50 hover:text-black transition-colors cursor-pointer"
        >
          <FiPlus size={14} /> Add Project
        </button>
      </div>
    );
  }

  // Step 6: Education (array of objects)
  if (step === 6) {
    const educations = data.education || [];

    return (
      <div className="flex flex-col gap-3">
        {educations.length === 0 && (
          <p className="text-[10px] text-black/50">
            No education added yet. Click below to add degrees or certifications.
          </p>
        )}

        {educations.map((edu, index) => (
          <EntryCard
            key={index}
            onRemove={() => handleRemoveItem("education", index)}
          >
            <Input
              label="Institution / University"
              name="institution"
              placeholder="AKTU"
              value={edu.institution}
              onChange={(name, val) =>
                handleArrayItemChange("education", index, name, val)
              }
            />
            <Input
              label="Degree / Course"
              name="degree"
              placeholder="B.Tech in Computer Science"
              value={edu.degree}
              onChange={(name, val) =>
                handleArrayItemChange("education", index, name, val)
              }
            />
            <Input
              label="Duration / Year"
              name="duration"
              placeholder="2020 - 2024"
              value={edu.duration}
              onChange={(name, val) =>
                handleArrayItemChange("education", index, name, val)
              }
            />
            <Input
              label="Grade / Score"
              name="score"
              placeholder="8.2 CGPA or 80%"
              value={edu.score}
              onChange={(name, val) =>
                handleArrayItemChange("education", index, name, val)
              }
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={() =>
            handleAddItem("education", {
              institution: "",
              degree: "",
              duration: "",
              score: "",
            })
          }
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border-2 border-dashed border-black/20 text-xs font-semibold text-black/70 hover:border-black/50 hover:text-black transition-colors cursor-pointer"
        >
          <FiPlus size={14} /> Add Education
        </button>
      </div>
    );
  }

  // Step 7: Additional Information (array of objects)
  if (step === 7) {
    const additional = data.additionalInfo || [];

    return (
      <div className="flex flex-col gap-3">
        {additional.length === 0 && (
          <p className="text-[10px] text-black/50">
            No additional info added yet. Add certifications, awards, or languages below.
          </p>
        )}

        {additional.map((item, index) => (
          <EntryCard
            key={index}
            onRemove={() => handleRemoveItem("additionalInfo", index)}
          >
            <Input
              label="Category / Heading"
              name="title"
              placeholder="Certifications, Achievements, or Languages"
              value={item.title}
              onChange={(name, val) =>
                handleArrayItemChange("additionalInfo", index, name, val)
              }
            />
            <TextArea
              label="Details / Description"
              name="detail"
              rows={3}
              placeholder="AWS Certified Developer Associate, LeetCode 400+ problems solved, Hindi & English"
              value={item.detail}
              onChange={(name, val) =>
                handleArrayItemChange("additionalInfo", index, name, val)
              }
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={() =>
            handleAddItem("additionalInfo", {
              title: "",
              detail: "",
            })
          }
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border-2 border-dashed border-black/20 text-xs font-semibold text-black/70 hover:border-black/50 hover:text-black transition-colors cursor-pointer"
        >
          <FiPlus size={14} /> Add Extra Section
        </button>
      </div>
    );
  }

  return null;
}

export default ResumeForm;