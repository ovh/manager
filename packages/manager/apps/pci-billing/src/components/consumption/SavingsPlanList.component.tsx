import { OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Currency } from '@ovh-ux/manager-config';
import { TFunction } from 'i18next';
import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { useContext, useMemo } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TSavingsPlan } from '@/api/hook/useConsumption';
import { paginateResults } from '@/api/data/consumption';
import { useSavingsPlanDetails } from '@/hooks/useSavingsPlanDetails';
import { useServiceId } from '@/hooks/useServiceId';

const getColumns = ({
  t,
  currency,
}: {
  currency: Currency;
  t: TFunction;
}): {
  id: keyof (TSavingsPlan & { displayName: string });
  label: string;
  cell: (row: TSavingsPlan & { displayName: string }) => JSX.Element;
}[] => [
  {
    id: 'id',
    cell: (row) => (
      <DataGridTextCell>{row?.displayName || row?.id}</DataGridTextCell>
    ),
    label: t('cpbc_savings_plan_col_name'),
  },
  {
    id: 'size',
    cell: (row) => <DataGridTextCell>{row.size}</DataGridTextCell>,
    label: t('cpbc_savings_plan_col_size'),
  },
  {
    id: 'flavor',
    cell: (row) => <DataGridTextCell>{row.flavor}</DataGridTextCell>,
    label: t('cpbc_savings_plan_col_flavor'),
  },
  {
    id: 'totalPrice',
    cell: (row) => (
      <DataGridTextCell>{`${(row.totalPrice || 0).toFixed(2)} ${
        currency.symbol
      }`}</DataGridTextCell>
    ),
    label: t('cpbc_savings_plan_col_price'),
  },
];

const SavingsPlanList = ({
  monthlySavingsPlanList,
}: {
  monthlySavingsPlanList: TSavingsPlan[];
}) => {
  const { pagination, setPagination } = useDataGrid();

  const { t } = useTranslation('consumption/monthly-instance');
  const { currency } = useContext(ShellContext).environment.getUser();
  const { projectId } = useParams<{ projectId: string }>();
  const { data: serviceId } = useServiceId(projectId || '');
  const { enrichedSavingsPlans, isLoading } = useSavingsPlanDetails(
    serviceId?.toString() || '',
    monthlySavingsPlanList,
  );

  const columns = useMemo(() => getColumns({ t, currency }), [t, currency]);

  const paginatedData = useMemo(
    () => paginateResults(enrichedSavingsPlans, pagination),
    [enrichedSavingsPlans, pagination],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />
      </div>
    );
  }

  if (enrichedSavingsPlans.length === 0) {
    return (
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="my-3 mb-5"
      >
        {t('cpbc_no_consumption_data')}
      </OsdsText>
    );
  }

  return (
    <Datagrid
      className="my-3"
      columns={columns}
      items={paginatedData.rows}
      totalItems={paginatedData.totalRows}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  );
};

export default SavingsPlanList;
