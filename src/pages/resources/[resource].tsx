import { Card } from '@/components/layouts/Card';
import { Wrapper } from '@/components/layouts/Wrapper';
import { ResourceForm } from '@/components/resources/ResourceForm';
import { getLocaleProps } from '@/utils/locales';
import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

const ResourceDetail: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.resources')}>
      <Card>
        <ResourceForm />
      </Card>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default ResourceDetail;
