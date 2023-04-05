import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { Wrapper } from '@/components/layouts/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { ResourceList } from '@/components/resources/ResourceList';
import { Card } from '@/components/layouts/Card';

const Resources: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.resources')}>
      <Card>
        <ResourceList />
      </Card>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Resources;
