import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import { FilterCategories } from '@/lib/filters';
import JobStatusBadge from './JobStatusBadge.component';

export const getFilters = () => {
  const { t: tRegions } = useTranslation('regions');
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
      options: ['BHS', 'DE', 'GRA', 'SBG', 'UK', 'WAW'].map((region) => ({
        label: tRegions(`region_${region}`),
        value: region,
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
