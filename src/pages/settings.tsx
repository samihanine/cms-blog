import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { Support } from '@/components/settings/Support';
import { Wrapper } from '@/components/layouts/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { Account } from '@/components/settings/Account';

const Settings: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.settings')}>
      <div className="space-y-6">
        <Account />
        <Support />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Settings;
