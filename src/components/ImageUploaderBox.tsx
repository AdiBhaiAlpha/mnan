import React, { useState, useRef } from 'react';
import { uploadImageToImgBB } from '../utils/imageUploader';
import { Upload, Image as ImageIcon, Loader2, Trash2, CheckCircle2, Link2, RefreshCw } from 'lucide-react';

interface ImageUploaderBoxProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: 'square' | 'banner';
  id?: string;
  placeholder?: string;
}

export const ImageUploaderBox: React.FC<ImageUploaderBoxProps> = ({
  label,
  value,
  onChange,
  aspect = 'square',
  id,
  placeholder = 'ছবি সিলেক্ট করুন'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে একটি ছবি ফাইল সিলেক্ট করুন (PNG, JPG, JPEG, WEBP ইত্যাদি)।');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const directUrl = await uploadImageToImgBB(file);
      onChange(directUrl);
      setIsUploading(false);
    } catch (err: any) {
      setError(err?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-blue-800 hover:underline flex items-center gap-1 font-semibold"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'ফাইল সিলেক্টর ব্যবহার করুন' : 'ম্যানুয়াল ইউআরএল'}</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={id ? `${id}-file` : undefined}
      />

      {showUrlInput ? (
        <div className="space-y-2">
          <input
            id={id}
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-blue-900 focus:outline-hidden"
          />
          {value && (
            <div className="flex items-center gap-2 pt-1">
              <img
                src={value}
                alt="Preview"
                className={`object-cover border border-slate-200 ${
                  aspect === 'square' ? 'w-12 h-12 rounded-lg' : 'w-full h-20 rounded-lg'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                }}
              />
              <span className="text-[10px] text-slate-500 truncate">{value}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Main Upload / Preview Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-700 bg-white rounded-xl p-3 text-center transition-all">
            {isUploading ? (
              <div className="py-4 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 text-blue-900 animate-spin" />
                <p className="text-xs font-bold text-blue-900">ছবি আপলোড হচ্ছে...</p>
                <p className="text-[10px] text-slate-400">চিত্রের লিঙ্ক তৈরি করা হচ্ছে</p>
              </div>
            ) : value ? (
              /* Preview State */
              <div className="space-y-3">
                <div className="relative group mx-auto flex items-center justify-center">
                  <img
                    src={value}
                    alt="Uploaded Preview"
                    className={`object-cover border border-slate-200 shadow-xs ${
                      aspect === 'square'
                        ? 'w-24 h-24 rounded-2xl mx-auto'
                        : 'w-full h-32 rounded-xl'
                    }`}
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ছবি যুক্ত হয়েছে</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>পরিবর্তন করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>মুছুন</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State: File Selection Button */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-4 cursor-pointer flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-900 flex items-center justify-center transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 underline block">
                    {placeholder}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ডিভাইস থেকে ছবি আপলোড করুন
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-[11px] font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
