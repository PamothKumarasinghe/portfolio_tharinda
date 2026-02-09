'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string, publicId: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  currentImage,
  onImageUploaded,
  folder = 'portfolio',
  label = 'Upload Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onImageUploaded(data.url, data.publicId);
      setPreview(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm mb-2">{label}</label>
      
      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 bg-gray-700/50 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* File Input */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00b4d8] file:text-white hover:file:bg-[#0096c7] file:cursor-pointer disabled:opacity-50"
        />
        {uploading && (
          <span className="text-sm text-[#00b4d8]">Uploading...</span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-400">
        Supported formats: JPG, PNG, WebP, GIF. Max size: 5MB
      </p>
    </div>
  );
}
