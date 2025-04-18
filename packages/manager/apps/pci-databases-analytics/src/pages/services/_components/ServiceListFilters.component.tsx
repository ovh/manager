import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { humanizeEngine } from '@/lib/engineNameHelper';
import { FilterCategories } from '@/lib/filters';
import ServiceStatusBadge from './ServiceStatusBadge.component';
import {
  FLAVORS_OPTIONS,
  PLANS_OPTIONS,
  REGIONS_OPTIONS,
} from './ServiceListFilters.constants';

export const getFilters = () => {
  const { t } = useTranslation('pci-databases-analytics/services');
  const { t: tRegions } = useTranslation('regions');
  return [
    {
      id: 'description',
      label: t('tableHeaderName'),
      comparators: FilterCategories.String,
    },
    {
      id: 'id',
      label: 'ID',
      comparators: FilterCategories.String,
    },
    {
      id: 'engine',
      label: t('tableHeaderEngine'),
      comparators: FilterCategories.Options,
      options: Object.values(database.EngineEnum).map((value) => ({
        label: humanizeEngine(value),
        value,
      })),
    },
    {
      id: 'plan',
      label: t('tableHeaderPlan'),
      comparators: FilterCategories.Options,
      options: PLANS_OPTIONS.map((plan) => ({ label: plan, value: plan })),
    },
    {
      id: 'nodes[0].region',
      label: t('tableHeaderLocation'),
      comparators: FilterCategories.Options,
      options: REGIONS_OPTIONS.map((region) => ({
        label: tRegions(`region_${region}`),
        value: region,
      })),
    },
    {
      id: 'flavor',
      label: t('tableHeaderFlavor'),
      comparators: FilterCategories.Options,
      options: FLAVORS_OPTIONS.map((flavor) => ({
        label: <span className="capitalize">{flavor}</span>,
        value: flavor,
      })),
    },
    {
      id: 'createdAt',
      label: t('tableHeaderCreationDate'),
      comparators: FilterCategories.Date,
    },
    {
      id: 'status',
      label: t('tableHeaderStatus'),
      comparators: FilterCategories.Options,
      options: Object.values(database.StatusEnum).map((value) => ({
        label: <ServiceStatusBadge status={value} />,
        value,
      })),
    },
  ];
};
