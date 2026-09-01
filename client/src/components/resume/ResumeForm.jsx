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

  const handleExperienceChange = (index, field, val) => {
    setData((prev) => {
      const updatedExp = [...(prev.experience || [])];
      updatedExp[index] = { ...updatedExp[index], [field]: val };
      return { ...prev, experience: updatedExp };
    });
  };

  const handleAddExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { company: "", role: "", duration: "", responsibilities: "" },
      ],
    }));
  };

  const handleRemoveExperience = (indexToRemove) => {
    setData((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  if (step === 1) {
    return (
      <div className="flex flex-col gap-3">
        <Input
          label="Full Name"
          name="fullName"
          placeholder="Animesh Singh"
          onChange={handleFieldChange}
          value={data.fullName}
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
          label="GitHub"
          name="github"
          placeholder="github.com/example"
          onChange={handleFieldChange}
          value={data.github}
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex flex-col gap-3">
        <TextArea
          label="Summary"
          name="summary"
          rows={4}
          placeholder="A brief summary about yourself..."
          onChange={handleFieldChange}
          value={data.summary}
        />
        <p className="text-[10px] text-black/50">
          Leave empty to skip this section
        </p>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex flex-col gap-3">
        <TextArea
          label="Skills (comma separated)"
          name="skills"
          rows={4}
          placeholder="JavaScript, React, Node.js, Python"
          onChange={handleFieldChange}
          value={data.skills}
        />
        <p className="text-[10px] text-black/50">Separate skills with commas.</p>
      </div>
    );
  }

  if (step === 4) {
    const experiences = data.experience || [];

    return (
      <div className="flex flex-col gap-3">
        {experiences.length === 0 && (
          <p className="text-[10px] text-black/50">
            No experience added yet. Click below to add.
          </p>
        )}

        {experiences.map((exp, index) => (
          <EntryCard
            key={index}
            onRemove={() => handleRemoveExperience(index)}
          >
            <Input
              label="Company"
              name="company"
              placeholder="ABC Technology"
              value={exp.company}
              onChange={(name, val) => handleExperienceChange(index, name, val)}
            />
            <Input
              label="Role"
              name="role"
              placeholder="Software Engineer"
              value={exp.role}
              onChange={(name, val) => handleExperienceChange(index, name, val)}
            />
            <Input
              label="Duration"
              name="duration"
              placeholder="Jan 2020 - Present"
              value={exp.duration}
              onChange={(name, val) => handleExperienceChange(index, name, val)}
            />
            <TextArea
              label="Responsibilities"
              name="responsibilities"
              placeholder="Describe your responsibilities..."
              value={exp.responsibilities}
              onChange={(name, val) => handleExperienceChange(index, name, val)}
            />
          </EntryCard>
        ))}

        <button
          type="button"
          onClick={handleAddExperience}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border-2 border-dashed border-black/20 text-xs font-semibold text-black/70 hover:border-black/50 hover:text-black transition-colors cursor-pointer"
        >
          <FiPlus size={14} /> Add Experience
        </button>
      </div>
    );
  }

  return null;
}

export default ResumeForm;