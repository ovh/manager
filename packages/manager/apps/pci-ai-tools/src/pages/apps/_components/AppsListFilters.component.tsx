import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import { FilterCategories } from '@/lib/filters';
import AppStatusBadge from './AppStatusBadge.component';

export const getFilters = () => {
  const { t: tRegions } = useTranslation('regions');
  const { t } = useTranslation('ai-tools/apps');
  return [
    {
      id: 'spec.name',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
    {
      id: 'id',
      label: 'ID',
      comparators: FilterCategories.String,
    },
    {
      id: 'spec.region',
      label: t('tableHeaderLocation'),
      comparators: FilterCategories.Options,
      options: ['BHS', 'DE', 'GRA', 'SBG', 'UK', 'WAW'].map((region) => ({
        label: tRegions(`region_${region}`),
        value: region,
      })),
    },
    {
      id: 'status.state',
      label: t('tableHeaderStatus'),
      comparators: FilterCategories.Options,
      options: Object.values(ai.app.AppStateEnum).map((state) => ({
        label: <AppStatusBadge status={state} />,
        value: state,
      })),
    },
  ];
};
