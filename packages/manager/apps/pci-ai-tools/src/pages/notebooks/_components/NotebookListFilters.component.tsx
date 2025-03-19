import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import { FilterCategories } from '@/lib/filters';
import NotebookStatusBadge from './NotebookStatusBadge.component';

export const getFilters = () => {
  const { t: tRegions } = useTranslation('regions');
  const { t } = useTranslation('ai-tools/notebooks');
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
      id: 'spec.env.frameworkId',
      label: t('tableHeaderFramework'),
      comparators: FilterCategories.String,
    },
    {
      id: 'spec.env.editorId',
      label: t('tableHeaderEditor'),
      comparators: FilterCategories.String,
    },
    {
      id: 'status.state',
      label: t('tableHeaderStatus'),
      comparators: FilterCategories.Options,
      options: Object.values(ai.notebook.NotebookStateEnum).map((state) => ({
        label: <NotebookStatusBadge status={state} />,
        value: state,
      })),
    },
  ];
};
