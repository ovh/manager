import {
  Datagrid,
  DataGridTextCell,
  useDataGrid,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { COLD_ARCHIVE_GRID_DATA } from '@/constants';
import { paginateResults, TQuantity } from '@/api/data/consumption';
import NoDataMessage from './NoDataMessage.component';
import { TResourceUsage } from '@/api/hook/useConsumption';

type ColdArchiveListProps = {
  coldArchives: TResourceUsage[];
};

export default function ColdArchiveList({
  coldArchives,
}: Readonly<ColdArchiveListProps>) {
  const { t } = useTranslation('consumption/hourly-instance/cold-archive');

  const { currency } = useContext(ShellContext).environment.getUser();
  const { translateMicroRegion } = useTranslatedMicroRegions();
  const { pagination, setPagination } = useDataGrid();

  const quantityUnit = (quantity: TQuantity) => {
    if (quantity.unit === COLD_ARCHIVE_GRID_DATA.QUANTITY.HOUR) {
      return t('pci_billing_cold_archive_consumption_value_gbih', {
        value: quantity.value,
      });
    }

    return t('pci_billing_cold_archive_consumption_value_gbi', {
      value: quantity.value,
    });
  };

  const paginatedColdArchives = useMemo(() => {
    const sortedColdArchives = coldArchives?.sort((a, b) =>
      a.region.localeCompare(b.region),
    );
    return paginateResults(sortedColdArchives || [], pagination);
  }, [coldArchives, pagination, setPagination]);

  const columns = [
    {
      id: 'region',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{translateMicroRegion(row?.region)}</DataGridTextCell>
      ),
      label: t('pci_billing_cold_archive_region'),
    },
    {
      id: 'type',
      cell: (row: TResourceUsage) => (
        <div>
          {row.name === COLD_ARCHIVE_GRID_DATA.FEE_TYPES['ARCHIVE-FEES'] ? (
            <OsdsTooltip>
              <DataGridTextCell>
                {t(`pci_billing_cold_archive_type_${row.name}_label`)}
              </DataGridTextCell>
              <OsdsTooltipContent slot="tooltip-content">
                <OsdsText
                  size={ODS_TEXT_SIZE._100}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('pci_billing_cold_archive_type_archive-fees_tooltip_1')}
                  {t('pci_billing_cold_archive_type_archive-fees_tooltip_2')}
                </OsdsText>
              </OsdsTooltipContent>
            </OsdsTooltip>
          ) : (
            <DataGridTextCell>
              {t(`pci_billing_cold_archive_type_${row.name}_label`)}
            </DataGridTextCell>
          )}
        </div>
      ),
      label: t('pci_billing_cold_archive_type'),
    },
    {
      id: 'consumption',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>{quantityUnit(row.quantity)}</DataGridTextCell>
      ),
      label: t('pci_billing_cold_archive_consumption'),
    },
    {
      id: 'price',
      cell: (row: TResourceUsage) => (
        <DataGridTextCell>
          {`${row.totalPrice.toFixed(2)} ${currency.symbol}`}
        </DataGridTextCell>
      ),
      label: t('pci_billing_cold_archive_price'),
    },
  ];

  if (paginatedColdArchives.totalRows === 0) {
    return <NoDataMessage message={t('pci_billing_cold_archive_no_entry')} />;
  }

  return (
    <div className="my-3">
      <Datagrid
        columns={columns}
        items={paginatedColdArchives.rows}
        totalItems={paginatedColdArchives.totalRows}
        pagination={pagination}
        onPaginationChange={setPagination}
        className="overflow-x-visible"
      />
    </div>
  );
}
