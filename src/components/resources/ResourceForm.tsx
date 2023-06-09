import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { ResourcesTranslations, ResourcesType } from '@prisma/client';
import { HtmlEditor } from '@/components/inputs/HtmlEditor';
import { InputSelect } from '@/components/inputs/InputSelect';
import { InputText } from '@/components/inputs/InputText';
import Image from 'next/image';
import { Button } from '@/components/inputs/Button';
import toast from 'react-hot-toast';
import { trpc } from '@/utils/trpc';
import Switch from '../inputs/Switch';
import { useResources } from '@/hooks/useResources';
import { ImageUploader } from '@/components/inputs/ImageUploader';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { Label } from '../inputs/Label';

export const ResourceForm: React.FC = () => {
  const { refetch } = useResources();
  const router = useRouter();
  const resourceId = (router.query.resource || 'new') as string;
  const isNew = resourceId === 'new';

  const [imageUrl, setImageUrl] = useState<string>();
  const [type, setType] = useState<ResourcesType>('NEWS');
  const [translations, setTranslations] = useState<Omit<ResourcesTranslations, 'resourceId' | 'id'>[]>([
    { language: 'FR', title: '', content: '', keywords: '' },
    { language: 'EN', title: '', content: '', keywords: '' },
  ]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { data, isLoading } = trpc.resources.getOne.useQuery(resourceId, {
    refetchOnWindowFocus: false,
  });

  const createMutation = trpc.resources.create.useMutation();
  const updateMutation = trpc.resources.update.useMutation();

  useEffect(() => {
    if (data) {
      setImageUrl(data.imageUrl || '');
      setTranslations(data.translations || []);
      setType(data.type || 'NEWS');
      setIsVisible(data.isVisible);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      id: data?.id,
      imageUrl: imageUrl || '',
      translations: translations,
      type,
      isVisible,
    };

    if (isNew) {
      createMutation.mutate(payload, {
        onSuccess: (result) => {
          toast.success('Ressources sauvegardée');
          router.push(`/resources/${result.id}`);
          refetch();
        },
        onError: (err) => {
          console.log(err);
          toast.error('Une erreur est survenue');
        },
      });
    } else {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Ressources sauvegardée');
          refetch();
        },
        onError: (err) => {
          console.log(err);
          toast.error('Une erreur est survenue');
        },
      });
    }
  };

  if (isLoading) return <LoadingSpinner className="h-10 w-10 animate-spin text-gray-500" />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-10 flex items-center justify-between gap-5">
        <Button type="button" onClick={() => router.push('/resources/')} className="!bg-gray-400">
          Retour
        </Button>

        <div className="flex gap-5">
          <Button loading={createMutation.isLoading || updateMutation.isLoading} className="self-center" type="submit">
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-7">
        <InputSelect
          value={type}
          onChange={(e) => setType(e.target.value as ResourcesType)}
          id="type"
          label="Type"
          name="type"
        >
          <option value="NEWS">Nouvelle</option>
          <option value="DOCUMENT">Document</option>
        </InputSelect>

        <Switch id="visible" checked={isVisible} onChange={(bool) => setIsVisible(bool)} label="Afficher / Masquer" />

        <ImageUploader setUrl={setImageUrl} url={imageUrl} />

        {imageUrl && <Image src={imageUrl} width={200} height={200} alt="" />}

        {translations.map((t, idx) => (
          <div key={t.language} className="space-y-4">
            {idx >= 0 && <div className="my-2 h-[2px] w-full bg-gray-300" />}
            <h2 className="text-lg font-bold">Traduction {t.language}</h2>

            <div className="space-y-2">
              <InputText
                label="Title"
                id={`title-${t.language}`}
                type="text"
                value={t.title}
                onChange={(e) =>
                  setTranslations((prev) => {
                    const updated = [...prev];
                    if (!updated[idx]) updated[idx] = {};
                    updated[idx].title = e.target.value;
                    return updated;
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label label={"Contenu (texte et images de l'article)"} id={`content-${t.language}`} />
              <HtmlEditor
                id={`content-${t.language}`}
                value={t.content}
                setValue={(text) =>
                  setTranslations((prev) => {
                    const updated = [...prev];
                    if (!updated[idx]) updated[idx] = {};
                    updated[idx].content = text;
                    return updated;
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <InputText
                label={'Mots clés (séparés par des virgules)'}
                id={`keywords-${t.language}`}
                type="text"
                value={t.keywords}
                placeholder="bio énergie ferme"
                onChange={(e) =>
                  setTranslations((prev) => {
                    const updated = [...prev];
                    if (!updated[idx]) updated[idx] = {};
                    updated[idx].keywords = e.target.value;
                    return updated;
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
