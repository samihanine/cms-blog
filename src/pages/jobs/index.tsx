import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { Wrapper } from '@/components/layouts/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { Card } from '@/components/layouts/Card';
import { JobList } from '@/components/jobs/JobList';

const Jobs: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.jobs')}>
      <Card>
        <JobList />
      </Card>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Jobs;
