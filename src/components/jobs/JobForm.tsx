import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { JobsLocation } from '@prisma/client';
import { HtmlEditor } from '@/components/inputs/HtmlEditor';
import { InputSelect } from '@/components/inputs/InputSelect';
import { InputText } from '@/components/inputs/InputText';
import { Button } from '@/components/inputs/Button';
import toast from 'react-hot-toast';
import { trpc } from '@/utils/trpc';
import Switch from '../inputs/Switch';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { useJobs } from '@/hooks/useJobs';

export const JobForm: React.FC = () => {
  const { refetch } = useJobs();
  const router = useRouter();
  const id = (router.query.job || 'new') as string;
  const isNew = id === 'new';

  const [place, setPlace] = useState<string>();
  const [link, setLink] = useState<string>();
  const [salary, setSalary] = useState<string>();
  const [location, setLocation] = useState<JobsLocation>('ON_SITE');
  const [translations, setTranslations] = useState([
    { language: 'FR', title: '', content: '', type: '', duration: '' },
    { language: 'EN', title: '', content: '', type: '', duration: '' },
  ]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { data, isLoading } = trpc.jobs.getOne.useQuery(id, {
    refetchOnWindowFocus: false,
  });

  const createMutation = trpc.jobs.create.useMutation();
  const updateMutation = trpc.jobs.update.useMutation();

  useEffect(() => {
    console.log(data);
    if (data) {
      setPlace(data.place || '');
      setLink(data.link || '');
      setSalary(data.salary || '');
      setLocation(data.location || 'ON_SITE');
      setIsVisible(data.isVisible);
      setTranslations(data.translations || []);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      id: data?.id,
      place: place || '',
      link: link || '',
      salary: salary || '',
      translations: translations,
      location: location,
      isVisible,
    };

    if (isNew) {
      createMutation.mutate(payload, {
        onSuccess: (result) => {
          toast.success("Offre d'emploi sauvegardée");
          router.push(`/jobs/${result.id}`);
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
          toast.success("Offre d'emploi sauvegardée");
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
        <Button type="button" onClick={() => router.push('/jobs/')} className="!bg-gray-400">
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
          value={location}
          onChange={(e) => setLocation(e.target.value as JobsLocation)}
          id="location"
          label="lieu de travail"
          name="location"
        >
          <option value="REMOTE">A distance</option>
          <option value="HYBRID">Hybride</option>
          <option value="ON_SITE">Sur place</option>
        </InputSelect>

        <Switch id="visible" checked={isVisible} onChange={(bool) => setIsVisible(bool)} label="Visible à tous" />

        <InputText
          label="Lien"
          id="link"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://"
        />

        <InputText
          label="Endroit"
          id="place"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Montréal, QC"
        />

        <InputText
          label="Salaire"
          id="salary"
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="30$/h"
        />

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
              <label htmlFor={`content-${t.language}`} className="block">
                Description
              </label>
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
                label={'Type de contrat'}
                id={`type-${t.language}`}
                type="text"
                value={t.type}
                onChange={(e) =>
                  setTranslations((prev) => {
                    const updated = [...prev];
                    if (!updated[idx]) updated[idx] = {};
                    updated[idx].type = e.target.value;
                    return updated;
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <InputText
                label={'Durée de contrat'}
                id={`type-${t.language}`}
                type="text"
                value={t.duration}
                onChange={(e) =>
                  setTranslations((prev) => {
                    const updated = [...prev];
                    if (!updated[idx]) updated[idx] = {};
                    updated[idx].duration = e.target.value;
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
