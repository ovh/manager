import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { FilterCategories } from '@/lib/filters';
import ServiceStatusBadge from './ServiceStatusBadge.component';

export const getFilters = () => {
  const { t: tRegions } = useTranslation('regions');
  return [
    {
      id: 'description',
      label: 'Nom',
      comparators: FilterCategories.String,
    },
    {
      id: 'id',
      label: 'ID',
      comparators: FilterCategories.String,
    },
    {
      id: 'engine',
      label: 'Engine',
      comparators: FilterCategories.Options,
      options: Object.values(database.EngineEnum).map((value) => ({
        label: humanizeEngine(value),
        value,
      })),
    },
    {
      id: 'plan',
      label: 'Plan',
      comparators: FilterCategories.Options,
      options: [
        'Discovery',
        'Production',
        'Advanced',
        'Essential',
        'Business',
        'Enterprise',
      ].map((plan) => ({ label: plan, value: plan })),
    },
    {
      id: 'nodes[0].region',
      label: 'Region',
      comparators: FilterCategories.Options,
      options: ['BHS', 'DE', 'GRA', 'SBG', 'UK', 'WAW'].map((region) => ({
        label: tRegions(`region_${region}`),
        value: region,
      })),
    },
    {
      id: 'flavor',
      label: 'Flavor',
      comparators: FilterCategories.Options,
      options: [
        'db2-free',
        'db2-2',
        'db2-4',
        'db2-7',
        'db2-15',
        'db2-30',
        'db2-60',
        'db2-120',
        'db1-4',
        'db1-7',
        'db1-15',
        'db1-30',
        'db1-60',
        'db1-120',
      ].map((flavor) => ({
        label: <span className="capitalize">{flavor}</span>,
        value: flavor,
      })),
    },
    {
      id: 'createdAt',
      label: 'Date de création',
      comparators: FilterCategories.Date,
    },
    {
      id: 'status',
      label: 'Statut',
      comparators: FilterCategories.Options,
      options: Object.values(database.StatusEnum).map((value) => ({
        label: <ServiceStatusBadge status={value} />,
        value,
      })),
    },
  ];
};
