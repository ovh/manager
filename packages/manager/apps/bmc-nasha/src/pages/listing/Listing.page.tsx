import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/muk';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);

  return <BaseLayout header={{ title: t('listing:title') }}>App OK !</BaseLayout>;
}
