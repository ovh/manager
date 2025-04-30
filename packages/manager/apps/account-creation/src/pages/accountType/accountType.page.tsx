import { useTranslation } from 'react-i18next';
import { BaseLayout } from '@ovh-ux/manager-react-components';

export default function Onboarding() {
  const { t } = useTranslation('account-type');

  const header = {
    title: t('title'),
  };

  return (
    <>
      <BaseLayout header={header}></BaseLayout>
    </>
  );
}
