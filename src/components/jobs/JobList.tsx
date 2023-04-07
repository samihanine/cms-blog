import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Jobs } from '@prisma/client';
import { Button } from '../inputs/Button';
import { trpc } from '@/utils/trpc';
import { toast } from 'react-hot-toast';
import { createColumnHelper } from '@tanstack/react-table';
import { Table } from '../ui/Table';
import { useJobs } from '@/hooks/useJobs';
import { Tag } from '../ui/Tag';

export const JobList = ({}) => {
  const { data, isLoading, isError, refetch } = useJobs();
  const deleteMutation = trpc.jobs.destroy.useMutation();
  const router = useRouter();

  const onEdit = (item: Jobs) => {
    router.push(`/jobs/${item.id}`);
  };

  const onDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Element supprimée');
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
      header: () => <span>Titre</span>,
      cell: ({ row }) => {
        const job = row.original;
        return job.translations.length ? job.translations[0]?.title : '';
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
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => onEdit(item)}>Modifier</Button>
            <Button onClick={() => onDelete(item.id)} variant="red">
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
        <Button onClick={() => router.push('/jobs/new')}>Ajouter une offre d'emploi</Button>
      </div>

      <Table loading={isLoading} data={data} columns={columns} />
    </div>
  );
};
