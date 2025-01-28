import { Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { savingsPlanConsumptionMocked } from '@/_mock_/savingsPlanConsumption';

const ConsumptionDatagrid = ({
  isLoading,
}: Readonly<{ isLoading: boolean }>) => {
  const { t } = useTranslation('dashboard');
  const columns = [
    {
      label: t('dashboard_columns_start'),
      id: 'begin',
      cell: (props: any) =>
        isLoading ? (
          <OdsSkeleton />
        ) : (
          <DataGridTextCell>{props.begin}</DataGridTextCell>
        ),
    },
    {
      label: t('dashboard_columns_end'),
      id: 'end',
      cell: (props: any) =>
        isLoading ? (
          <OdsSkeleton />
        ) : (
          <DataGridTextCell>{props.end}</DataGridTextCell>
        ),
    },
    {
      label: t('dashboard_columns_consumption_size'),
      id: 'consumption_size',
      cell: (props: any) =>
        isLoading ? (
          <OdsSkeleton />
        ) : (
          <DataGridTextCell>{props.consumption_size}</DataGridTextCell>
        ),
    },
    {
      label: t('dashboard_columns_cumul_plan_size'),
      id: 'cumul_plan_size',
      cell: (props: any) =>
        isLoading ? (
          <OdsSkeleton />
        ) : (
          <DataGridTextCell>{props.cumul_plan_size}</DataGridTextCell>
        ),
    },
  ];

  const items = savingsPlanConsumptionMocked.flavors[0].periods;
  return (
    <div>
      <OdsText preset="heading-4" className="my-8">
        {t('dashboard_table_title')}
      </OdsText>
      <Datagrid columns={columns} items={items} totalItems={items.length} />
    </div>
  );
};

export default ConsumptionDatagrid;
