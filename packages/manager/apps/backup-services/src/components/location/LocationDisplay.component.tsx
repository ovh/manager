import { useTranslation } from 'react-i18next';

import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { useLocationDetails } from '@/data/hooks/useLocationDetails';
import { TLocation } from '@/types/Location.type';

type LocationDisplayParams = {
  id: string;
  displayKey: keyof TLocation;
};

export const LocationDisplay = ({ id, displayKey = 'name' }: LocationDisplayParams) => {
  const { t } = useTranslation('common');
  const { data, status } = useLocationDetails(id);
  const isError = status === 'error' || !data;

  if (status === 'pending') return <OdsSkeleton />;

  if (isError) return <OdsText>{t('common:na', 'N/A')}</OdsText>;

  return <OdsText>{data[displayKey]}</OdsText>;
};
