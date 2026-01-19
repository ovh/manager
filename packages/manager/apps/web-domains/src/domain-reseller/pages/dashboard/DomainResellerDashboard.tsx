import { BaseLayout } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';

export default function DomainResellerDashboard() {
  const { t } = useTranslation('domain-reseller');
  const header = {
    title: t('title'),
  };
  return <BaseLayout header={header}></BaseLayout>;
}
