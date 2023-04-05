import React from 'react';
import { useRouter } from 'next/router';
import type { Resources } from '@prisma/client';
import { Button } from '../inputs/Button';
import { useTranslations } from 'next-intl';
import { useResources } from '@/hooks/useResources';
import { trpc } from '@/utils/trpc';
import { toast } from 'react-hot-toast';

type TagProps = {
  children: React.ReactNode;
  className?: string;
};

const Tag = ({ children, className = '' }: TagProps) => (
  <div
    className={`flex justify-center rounded-full bg-green-200 px-2 py-1 text-sm font-bold text-green-600 ${className}`}
  >
    {children}
  </div>
);

export const ResourceList = ({}) => {
  const { data, isLoading, isError, refetch } = useResources();
  const deleteMutation = trpc.resources.destroy.useMutation();
  const router = useRouter();
  const t = useTranslations('resources');

  const onEdit = (resource: Resources) => {
    router.push(`/resources/${resource.id}`);
  };

  const onDelete = (resourceId: string) => {
    deleteMutation.mutate(resourceId, {
      onSuccess: () => {
        toast.success('Ressource supprimée');
        refetch();
      },
      onError: (err) => {
        console.log(err);
        toast.error('Une erreur est survenue');
      },
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Erreur lors de la récupération des données.</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/resources/new')}>Ajouter une ressource</Button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date de publication
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((resource, index) => (
            <tr key={resource.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resource.translations.length ? resource.translations[0]?.title : index}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resource.type === 'NEWS' ? (
                  <Tag>{t('news')}</Tag>
                ) : (
                  <Tag className="!bg-blue-200 !text-blue-600">{t('document')}</Tag>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resource.publishedAt.toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <Button onClick={() => onEdit(resource)}>Modifier</Button>
                <Button variant="red" className="ml-4" onClick={() => onDelete(resource.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
