import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  DataGridTextCell,
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDatagridSearchParams,
} from '@ovh-ux/manager-react-components';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsMenu,
  OsdsMenuItem,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PciAnnouncementBanner } from '@ovh-ux/manager-pci-common';
import { FailoverIP } from '@/interface';
import { useFailoverIPs } from '@/api/hooks/useFailoverIP';
import FailoverIPActions from './FailoverIPActions.component';

export type FailoverIPComponentProps = {
  projectId: string;
  projectUrl: string;
};

export default function FailoverIPComponent({
  projectId,
  projectUrl,
}: Readonly<FailoverIPComponentProps>) {
  const { t } = useTranslation('common');

  const { pagination, setPagination } = useDatagridSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const navigate = useNavigate();

  const { error, data: failoverIPs, isLoading } = useFailoverIPs(
    projectId || '',
    {
      pagination,
    },
    filters,
  );

  const goToInstanceHref = (id: string) => `${projectUrl}/instances/${id}`;
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const columns = [
    {
      id: 'failover-ip',
      cell: (props: FailoverIP) => (
        <DataGridTextCell> {props.ip}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_failover_ip_title'),
    },
    {
      id: 'bloc-ip',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>{props.block}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_ip_block'),
    },

    {
      id: 'country',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>
          {t(`pci_additional_ips_country_${props.geoloc}`)}
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_geoloc'),
    },
    {
      id: 'id',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>{props.id}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_id'),
    },
    {
      id: 'routed-to',
      cell: (props: FailoverIP) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={goToInstanceHref(props.routedTo)}
          >
            {props.associatedEntityName}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_routedTo'),
    },
    {
      id: 'actions',
      cell: (props: FailoverIP) => (
        <div className="min-w-16">
          <FailoverIPActions projectId={projectId} ipId={props.id} />
        </div>
      ),
      label: '',
    },
  ];

  return (
    <>
      <Notifications />

      <PciAnnouncementBanner projectId={projectId} />

      <OsdsDivider />
      <div className="sm:flex items-center justify-between">
        <OsdsMenu className="mb-3">
          <OsdsButton
            slot={'menu-title'}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.flat}
            className={'flex'}
          >
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              contrasted
              className={'align-middle'}
            >
              {t('common_actions')}
            </OsdsText>
            <OsdsIcon
              name={ODS_ICON_NAME.CHEVRON_DOWN}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.sm}
              className={'ml-4 bg-white align-middle'}
            ></OsdsIcon>
          </OsdsButton>
          <OsdsMenuItem>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => navigate('../imports')}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                level={ODS_TEXT_LEVEL.button}
                color={ODS_THEME_COLOR_INTENT.primary}
                slot={'start'}
              >
                {t('pci_additional_ips_import_failover_ip')}
              </OsdsText>
            </OsdsButton>
          </OsdsMenuItem>
          <OsdsMenuItem>
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => navigate('../order')}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                level={ODS_TEXT_LEVEL.button}
                color={ODS_THEME_COLOR_INTENT.primary}
                slot={'start'}
              >
                {t('pci_additional_ips_order')}
              </OsdsText>
            </OsdsButton>
          </OsdsMenuItem>
        </OsdsMenu>
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
                    label: t('pci_additional_ips_failover_ip_title'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'block',
                    label: t('pci_additional_ips_ip_block'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'associatedEntityName',
                    label: t('pci_additional_ips_routedTo'),
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
          data-testid="failoverIP_message_error"
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
            data-testid="failoverIP_spinner_loading"
            inline
            size={ODS_SPINNER_SIZE.md}
          />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={failoverIPs.rows || []}
            totalItems={failoverIPs.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}
    </>
  );
}
