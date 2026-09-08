import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Loader2, Image as ImageIcon, Sparkles, Cloud, Database, Award, Plus } from 'lucide-react';
import { uploadToCloudinaryApi, createCandidateApi, getPositionsApi, createPositionApi, PositionItem } from '../../lib/api';
import { Candidate } from '../../data/candidates';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded: (newCandidate: Candidate) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onCandidateAdded,
}) => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [position, setPosition] = useState('President');
  const [availablePositions, setAvailablePositions] = useState<string[]>([
    'President',
    'Vice President',
    'General Secretary',
    'Treasurer',
    'Public Relations Officer',
    'Director of Socials',
    'Director of Welfare',
  ]);
  const [description, setDescription] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [manifestoText, setManifestoText] = useState('');

  // Load admin entered positions on modal open
  useEffect(() => {
    async function loadPositions() {
      try {
        const list = await getPositionsApi();
        if (list && list.length > 0) {
          const titles = list.map((p) => p.title);
          setAvailablePositions(titles);
          if (!titles.includes(position) && titles.length > 0) {
            setPosition(titles[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load admin positions:', err);
      }
    }
    if (isOpen) {
      loadPositions();
    }
  }, [isOpen]);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [storageProvider, setStorageProvider] = useState<'cloudinary' | 'fallback' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Auto upload directly to Cloudinary storage via server API
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const res = await uploadToCloudinaryApi(file, 'votehub/candidates');
      setCloudinaryUrl(res.secure_url || res.url);
      setStorageProvider(res.provider);
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setErrorMessage('Image upload failed, using local preview for now.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position) {
      setErrorMessage('Please provide candidate name and position.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const manifestoList = manifestoText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const trimmedPos = position.trim();
      // Auto register position in MongoDB if newly entered by admin
      if (
        trimmedPos &&
        !availablePositions.some((p) => p.toLowerCase() === trimmedPos.toLowerCase())
      ) {
        createPositionApi({
          title: trimmedPos,
          department: 'Executive Council',
          description: `Elective office entered by administrator`,
        }).catch((e) => console.warn('Could not auto-register position:', e));
      }

      const candidateData: Partial<Candidate> = {
        name: name.trim(),
        party: party.trim() || 'Independent',
        position: trimmedPos,
        description: description.trim() || 'Committed to serving the community and fostering innovation.',
        image:
          cloudinaryUrl ||
          imagePreview ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        education: education.trim() || 'Higher Education Graduate',
        experience: experience.trim() || 'Community and Student Leadership',
        manifesto:
          manifestoList.length > 0
            ? manifestoList
            : ['Promote transparency and ethical governance', 'Expand digital voter participation', 'Community infrastructure enhancement'],
      };

      const created = await createCandidateApi(candidateData);
      onCandidateAdded(created);
      onClose();
    } catch (err: any) {
      console.error('Failed to create candidate in MongoDB:', err);
      setErrorMessage(err.message || 'Could not save candidate to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">Register New Candidate</h3>
              <p className="text-xs text-slate-500">Persisted in MongoDB with Cloudinary storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Photo Upload via Cloudinary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Candidate Portrait (Stored in Cloudinary)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center relative shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
                  <span>PNG, JPG, WEBP up to 10MB</span>
                  {cloudinaryUrl && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <Cloud className="w-3 h-3" />
                      <span>{storageProvider === 'cloudinary' ? 'Cloudinary Verified' : 'Stored via API'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ngozi Adeleke"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Elective Position (Admin Entered) *
                </label>
                <span className="text-[10px] text-[#1769E8] font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Admin
                </span>
              </div>
              <input
                type="text"
                required
                list="positions-datalist"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter elective position (e.g. President, Senator, Treasurer)..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <datalist id="positions-datalist">
                {availablePositions.map((posTitle, idx) => (
                  <option key={idx} value={posTitle} />
                ))}
              </datalist>

              {/* Quick suggestions entered by admin */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {availablePositions.slice(0, 5).map((posTitle) => (
                  <button
                    key={posTitle}
                    type="button"
                    onClick={() => setPosition(posTitle)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      position.toLowerCase() === posTitle.toLowerCase()
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {posTitle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Political Party / Movement</label>
              <input
                type="text"
                value={party}
                onChange={(e) => setParty(e.target.value)}
                placeholder="e.g. Better Tomorrow Movement"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education Background</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Sc. Political Science & Public Admin"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Experience & Leadership Credentials</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5+ years student union speaker, civic advocate"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Campaign Bio</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of candidate background and vision..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Manifesto Pledges (one per line)
            </label>
            <textarea
              rows={3}
              value={manifestoText}
              onChange={(e) => setManifestoText(e.target.value)}
              placeholder="1. Transparent budget allocation&#10;2. Campus digital innovation center&#10;3. Inclusive student welfare fund"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saves directly to MongoDB</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#1769E8] hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Candidate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
