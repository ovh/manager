import {
  Datagrid,
  DataGridTextCell,
  Title,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { savingsPlanConsumptionMocked } from '@/_mock_/savingsPlanConsumption';

const ConsumptionDatagrid = () => {
  const { t } = useTranslation('dashboard');
  const columns = [
    {
      label: t('dashboard_columns_start'),
      id: 'begin',
      cell: (props: any) => <DataGridTextCell>{props.begin}</DataGridTextCell>,
    },
    {
      label: t('dashboard_columns_end'),
      id: 'end',
      cell: (props: any) => <DataGridTextCell>{props.end}</DataGridTextCell>,
    },
    {
      label: t('dashboard_columns_consumption_size'),
      id: 'consumption_size',
      cell: (props: any) => (
        <DataGridTextCell>{props.consumption_size}</DataGridTextCell>
      ),
    },
    {
      label: t('dashboard_columns_cumul_plan_size'),
      id: 'cumul_plan_size',
      cell: (props: any) => (
        <DataGridTextCell>{props.cumul_plan_size}</DataGridTextCell>
      ),
    },
  ];

  const items = savingsPlanConsumptionMocked.flavors[0].periods;
  return (
    <div>
      <Title className="text-xl">{t('dashboard_table_title')}</Title>
      <Datagrid columns={columns} items={items} totalItems={items.length} />
    </div>
  );
};

export default ConsumptionDatagrid;
