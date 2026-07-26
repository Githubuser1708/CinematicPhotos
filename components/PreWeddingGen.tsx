import React, { useState } from 'react';
import { generatePreWeddingPhoto } from '../services/geminiService';
import { fileToBase64, getMimeType } from '../utils/fileUtils';
import { VIBES } from '../constants';
import { Camera, Sparkles, Plus, X, Loader2, Download, User } from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}

const PreWeddingGen: React.FC = () => {
  const [modelPhotos, setModelPhotos] = useState<UploadedFile[]>([]);
  const [dressPhoto, setDressPhoto] = useState<UploadedFile | null>(null);
  const [selectedVibeId, setSelectedVibeId] = useState<string>('');
  const [customDescription, setCustomDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, 3 - modelPhotos.length) as File[];
      const newPhotos: UploadedFile[] = [];
      
      for (const file of files) {
         const base64 = await fileToBase64(file);
         newPhotos.push({
           file,
           preview: URL.createObjectURL(file),
           base64,
           mimeType: getMimeType(file)
         });
      }
      setModelPhotos([...modelPhotos, ...newPhotos]);
    }
  };

  const handleDressUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      setDressPhoto({
        file,
        preview: URL.createObjectURL(file),
        base64,
        mimeType: getMimeType(file)
      });
    }
  };

  const removeModelPhoto = (index: number) => {
    const newPhotos = [...modelPhotos];
    newPhotos.splice(index, 1);
    setModelPhotos(newPhotos);
  };

  const handleGenerate = async () => {
    if (modelPhotos.length === 0) return;
    
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Collect references
      const references = modelPhotos.map(p => ({ base64: p.base64, mimeType: p.mimeType }));
      if (dressPhoto) {
        references.push({ base64: dressPhoto.base64, mimeType: dressPhoto.mimeType });
      }

      // Determine style
      const selectedVibe = VIBES.find(v => v.id === selectedVibeId);
      const styleDesc = selectedVibe 
        ? `${selectedVibe.title}. ${selectedVibe.description}` 
        : customDescription || "Professional cinematic model portrait";

      const finalPrompt = customDescription 
        ? `${customDescription} (Vibe: ${selectedVibe?.title || 'Custom'})` 
        : styleDesc;

      const result = await generatePreWeddingPhoto(references, finalPrompt, dressPhoto ? "Include the style of the uploaded outfit reference." : undefined);
      setGeneratedImage(result);

    } catch (error) {
      console.error(error);
      alert("Failed to generate photo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="text-center mb-10 space-y-3">
        <h2 className="text-4xl md:text-5xl font-serif font-extrabold tracking-wide bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">Cinematic PhotoCreation</h2>
        <p className="text-stone-400 max-w-2xl mx-auto">Upload photos and let us transform into cinematic masterpieces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Model Upload */}
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl">
            <h3 className="text-lg font-medium text-amber-200 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" />
              Model Photo (Max 3)
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {modelPhotos.map((photo, index) => (
                <div key={index} className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden group border border-stone-700">
                  <img src={photo.preview} className="w-full h-full object-cover" alt="model" />
                  <button 
                    onClick={() => removeModelPhoto(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-amber-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {modelPhotos.length < 3 && (
                <label className="shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-stone-700 hover:border-amber-500 hover:bg-stone-800/50 flex flex-col items-center justify-center cursor-pointer transition-all">
                  <Plus className="w-6 h-6 text-stone-500" />
                  <span className="text-[10px] text-stone-400 mt-1">Add Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleModelUpload} />
                </label>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-2">Clear, front-facing model photos work best.</p>
          </div>

          {/* Outfit Reference (Optional) */}
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl">
            <h3 className="text-lg font-medium text-stone-200 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-500/80" />
              Outfit Reference (Optional)
            </h3>
            {dressPhoto ? (
               <div className="relative w-full h-32 rounded-lg overflow-hidden border border-stone-700 group">
                 <img src={dressPhoto.preview} className="w-full h-full object-cover" alt="outfit" />
                 <button 
                    onClick={() => setDressPhoto(null)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-amber-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
               </div>
            ) : (
              <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-stone-700 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-stone-800/50 transition-all">
                <span className="text-sm text-stone-400">Click to upload outfit/attire reference photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleDressUpload} />
              </label>
            )}
          </div>

          {/* Vibe Selection */}
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl">
            <h3 className="text-lg font-medium text-stone-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Select Vibe
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {VIBES.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibeId(vibe.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedVibeId === vibe.id
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-medium'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-300'
                  }`}
                >
                  <div className="font-medium text-xs md:text-sm">{vibe.title}</div>
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Custom Details / Adjustments</label>
              <textarea 
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="E.g. 'Golden hour warm sunlight', 'Studio backlight', 'Dramatic cinematic shadow'..."
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-sm text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
                rows={3}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={modelPhotos.length === 0 || isGenerating}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold py-4 px-6 rounded-xl shadow-lg shadow-amber-950/40 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-[1.01] flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-stone-950" />
                Generating Photos...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-stone-950" />
                Generate Model Photo
              </>
            )}
          </button>

        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7">
          <div className="h-full bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl p-2 md:p-6 flex flex-col min-h-[500px]">
            <div className="flex-1 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-center overflow-hidden relative">
              {isGenerating ? (
                 <div className="text-center space-y-6 max-w-sm px-4">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-serif text-stone-200">Creating model portrait</h3>
                       <p className="text-stone-400 text-sm">Gemini is analyzing facial details, setting lighting, and rendering the scene...</p>
                    </div>
                 </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full group flex items-center justify-center">
                   <img src={generatedImage} alt="Generated Model Photo" className="w-full h-full object-contain" />
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                      <a 
                        href={generatedImage} 
                        download="photo-creation.png"
                        className="bg-amber-500 text-stone-950 font-semibold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg"
                      >
                        <Download className="w-4 h-4" />
                        Download High Res
                      </a>
                   </div>
                </div>
              ) : (
                <div className="text-center space-y-4 px-6 opacity-50">
                   <div className="w-24 h-24 bg-stone-900 rounded-full mx-auto flex items-center justify-center border border-stone-800">
                      <Camera className="w-10 h-10 text-stone-500" />
                   </div>
                   <p className="text-lg font-serif text-stone-300">Your generated model photos will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreWeddingGen;