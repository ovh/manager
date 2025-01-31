import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  SavingsPlanFlavorConsumption,
  SavingsPlanPeriodConsumption,
} from '@/types/savingsPlanConsumption.type';

type ConsumptionDatagridProps = {
  isLoading: boolean;
  consumption: SavingsPlanFlavorConsumption;
};

const CellText = ({ text }: { text: string }) => (
  <DataGridTextCell>{text}</DataGridTextCell>
);

const ConsumptionDatagrid = ({
  isLoading,
  consumption,
}: ConsumptionDatagridProps) => {
  const { t } = useTranslation('dashboard');
  const { pagination, setPagination } = useDataGrid();

  const columns = [
    {
      label: t('dashboard_columns_start'),
      id: 'begin',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={props.begin} />
      ),
    },
    {
      label: t('dashboard_columns_end'),
      id: 'end',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={props.end} />
      ),
    },
    {
      label: t('dashboard_columns_consumption_size'),
      id: 'consumption_size',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={props.consumption_size?.toString()} />
      ),
    },
    {
      label: t('dashboard_columns_cumul_plan_size'),
      id: 'cumul_plan_size',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={props.cumul_plan_size?.toString()} />
      ),
    },
  ];

  const items = consumption?.periods ?? [];
  return (
    <div>
      <OdsText preset="heading-4" className="my-8">
        {t('dashboard_table_title')}
      </OdsText>
      <Datagrid
        columns={columns}
        items={items}
        totalItems={items.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ConsumptionDatagrid;
