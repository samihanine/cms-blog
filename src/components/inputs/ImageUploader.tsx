// components/ImageUploader.tsx
import React, { type ChangeEvent, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';
import { Label } from './Label';
import { Button } from './Button';
import { toast } from 'react-hot-toast';

type ImageUploaderProps = {
  url?: string;
  setUrl: (url: string) => void;
};

export const ImageUploader = ({ setUrl }: ImageUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { supabaseClient } = useSessionContext();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!(fileList && fileList.length > 0)) return;
    const file = fileList[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 4) {
      toast.error('Le fichier est trop lourd (4Mo max)');
      return;
    }

    try {
      const fileName = encodeURIComponent(file.name);
      const filename = `${uuidv4()}-${fileName}`;

      const { data, error } = await supabaseClient.storage.from('images').upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        throw error;
      }

      const url = 'https://gkqwaqtqljdwkbntswzy.supabase.co/storage/v1/object/public/images/' + data.path;
      console.log(url);
      setUrl(url);
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label label="Image de couverture (en haut de l'article)" id="file" />
      <input type="file" id="file" name="file" accept="image/*" onChange={handleFileChange} />
      {file && (
        <Button onClick={handleSubmit} type="button">
          Uploader le fichier
        </Button>
      )}
    </div>
  );
};
