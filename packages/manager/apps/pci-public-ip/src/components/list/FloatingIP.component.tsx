import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useFeatureAvailability } from '@ovh-ux/manager-react-core-application';
import {
  DataGridTextCell,
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  PciAnnouncementBanner,
  useColumnFilters,
  useDatagridSearchParams,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FloatingIP } from '@/interface';
import { useFloatingIPs } from '@/api/hooks/useFloatingIP';
import FloatingIPActions from './FloatingIPActions.component';
import { pciAnnouncementBannerId } from '@/constants';

export type FloatingIPComponentProps = {
  projectId: string;
  projectUrl: string;
};

export default function FloatingIPComponent({
  projectId,
  projectUrl,
}: Readonly<FloatingIPComponentProps>) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const goToOrderPage = () => navigate('../order');

  const { pagination, setPagination } = useDatagridSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const {
    data: featureAvailabilityData,
    isLoading: isFeatureAvailabilityLoading,
  } = useFeatureAvailability([pciAnnouncementBannerId]);

  const displayAnnouncementBanner =
    featureAvailabilityData &&
    featureAvailabilityData[pciAnnouncementBannerId] &&
    !isFeatureAvailabilityLoading;

  const { error, data: floatingIPs, isLoading } = useFloatingIPs(
    projectId || '',
    { pagination },
    filters,
  );

  const goToInstanceHref = (id: string) => `${projectUrl}/instances/${id}`;
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const columns = [
    {
      id: 'ip-address',
      cell: (props: FloatingIP) => (
        <DataGridTextCell> {props.ip}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_ip'),
    },
    {
      id: 'region',
      cell: (props: FloatingIP) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_region'),
    },

    {
      id: 'associated-service',
      cell: (props: FloatingIP) => (
        <DataGridTextCell>{props.associatedEntity?.id}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_associated_service'),
    },
    {
      id: 'associated-endpoint',
      cell: (props: FloatingIP) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={goToInstanceHref(props.associatedEntity?.id)}
          >
            {props.associatedEntity?.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_assocated_endpoint'),
    },
    {
      id: 'actions',
      cell: (props: FloatingIP) => (
        <FloatingIPActions projectId={projectId} ipId={props.id} />
      ),
      label: '',
    },
  ];

  return (
    <>
      <Notifications />

      {displayAnnouncementBanner && (
        <PciAnnouncementBanner projectId={projectId} />
      )}

      <OsdsDivider />
      <div className="sm:flex items-center justify-between">
        <OsdsButton
          className="mr-1 xs:mb-1 sm:mb-0"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => goToOrderPage()}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.ADD}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="mr-3"
          />
          {t('pci_additional_ips_add_additional_ip')}
        </OsdsButton>
        <div className="justify-between flex">
          <OsdsSearchBar
            className={'w-[70%]'}
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'ip',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: t('pci_additional_ips_floating_ip_grid_ip'),
              });
              setSearchField('');
            }}
          />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                className={'mr-2'}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {t('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'ip',
                    label: t('pci_additional_ips_floating_ip_grid_ip'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'region',
                    label: t('pci_additional_ips_floating_ip_grid_region'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'associatedEntityId',
                    label: t(
                      'pci_additional_ips_floating_ip_grid_associated_service',
                    ),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'associatedEntityName',
                    label: t(
                      'pci_additional_ips_floating_ip_grid_assocated_endpoint',
                    ),
                    comparators: FilterCategories.String,
                  },
                ]}
                onAddFilter={(addedFilter, column) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: pagination.pageSize,
                  });
                  addFilter({
                    ...addedFilter,
                    label: column.label,
                  });
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>

      {error && (
        <OsdsMessage
          data-testid="floatingIP_message_error"
          className="mt-4"
          type={ODS_MESSAGE_TYPE.error}
        >
          {t('manager_error_page_default')}
        </OsdsMessage>
      )}
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      {isLoading && !error && (
        <div className="text-center">
          <OsdsSpinner
            data-testid="floatingIP_spinner_loading"
            inline
            size={ODS_SPINNER_SIZE.md}
          />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={floatingIPs.rows || []}
            totalItems={floatingIPs.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </>
  );
}
