import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { useRegion } from '@/data/hooks/useRegion';
import { ApiRegion } from '@/types/Region.type';

type RegionDisplayParams = {
  id: string;
  displayKey: keyof ApiRegion;
};

export const RegionDisplay = ({ id, displayKey = 'name' }: RegionDisplayParams) => {
  const { t } = useTranslation('common');
  const { data, status } = useRegion(id);
  const isError = status === 'error' || !data;

  if (status === 'pending') return <OdsSkeleton />;

  if (isError) return <OdsText>{t('common:na', 'N/A')}</OdsText>;

  return <OdsText>{data[displayKey]}</OdsText>;
};
