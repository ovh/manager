import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  DataGridTextCell,
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDatagridSearchParams,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  OdsCheckboxCheckedChangeEventDetail,
  OsdsCheckboxCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, PciAnnouncementBanner } from '@ovh-ux/manager-pci-common';
import {
  useAttachBasicIp,
  useBasicIps,
  useDetachBasicIp,
  useTerminateBasicIps,
} from '@/api/hooks/useBasicIp';
import { BASIC_IP_RESOURCE_TYPE, TBasicIpRow } from '@/types/publicip.type';
import TerminateModal from '@/components/terminate/Terminate.component';
import { useCreateEditBasicIp } from '@/hooks/useCreateEditBasicIp';
import { ResponseAPIError } from '@/interface';
import AttachBasicIPModal from './AttachBasicIP.component';
import BasicIPActions from './BasicIPActions.component';
import BasicIPStatus from './BasicIPStatus.component';

export type BasicIPComponentProps = {
  projectId: string;
  projectUrl: string;
};

export default function BasicIPComponent({
  projectId,
  projectUrl,
}: Readonly<BasicIPComponentProps>) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const { pagination, setPagination } = useDatagridSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const { error, data: basicIPs, isLoading } = useBasicIps(
    projectId || '',
    { pagination },
    filters,
  );

  const goToInstanceHref = (id: string) => `${projectUrl}/instances/${id}`;

  /**
   * Gateways have no detail page in the manager, so they link to their listing.
   * An unknown resource kind gets no link rather than a wrong one.
   */
  const getAssociatedResourceHref = (basicIp: TBasicIpRow) => {
    switch (basicIp.associatedResourceType) {
      case BASIC_IP_RESOURCE_TYPE.INSTANCE:
        return goToInstanceHref(basicIp.associatedResourceId);
      case BASIC_IP_RESOURCE_TYPE.GATEWAY:
        return `${projectUrl}/gateway`;
      default:
        return null;
    }
  };

  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const { addError, addSuccess } = useNotifications();
  const { isCreateEditBasicIpEnabled } = useCreateEditBasicIp();
  const [selectedIpIds, setSelectedIpIds] = useState<string[]>([]);
  const [isTerminatingSelection, setIsTerminatingSelection] = useState(false);
  const [attachedIp, setAttachedIp] = useState<TBasicIpRow>(null);

  const notifyAssociationError = (
    key: string,
    basicIp: TBasicIpRow,
    cause: Error,
  ) =>
    addError(
      t(key, {
        ip: basicIp.ip,
        error: (cause as ResponseAPIError)?.response?.data?.message,
        interpolation: { escapeValue: false },
      }),
    );

  const [pendingAssociationIp, setPendingAssociationIp] = useState<TBasicIpRow>(
    null,
  );

  const { attach, isPending: isAttachPending } = useAttachBasicIp({
    projectId,
    onSuccess: () => {
      addSuccess(
        t('pci_additional_ips_basic_ip_attach_success_info', {
          ip: pendingAssociationIp?.ip,
        }),
        true,
      );
      setAttachedIp(null);
    },
    onError: (cause) =>
      notifyAssociationError(
        'pci_additional_ips_basic_ip_attach_failure_info',
        pendingAssociationIp,
        cause,
      ),
  });

  const { detach } = useDetachBasicIp({
    projectId,
    onSuccess: () =>
      addSuccess(
        t('pci_additional_ips_basic_ip_detach_success_info', {
          ip: pendingAssociationIp?.ip,
        }),
        true,
      ),
    onError: (cause) =>
      notifyAssociationError(
        'pci_additional_ips_basic_ip_detach_failure_info',
        pendingAssociationIp,
        cause,
      ),
  });

  const toggleIpSelection = (ipId: string, isSelected: boolean) =>
    setSelectedIpIds((currentIds) =>
      isSelected
        ? [...currentIds, ipId]
        : currentIds.filter((selectedId) => selectedId !== ipId),
    );

  const {
    terminate: terminateSelection,
    isPending: isSelectionTerminationPending,
  } = useTerminateBasicIps({
    projectId,
    onSettled: ({ deleted, failed }) => {
      setIsTerminatingSelection(false);
      setSelectedIpIds(failed);

      if (deleted.length) {
        addSuccess(
          t('pci_additional_ips_basic_ip_terminate_all_success_info', {
            number: deleted.length,
          }),
          true,
        );
      }

      if (failed.length) {
        addError(
          t('pci_additional_ips_basic_ip_terminate_all_failure_info', {
            ips: failed.join(', '),
            interpolation: { escapeValue: false },
          }),
        );
      }
    },
  });

  const columns = [
    {
      id: 'selection',
      isSortable: false,
      cell: (props: TBasicIpRow) => (
        <OsdsCheckbox
          value={props.id}
          checked={selectedIpIds.includes(props.id)}
          ariaLabel={t('pci_additional_ips_basic_ip_select', {
            ip: props.ip,
          })}
          onOdsCheckedChange={(
            event: OsdsCheckboxCustomEvent<OdsCheckboxCheckedChangeEventDetail>,
          ) => toggleIpSelection(props.id, event.detail.checked)}
        >
          <OsdsCheckboxButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_CHECKBOX_BUTTON_SIZE.sm}
            interactive
          />
        </OsdsCheckbox>
      ),
      label: '',
    },
    {
      id: 'ip-address',
      cell: (props: TBasicIpRow) => (
        <DataGridTextCell>
          <div className="flex items-center gap-x-2">
            <span className="whitespace-nowrap">{props.ip}</span>
            {/* IPv4/IPv6 is protocol naming, identical in every locale */}
            <Badge
              className="w-fit whitespace-nowrap"
              size="sm"
              color="information"
              label={`IPv${props.ipVersion}`}
            />
          </div>
        </DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_ip'),
    },
    {
      id: 'region',
      cell: (props: TBasicIpRow) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_additional_ips_floating_ip_grid_region'),
    },
    {
      id: 'associated-resource',
      cell: (props: TBasicIpRow) => {
        if (!props.associatedResourceId) {
          return <DataGridTextCell>-</DataGridTextCell>;
        }

        const label =
          props.associatedResourceName || props.associatedResourceId;
        const href = getAssociatedResourceHref(props);

        return (
          <DataGridTextCell>
            {href ? (
              <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} href={href}>
                {label}
              </OsdsLink>
            ) : (
              label
            )}
          </DataGridTextCell>
        );
      },
      label: t('pci_additional_ips_basic_ip_grid_associated_resource'),
    },
    {
      id: 'status',
      cell: (props: TBasicIpRow) => <BasicIPStatus status={props.status} />,
      label: t('pci_additional_ips_basic_ip_grid_status'),
    },
    {
      id: 'actions',
      cell: (props: TBasicIpRow) => (
        <div className="min-w-16">
          <BasicIPActions
            basicIp={props}
            canEditAssociation={isCreateEditBasicIpEnabled}
            onAttach={setAttachedIp}
            onDetach={(basicIp) => {
              setPendingAssociationIp(basicIp);
              detach(basicIp);
            }}
          />
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
        <div className="flex items-center gap-x-3">
          {isCreateEditBasicIpEnabled && (
            <OsdsButton
              className="mr-1 xs:mb-1 sm:mb-0"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.flat}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => navigate('../order')}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.ADD}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
                className="mr-3 bg-white"
              />
              {t('pci_additional_ips_add_additional_ip')}
            </OsdsButton>
          )}
          <OsdsButton
            className="xs:mb-1 sm:mb-0"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            {...(selectedIpIds.length === 0 && { disabled: true })}
            onClick={() => setIsTerminatingSelection(true)}
          >
            {t('pci_additional_ips_basic_ip_delete_selected')}
          </OsdsButton>
        </div>
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
                key: 'search',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: '',
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
                    id: 'associatedResourceName',
                    label: t(
                      'pci_additional_ips_basic_ip_grid_associated_resource',
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
          data-testid="basicIP_message_error"
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
            data-testid="basicIP_spinner_loading"
            inline
            size={ODS_SPINNER_SIZE.md}
          />
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={basicIPs.rows || []}
            totalItems={basicIPs.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </div>
      )}

      {attachedIp && (
        <AttachBasicIPModal
          projectId={projectId}
          basicIp={attachedIp}
          isPending={isAttachPending}
          onClose={() => setAttachedIp(null)}
          onConfirm={(instanceId) => {
            setPendingAssociationIp(attachedIp);
            attach(attachedIp, instanceId);
          }}
        />
      )}

      {isTerminatingSelection && (
        <TerminateModal
          title={t('pci_additional_ips_basic_ip_terminate_all_title', {
            number: selectedIpIds.length,
          })}
          information={t('pci_additional_ips_basic_ip_terminate_dual_stack')}
          isPending={false}
          isPendingTerminate={isSelectionTerminationPending}
          onClose={() => setIsTerminatingSelection(false)}
          onConfirm={() => terminateSelection(selectedIpIds)}
        />
      )}
    </>
  );
}
