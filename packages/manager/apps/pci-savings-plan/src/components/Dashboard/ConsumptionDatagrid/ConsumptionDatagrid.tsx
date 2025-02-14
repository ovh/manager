import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SavingsPlanFlavorConsumption,
  SavingsPlanPeriodConsumption,
} from '@/types/savingsPlanConsumption.type';
import { toLocalDateUTC } from '@/utils/formatter/date';
import { paginateResults } from '@/utils/paginate/utils';

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
  const { pagination, setPagination } = useDataGrid();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { t } = useTranslation(['dashboard', 'listing']);
  const { trackClick } = useOvhTracking();

  const navigate = useNavigate();
  const { projectId } = useParams();
  const { clearNotifications } = useNotifications();
  const columns = [
    {
      label: t('dashboard_columns_start'),
      id: 'begin',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={toLocalDateUTC(props.begin, locale)} />
      ),
    },
    {
      label: t('dashboard_columns_end'),
      id: 'end',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={toLocalDateUTC(props.end, locale)} />
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

  const handleClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: ['add_savings_plan'],
    });
    clearNotifications();
    navigate(`/pci/projects/${projectId}/savings-plan/new`);
  };

  const items = consumption?.periods ?? [];

  const paginatedItems = useMemo(() => paginateResults(items, pagination), [
    items,
    pagination,
  ]);

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  }, [items]);

  return (
    <div>
      <OdsText preset="heading-4" className="mt-8">
        {t('dashboard_table_title')}
      </OdsText>
      <div className="py-5">
        <OdsButton
          icon="plus"
          size="sm"
          variant={'outline'}
          onClick={handleClick}
          label={t('listing:createSavingsPlan')}
        />
      </div>
      <Datagrid
        columns={columns}
        items={paginatedItems.rows}
        totalItems={paginatedItems.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ConsumptionDatagrid;
