import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  Datagrid,
  DataGridTextCell,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SavingsPlanFlavorConsumption,
  SavingsPlanPeriodConsumption,
} from '@/types/savingsPlanConsumption.type';
import { toLocalDateUTC } from '@/utils/formatter/date';
import { paginateResults } from '@/utils/paginate/utils';
import { useProjectId } from '@/hooks/useProject';
import ConsumptionResourceList from './ConsumptionResourceList';

type ConsumptionDatagridProps = {
  isLoading: boolean;
  consumption: SavingsPlanFlavorConsumption;
  isInstanceFlavor: boolean;
};

const CellText = ({ text }: { text: string }) => (
  <DataGridTextCell>{text}</DataGridTextCell>
);

const ConsumptionDatagrid = ({
  isLoading,
  consumption,
  isInstanceFlavor,
}: ConsumptionDatagridProps) => {
  const { pagination, setPagination } = useDataGrid();
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { t } = useTranslation(['dashboard', 'listing']);
  const { trackClick } = useOvhTracking();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const navigate = useNavigate();
  const projectId = useProjectId();
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
      id: 'consumptionSize',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={props.consumptionSize?.toString()} />
      ),
    },
    {
      label: t('dashboard_columns_cumul_plan_size'),
      id: 'cumulPlanSize',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <CellText text={props.cumulPlanSize?.toString()} />
      ),
    },
    {
      label: '',
      id: 'action',
      cell: (props: SavingsPlanPeriodConsumption) => (
        <ActionMenu
          popover-position="bottom-end"
          id={props.begin + props.end}
          items={[
            {
              id: 1,
              label: t('dashboard_resource_list_view_resources'),
              onClick: () => {
                setSelectedResources(props.resourceIds);
                setDrawerOpen(true);
              },
            },
          ]}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
        />
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
    if (pagination.pageIndex !== 0) {
      setPagination({
        pageIndex: 0,
        pageSize: 10,
      });
    }
  }, [items]);

  const handleCloseDrawer = () => {
    setSelectedResources([]);
    setDrawerOpen(false);
  };

  return (
    <div>
      <ConsumptionResourceList
        isInstanceFlavor={isInstanceFlavor}
        isDrawerOpen={isDrawerOpen}
        resources={selectedResources}
        handleCloseDrawer={handleCloseDrawer}
      />
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
