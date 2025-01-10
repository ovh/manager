import { useTranslation } from 'react-i18next';
import * as ai from '@/types/cloud/project/ai';
import { FilterCategories } from '@/lib/filters';
import NotebookStatusBadge from './NotebookStatusBadge.component';

export const getFilters = () => {
  const { t: tRegions } = useTranslation('regions');
  return [
    {
      id: 'spec.name',
      label: 'Nom',
      comparators: FilterCategories.String,
    },
    {
      id: 'id',
      label: 'ID',
      comparators: FilterCategories.String,
    },
    {
      id: 'spec.region',
      label: 'Region',
      comparators: FilterCategories.Options,
      options: ['BHS', 'DE', 'GRA', 'SBG', 'UK', 'WAW'].map((region) => ({
        label: tRegions(`region_${region}`),
        value: region,
      })),
    },
    {
      id: 'spec.env.frameworkId',
      label: 'Framework',
      comparators: FilterCategories.String,
    },
    {
      id: 'spec.env.editorId',
      label: 'Editor',
      comparators: FilterCategories.String,
    },
    {
      id: 'status.state',
      label: 'Statut',
      comparators: FilterCategories.Options,
      options: Object.values(ai.notebook.NotebookStateEnum).map((state) => ({
        label: <NotebookStatusBadge status={state} />,
        state,
      })),
    },
  ];
};
