import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { Wrapper } from '@/components/layouts/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { Card } from '@/components/layouts/Card';
import { ResourceStats } from '@/components/dashboard/ResourceStats';
import Link from 'next/link';
import { Button } from '@/components/inputs/Button';

const Dashboard: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.dashboard')}>
      <Card>
        <ResourceStats />
      </Card>
      <Card className="mt-10">
        <div className="flex w-full justify-center">
          <Link href="/resources">
            <Button>Voir la liste des ressources</Button>
          </Link>
        </div>
      </Card>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Dashboard;
