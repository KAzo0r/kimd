import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Languages, 
  CheckCircle2,
  DollarSign,
  Send
} from 'lucide-react';
import { useJobStore } from '../../store/useJobStore';

export default function ResumeForm({ onSaved }) {
  const { resume, saveResume } = useJobStore();
  
  const [formData, setFormData] = useState({ ...resume });
  const [newSkill, setNewSkill] = useState("");
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
    }
    setNewSkill("");
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Add Experience
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      period: "2024 - Hozirgacha",
      description: ""
    };
    setFormData(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp]
    }));
  };

  // Update Experience
  const handleUpdateExperience = (index, field, value) => {
    const updated = [...formData.experiences];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, experiences: updated }));
  };

  // Remove Experience
  const handleRemoveExperience = (index) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, experiences: updated }));
  };

  // Add Education
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "Bakalavr",
      year: "2020 - 2024"
    };
    setFormData(prev => ({
      ...prev,
      educations: [...(prev.educations || []), newEdu]
    }));
  };

  // Update Education
  const handleUpdateEducation = (index, field, value) => {
    const updated = [...formData.educations];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, educations: updated }));
  };

  // Remove Education
  const handleRemoveEducation = (index) => {
    const updated = formData.educations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, educations: updated }));
  };

  // Save full resume
  const handleSubmit = (e) => {
    e.preventDefault();
    saveResume(formData);
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
    if (onSaved) onSaved(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      
      {/* Alert Banner */}
      {isSavedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">
            Rezyumengiz muvaffaqiyatli saqlandi va barcha ish beruvchilar uchun yangilandi!
          </span>
        </div>
      )}

      {/* 1. Basic Info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Shaxsiy va aloqa ma'lumotlari
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              F.I.O. (Ism va familiya)
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mutaxassislik / Lavozim
            </label>
            <input
              type="text"
              required
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
              placeholder="Masalan: Frontend Developer (React)"
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Telefon raqam
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Elektron pochta (Email)
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Yashash shahri
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Toshkent"
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kutilayotgan oylik maosh (UZS)
            </label>
            <input
              type="number"
              step="500000"
              value={formData.expectedSalary}
              onChange={(e) => handleChange('expectedSalary', Number(e.target.value))}
              placeholder="15000000"
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Telegram profili
            </label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="@username"
              className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              O'zingiz haqingizda qisqacha (Bio / Summary)
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Kasbiy tajribangiz, yutuqlaringiz va maqsadlaringiz haqida yozing..."
              className="w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Skills */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Ko'nikmalar va texnologiyalar
        </h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Yangi ko'nikma (masalan: React, TypeScript, Figma)..."
            className="flex-1 py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(e);
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Qo'shish</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {formData.skills && formData.skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Work Experience */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ish tajribasi
          </h3>
          <button
            type="button"
            onClick={handleAddExperience}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Ish joyi qo'shish</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.experiences && formData.experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 relative">
              <button
                type="button"
                onClick={() => handleRemoveExperience(idx)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
                title="O'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kompaniya nomi
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                    placeholder="Uzum, EPAM yoki boshqa"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Lavozim
                  </label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                    placeholder="Frontend Developer"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Ishlagan davr
                </label>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                  placeholder="2023 - 2025"
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Vazifalar va yutuqlar
                </label>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                  placeholder="Loyihalar, ishlatilgan texnologiyalar..."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Education */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Ta'lim
          </h3>
          <button
            type="button"
            onClick={handleAddEducation}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>O'qish joyi qo'shish</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.educations && formData.educations.map((edu, idx) => (
            <div key={edu.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 relative">
              <button
                type="button"
                onClick={() => handleRemoveEducation(idx)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Universitet / Kollej / Maktab
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                    placeholder="TATU, O'zMU..."
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Mutaxassislik / Daraja
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                    placeholder="Bakalavr — Axborot xavfsizligi"
                    className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  O'qish davri
                </label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                  placeholder="2020 - 2024"
                  className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Save className="w-4 h-4" />
          <span>Rezyumeni saqlash</span>
        </button>
      </div>

    </form>
  );
}
