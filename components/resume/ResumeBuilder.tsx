'use client';

import { useState } from 'react';
import { Loader2, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

interface ResumeData {
  title: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export default function ResumeBuilder({ initialData }: { initialData: ResumeData | null }) {
  const [formData, setFormData] = useState<ResumeData>(
    initialData || {
      title: 'Full Stack Developer',
      summary: 'Passionate developer building scalable web apps.',
      skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS'],
      experience: [
        {
          company: 'Tech Corp',
          role: 'Frontend Engineer',
          period: '2023 - Present',
          description: 'Built modern SaaS dashboards using Next.js and Tailwind.',
        },
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'B.Tech in Computer Science',
          year: '2023',
        },
      ],
    }
  );

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage('Resume saved successfully!');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        alert('Failed to save resume');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving resume');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white">Interactive Resume Builder</h1>
          <p className="text-slate-400 text-sm">Craft your professional profile for job applications.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-md disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Resume'}
        </button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-4 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold text-white">Professional Title & Summary</h2>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Resume Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Professional Summary</label>
          <textarea
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold text-white">Skills</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill (e.g., GraphQL)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddSkill}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="flex items-center gap-2 bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-sm"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(index)}
                className="text-slate-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}