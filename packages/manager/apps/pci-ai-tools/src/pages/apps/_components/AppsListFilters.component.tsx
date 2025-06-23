import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ai from '@/types/AI';
import { FilterCategories } from '@/lib/filters';
import AppStatusBadge from './AppStatusBadge.component';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';

export const getFilters = () => {
  const { projectId } = useParams();
  const { t: tRegions } = useTranslation('regions');
  const regionQuery = useGetRegions(projectId);
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
      options: regionQuery?.data?.map((region) => ({
        label: tRegions(`region_${region.id}`),
        value: region.id,
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
