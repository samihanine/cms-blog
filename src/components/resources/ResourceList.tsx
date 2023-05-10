import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Resources } from '@prisma/client';
import { Button } from '../inputs/Button';
import { useTranslations } from 'next-intl';
import { useResources } from '@/hooks/useResources';
import { trpc } from '@/utils/trpc';
import { toast } from 'react-hot-toast';
import { createColumnHelper } from '@tanstack/react-table';
import { Table } from '../ui/Table';
import { Tag } from '../ui/Tag';

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

  useEffect(() => {
    if (isError) {
      toast.error('Une erreur est survenue');
    }
  }, [isError]);

  const columnHelper = createColumnHelper<(typeof data)[0]>();

  const columns = [
    columnHelper.accessor('id', {
      header: () => <span>Nom</span>,
      cell: ({ row }) => {
        const resource = row.original;
        return (
          <span className="flex max-w-[20vw] overflow-hidden text-ellipsis lg:max-w-[200px]">
            {resource.translations.length ? resource.translations[0]?.title : ''}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <span>Type</span>,
      cell: ({ row }) => {
        const resource = row.original;
        return (
          <>
            {resource.type === 'NEWS' ? (
              <Tag className="!bg-yellow-200 !text-yellow-600">{t('news')}</Tag>
            ) : (
              <Tag className="!bg-blue-200 !text-blue-600">{t('document')}</Tag>
            )}
          </>
        );
      },
    }),
    columnHelper.accessor('isVisible', {
      header: () => <span>état</span>,
      cell: ({ row }) => {
        const isVisible = row.original.isVisible;
        return (
          <Tag className={`${isVisible ? '!bg-green-200 !text-green-600' : '!bg-red-200 !text-red-600'}`}>
            {isVisible ? 'Visible' : 'Masqué'}
          </Tag>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <span>Actions</span>,
      cell: ({ row }) => {
        const resource = row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => onEdit(resource)}>Modifier</Button>
            <Button onClick={() => onDelete(resource.id)} variant="red">
              Supprimer
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/resources/new')}>Ajouter une ressource</Button>
      </div>

      <Table loading={isLoading} data={data} columns={columns} />
    </div>
  );
};
