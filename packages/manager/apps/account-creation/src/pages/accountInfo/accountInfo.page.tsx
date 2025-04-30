import { useTranslation } from 'react-i18next';
import { BaseLayout } from '@ovh-ux/manager-react-components';

export default function DashboardPage() {
  const { t } = useTranslation('account-info');

  const header = {
    title: t('title'),
  };

  return <BaseLayout header={header}></BaseLayout>;
}
