import { JobForm } from '@/components/jobs/JobForm';
import { Card } from '@/components/layouts/Card';
import { Wrapper } from '@/components/layouts/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

const ResourceDetail: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.resources')}>
      <Card>
        <JobForm />
      </Card>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default ResourceDetail;
