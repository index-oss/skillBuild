'use client';

import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { createClient } from '@/utils/supabase/client';

export default function JobPostForm() {
  const supabase = createClient();
=======
import { supabase } from '@/lib/supabase/client';

export default function JobPostForm() {
  // Uses shared supabase singleton from @/lib/supabase/client
>>>>>>> 01e3ebe (Intital commit)
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [isCustomCompany, setIsCustomCompany] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing companies
  useEffect(() => {
    async function fetchCompanies() {
      const { data } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');
      
      if (data) {
        setCompanies(data);
      }
    }
    fetchCompanies();
  }, [supabase]);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('Please login first.');
        setLoading(false);
        return;
      }

      let targetCompanyId = selectedCompanyId;

      // Agar user ne custom company name dala hai
      if (isCustomCompany && customCompanyName.trim()) {
        const slug = customCompanyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        // 1. Create Company
        const { data: newCompany, error: compError } = await supabase
          .from('companies')
          .insert({
            name: customCompanyName.trim(),
            slug: slug,
          })
          .select('id')
          .single();

        if (compError || !newCompany) {
          throw new Error('Failed to create company: ' + compError?.message);
        }

        targetCompanyId = newCompany.id;

        // 2. Create Company Membership (Strictly 'company_admin')
        const { error: memberError } = await supabase
          .from('company_members')
          .insert({
            company_id: newCompany.id,
            profile_id: user.id,
            role: 'company_admin'
          });

        if (memberError) {
          throw new Error('Company membership could not be created: ' + memberError.message);
        }
      }

      // 3. Post Job
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          title: jobTitle,
          description: jobDescription,
          company_id: targetCompanyId || null,
          status: 'published'
        });

      if (jobError) {
        throw new Error('Error posting job: ' + jobError.message);
      }

      alert('Job posted and company registered successfully!');
      
      setJobTitle('');
      setJobDescription('');
      setSelectedCompanyId('');
      setCustomCompanyName('');
      setIsCustomCompany(false);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-slate-900 rounded-xl border border-slate-800 space-y-5 text-white">
      <h2 className="text-xl font-bold">Post a New Job & Manage Company</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
        <input 
          type="text" 
          value={jobTitle} 
          onChange={(e) => setJobTitle(e.target.value)} 
          required 
          placeholder="e.g. Full Stack Security Engineer"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
        {!isCustomCompany ? (
          <div className="flex gap-2">
            <select
              value={selectedCompanyId}
              onChange={(e) => {
                if (e.target.value === 'CUSTOM_OPTION') {
                  setIsCustomCompany(true);
                  setSelectedCompanyId('');
                } else {
                  setSelectedCompanyId(e.target.value);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
              required={!isCustomCompany}
            >
              <option value="">Select an existing company...</option>
              {companies.map((comp) => (
                <option key={comp.id} value={comp.id}>{comp.name}</option>
              ))}
              <option value="CUSTOM_OPTION" className="text-indigo-400 font-semibold">
                + Add Custom / New Company Name
              </option>
            </select>
          </div>
        ) : (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={customCompanyName}
              onChange={(e) => setCustomCompanyName(e.target.value)}
              placeholder="Enter new company name..."
              required={isCustomCompany}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="button" 
              onClick={() => { setIsCustomCompany(false); setCustomCompanyName(''); }}
              className="px-3 py-2 bg-slate-700 text-sm rounded-lg text-gray-300 hover:bg-slate-600 transition"
            >
              Back
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Job Description</label>
        <textarea 
          value={jobDescription} 
          onChange={(e) => setJobDescription(e.target.value)} 
          required 
          rows={4}
          placeholder="Describe the role and requirements..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold rounded-lg transition"
      >
        {loading ? 'Processing...' : 'Publish Job'}
      </button>
    </form>
  );
}
