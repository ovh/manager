import React from 'react';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { getManagedCmsService } from '@/data/api/wordpressManaged';

export default function WordpressManagedPage(): JSX.Element {
  // const data = getManagedCmsService();
  const { t } = useTranslation('common');
  return <BaseLayout header={{ title: t('common:wordpress_managed') }} />;
}
