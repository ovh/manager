import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { HeadersProps } from '@ovh-ux/manager-react-components';

export function useDashboardHeader(): HeadersProps {
  const { t } = useTranslation(['dashboard']);
  const { id } = useParams();

  return {
    title: t('dashboardPageTitle', { id }),
  };
}
