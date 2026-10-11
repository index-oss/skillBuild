"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ResumeState {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  skills: string;
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  projects: {
    name: string;
    link: string;
    description: string;
  }[];
}

export function ResumeBuilderClient({
  initialProfile,
  email,
}: {
  initialProfile?: {
    display_name?: string | null;
    bio?: string | null;
    location_city?: string | null;
    location_country?: string | null;
  } | null;
  email?: string;
}) {
  const [resume, setResume] = useState<ResumeState>({
    fullName: initialProfile?.display_name || "John Doe",
    email: email || "john.doe@example.com",
    phone: "+1 (555) 000-0000",
    location:
      [initialProfile?.location_city, initialProfile?.location_country]
        .filter(Boolean)
        .join(", ") || "San Francisco, CA",
    title: "Full Stack Software Engineer",
    summary:
      initialProfile?.bio ||
      "Passionate developer with a strong foundation in modern web technologies, problem-solving, and scalable application architecture.",
    skills: "React, Next.js, TypeScript, Node.js, PostgreSQL, TailwindCSS, Git",
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: "Software Developer Intern",
        duration: "2024 - Present",
        description:
          "Developed and maintained scalable client-facing web portals using Next.js and Supabase. Optimized query response times by 35%.",
      },
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "B.S. in Computer Science",
        year: "2021 - 2025",
      },
    ],
    projects: [
      {
        name: "SkillForge AI Platform",
        link: "https://github.com/example/skillforge",
        description:
          "Architected real-time talent recruitment and student learning engine powered by Next.js and serverless databases.",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", duration: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (
    index: number,
    field: string,
    val: string,
  ) => {
    setResume((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, experience: updated };
    });
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", year: "" },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, field: string, val: string) => {
    setResume((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, education: updated };
    });
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", link: "", description: "" },
      ],
    }));
  };

  const removeProject = (index: number) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const updateProject = (index: number, field: string, val: string) => {
    setResume((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, projects: updated };
    });
  };

  return (
    <div>
      {/* Top action bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex gap-2 rounded-xl bg-slate-900 p-1 border border-white/10">
          <button
            onClick={() => setActiveTab("edit")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "edit"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ✏️ Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
              activeTab === "preview"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            👁️ Live Preview
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
          >
            📥 Print / Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Editor column */}
        <div
          className={`space-y-6 lg:col-span-6 print:hidden ${
            activeTab === "preview" ? "hidden lg:block" : ""
          }`}
        >
          {/* Header Info */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-500">Target Role / Title</label>
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-500">Email</label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => setResume({ ...resume, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-slate-500">Phone</label>
                <input
                  type="text"
                  value={resume.phone}
                  onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase text-slate-500">Location</label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => setResume({ ...resume, location: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Professional Summary */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6 space-y-3">
            <h3 className="text-base font-semibold text-white">Professional Summary</h3>
            <textarea
              rows={3}
              value={resume.summary}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Skills */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6 space-y-3">
            <h3 className="text-base font-semibold text-white">Skills</h3>
            <input
              type="text"
              value={resume.skills}
              onChange={(e) => setResume({ ...resume, skills: e.target.value })}
              placeholder="e.g. React, Next.js, Python, AWS"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </section>

          {/* Experience */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                + Add Experience
              </button>
            </div>
            {resume.experience.map((exp, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-white/5 bg-black/30 p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Position #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, "company", e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, "role", e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration (e.g. 2023 - Present)"
                  value={exp.duration}
                  onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                />
                <textarea
                  rows={2}
                  placeholder="Key achievements and technologies used..."
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, "description", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                />
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Education</h3>
              <button
                type="button"
                onClick={addEducation}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                + Add Education
              </button>
            </div>
            {resume.education.map((edu, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-white/5 bg-black/30 p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Education #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Graduation Year (e.g. 2025)"
                  value={edu.year}
                  onChange={(e) => updateEducation(idx, "year", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                />
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Projects</h3>
              <button
                type="button"
                onClick={addProject}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                + Add Project
              </button>
            </div>
            {resume.projects.map((proj, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-xl border border-white/5 bg-black/30 p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Project #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) => updateProject(idx, "name", e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Project URL"
                    value={proj.link}
                    onChange={(e) => updateProject(idx, "link", e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Brief description of what you created and the stack..."
                  value={proj.description}
                  onChange={(e) => updateProject(idx, "description", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white"
                />
              </div>
            ))}
          </section>
        </div>

        {/* Live Preview column */}
        <div
          className={`lg:col-span-6 ${
            activeTab === "edit" ? "hidden lg:block" : ""
          }`}
        >
          <div className="sticky top-6">
            <div
              ref={printRef}
              className="min-h-[842px] w-full rounded-2xl bg-white p-8 text-slate-900 shadow-2xl print:m-0 print:rounded-none print:p-8 print:shadow-none"
            >
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                  {resume.fullName || "Your Name"}
                </h1>
                <p className="text-sm font-semibold text-blue-600">
                  {resume.title || "Your Professional Title"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  {resume.email && <span>✉️ {resume.email}</span>}
                  {resume.phone && <span>📞 {resume.phone}</span>}
                  {resume.location && <span>📍 {resume.location}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.summary && (
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                    Professional Summary
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-700">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* Skills */}
              {resume.skills && (
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                    Technical Skills
                  </h2>
                  <p className="mt-2 text-xs text-slate-700 font-medium">
                    {resume.skills}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resume.experience.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                    Experience
                  </h2>
                  <div className="mt-2 space-y-3">
                    {resume.experience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-900">
                            {exp.role || "Role"} • <span className="font-semibold text-slate-700">{exp.company || "Company"}</span>
                          </span>
                          <span className="text-slate-500 font-medium">{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resume.projects.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                    Projects
                  </h2>
                  <div className="mt-2 space-y-3">
                    {resume.projects.map((proj, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-900">{proj.name || "Project"}</span>
                          {proj.link && (
                            <span className="text-[11px] text-blue-600 truncate max-w-[200px]">
                              {proj.link}
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                            {proj.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resume.education.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                    Education
                  </h2>
                  <div className="mt-2 space-y-2">
                    {resume.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-baseline text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{edu.degree || "Degree"}</span>
                          <span className="text-slate-600">, {edu.institution || "Institution"}</span>
                        </div>
                        <span className="text-slate-500 font-medium">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
