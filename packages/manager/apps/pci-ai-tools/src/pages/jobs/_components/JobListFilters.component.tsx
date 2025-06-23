import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ai from '@/types/AI';
import { FilterCategories } from '@/lib/filters';
import JobStatusBadge from './JobStatusBadge.component';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';

export const getFilters = () => {
  const { projectId } = useParams();
  const { t: tRegions } = useTranslation('regions');
  const regionQuery = useGetRegions(projectId);
  const { t } = useTranslation('ai-tools/jobs');
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
      options: Object.values(ai.job.JobStateEnum).map((state) => ({
        label: <JobStatusBadge status={state} />,
        value: state,
      })),
    },
  ];
};
