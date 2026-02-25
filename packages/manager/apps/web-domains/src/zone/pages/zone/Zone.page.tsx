import BannerStatus from "@/domain/components/BannerStatus/BannerStatus";
import { useLinks } from "@/domain/constants/guideLinks";
import { urls as domainUrls } from "@/domain/routes/routes.constant";
import { useGetDomainZoneRecords } from "@/zone/hooks/useGetDomainZoneRecords/useGetDomainZoneRecords";
import { ZoneRecord } from "@/zone/types/zoneRecords.types";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { ShellContext } from "@ovh-ux/manager-react-shell-client";
import { ActionMenu, DatagridColumn, GuideMenu, Notifications, useColumnFilters, useNotifications } from "@ovh-ux/muk";
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { useGetIAMResource } from '@/common/hooks/iam/useGetIAMResource';
import { FilterComparator, applyFilters } from "@ovh-ux/manager-core-api";
import { Button, BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, POPOVER_POSITION, TEXT_PRESET, Text } from "@ovhcloud/ods-react";
import { useContext, useMemo, useCallback, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ExpandedState, RowSelectionState } from '@tanstack/react-table';
import ZoneDnsDatagrid from "./components/ZoneDnsDatagrid";
import UnauthorizedBanner from "@/domain/components/UnauthorizedBanner/UnauthorizedBanner";
import ResetDrawer from "@/zone/pages/zone/reset/ResetDrawer";
import QuickAddEntry from "@/zone/pages/zone/components/QuickAddEntry";
import ModifyTtlModal from "@/zone/pages/zone/modify/ModifyTtl.modal";
import { useGetDomainZone } from "@/domain/hooks/data/query";
import { DeleteEntryModal } from '@/zone/pages/zone/delete/DeleteEntry.modal';

export default function ZonePage() {
  const { t } = useTranslation(['zone', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { serviceName } = useParams<{ serviceName: string }>();
  const buildUrl = (baseUrl: string) => {
    return baseUrl.replace(':serviceName', serviceName || '');
  };
  const { data, hasNextPage, fetchNextPage, fetchAllPages, refetch } = useGetDomainZoneRecords(serviceName);
  const [openModal, setOpenModal] = useState<'add-entry' | 'modify-textual-record' | 'modify-ttl' | 'reset' | 'delete-zone' | 'delete-entry' | null>(null);
  const tabsZone = domainUrls.domainTabZone;
  const [searchInput, setSearchInput] = useState('');
  const [showAddEntryDiv, setShowAddEntryDiv] = useState(false);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const [selectedRecord, setSelectedRecord] = useState<ZoneRecord | null>(null);
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const quickAddRef = useRef<HTMLDivElement>(null);

  const collapseRow = useCallback((rowId: string) => {
    setExpandedState((prev) => {
      if (typeof prev === 'boolean') return {};
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  }, []);

  const handleQuickAddSuccess = useCallback(() => {
    setShowAddEntryDiv(false);
  }, []);

  const handleQuickAddCancel = useCallback(() => {
    setShowAddEntryDiv(false);
  }, []);

  const handleToggleAddEntry = useCallback(() => {
    setExpandedState({});
    setShowAddEntryDiv(prev => !prev);
  }, []);

  const handleAddFilter = useCallback((filterProps: Parameters<typeof addFilter>[0]) => {
    addFilter(filterProps);
  }, [addFilter]);

  const handleRemoveFilter = useCallback((filter: Parameters<typeof removeFilter>[0]) => {
    removeFilter(filter);
  }, [removeFilter]);

  const { domainZone, isFetchingDomainZone, domainZoneError } = useGetDomainZone(serviceName ?? '', true);

  const { data: dnsZoneIAMResources } = useGetIAMResource(serviceName ?? '', 'dnsZone');
  const urn = dnsZoneIAMResources?.[0]?.urn;
  const { isPending: isIamPending, isAuthorized } = useAuthorizationIam(
    ['dnsZone:apiovh:record/create', 'dnsZone:apiovh:record/delete'],
    urn ?? '',
  );

  const { isPending: isIamSoaPending, isAuthorized: canEditSoa } = useAuthorizationIam(
    ['dnsZone:apiovh:soa/edit'],
    urn,
  );
  const canModifyTtl = !isIamSoaPending && canEditSoa;

  const { isPending: isIamResetPending, isAuthorized: canDoReset } = useAuthorizationIam(
    ['dnsZone:apiovh:reset'],
    urn,
  );
  const canReset = !isIamResetPending && canDoReset;

  const { isPending: isIamImportZonePending, isAuthorized: canDoImportZone } = useAuthorizationIam(
    ['dnsZone:apiovh:import'],
    urn,
  );
  const canImportZone = !isIamImportZonePending && canDoImportZone;

  const { addInfo, clearNotifications } = useNotifications();

  useEffect(() => {
    if (isFetchingDomainZone) return;
    clearNotifications();
    if (domainZoneError) {
      addInfo(t('zone_page_message_no_zone'), false);
    }
  }, [isFetchingDomainZone, domainZoneError]);

  useEffect(() => {
    const hasFilters = filters.length > 0;
    const hasSearch = searchInput.trim().length > 0;

    if ((hasFilters || hasSearch) && hasNextPage) {
      fetchAllPages();
    }
  }, [filters, searchInput, hasNextPage, fetchAllPages]);

  // Display the form between the topbar and the datagrid when the "Add Entry" button is clicked
  useEffect(() => {
    const topbarContainer = document.querySelector('[data-testid="topbar-container"]');
    const quickAddDiv = quickAddRef.current;

    if (topbarContainer && quickAddDiv && topbarContainer.parentNode) {
      const nextSibling = topbarContainer.nextSibling;
      if (nextSibling !== quickAddDiv) {
        topbarContainer.parentNode.insertBefore(quickAddDiv, nextSibling);
      }
    }
  }, [showAddEntryDiv]);

  const records = useMemo(() => {
    return data?.records ?? [];
  }, [data]);

  const availableFieldTypes = useMemo(() => {
    return data?.fieldsTypes ?? [];
  }, [data]);

  const filteredRecords = useMemo(() => {
    let result = records;

    if (filters.length > 0) {
      result = applyFilters(result, filters);
    }

    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      result = result.filter((record) => {
        const subDomain = record.subDomain?.toLowerCase() || '';
        const ttl = record.ttl?.toString() || '';
        const zoneToDisplay = record.zoneToDisplay?.toLowerCase() || '';
        const fieldType = record.fieldType?.toLowerCase() || '';
        const targetToDisplay = record.targetToDisplay?.toLowerCase() || '';
        return (
          subDomain.includes(searchLower) ||
          ttl.includes(searchLower) ||
          zoneToDisplay.includes(searchLower) ||
          fieldType.includes(searchLower) ||
          targetToDisplay.includes(searchLower)
        );
      });
    }

    return result;
  }, [records, filters, searchInput]);
  const actionItems = [
    {
      id: 1,
      label: t('zone_page_modify_textual'),
      onClick: () => navigate(buildUrl(`${tabsZone}/modify-textual-record`)),
      isDisabled: !canImportZone,
    },
    {
      id: 2,
      label: t('zone_page_modify_default_ttl'),
      onClick: () => setOpenModal('modify-ttl'),
      isDisabled: !canModifyTtl,
    },
    {
      id: 3,
      label: t('zone_page_view_history'),
      onClick: () => navigate(buildUrl(`${tabsZone}/history`)),
    },
    {
      id: 4,
      label: t('zone_page_reset'),
      onClick: () => setOpenModal('reset'),
      isDisabled: !canReset,
    },
  ];

  const closeModal = useCallback(() => {
    setOpenModal(null);
    setSelectedRecord(null);
  }, []);

  const zoneModals = (
    <>
      {openModal === 'modify-ttl' && (
        <ModifyTtlModal
          onCloseCallback={closeModal}
          onSuccessCallback={closeModal}
        />
      )}
      {openModal === 'reset' && [
        <div
          key={'background'}
          className="fixed inset-0 bg-[--ods-color-primary-500] opacity-75 z-40"
          onClick={() => closeModal()}
        />,
        <ResetDrawer
          key={"resetDrawer"}
          onCloseCallback={closeModal}
          onSuccessCallback={closeModal}
        />
      ]}
      {openModal === 'delete-entry' && (
        <DeleteEntryModal
          record={selectedRecord}
          onCloseCallback={closeModal}
          onRefetch={refetch}
        />
      )}
    </>
  );

  const actionItemsDatagrid = (record: ZoneRecord) => [
    {
      id: 1,
      label: t('zone_page_modify_entry'),
      onClick: () => {
        setShowAddEntryDiv(false);
        setExpandedState((prev) => {
          const prevRecord = prev as Record<string, boolean>;
          const wasExpanded = !!prevRecord[record.id];
          return wasExpanded ? {} : { [record.id]: true };
        });
      },
    },
    {
      id: 2,
      label: t('zone_page_delete_entry'),
      onClick: () => {
        setSelectedRecord(record);
        setOpenModal('delete-entry');
      },
    },
  ];
  const columns: DatagridColumn<ZoneRecord>[] = useMemo(
    () => [
      {
        id: 'fieldType',
        accessorKey: 'fieldType',
        header: t('zone_page_type'),
        label: t('zone_page_type'),
        isFilterable: true,
        comparator: [FilterComparator.IsEqual, FilterComparator.IsDifferent],
        filterOptions: availableFieldTypes
          .map((fieldType) => ({
            label: fieldType,
            value: fieldType,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      },
      {
        id: 'subDomain',
        header: t('zone_page_subdomain'),
        isSearchable: true,
        cell: ({ row }) => <div>{row.original.subDomain ? `${row.original.subDomain}.${row.original.zoneToDisplay}` : row.original.zoneToDisplay}</div>,
      },
      {
        id: 'targetToDisplay',
        accessorKey: 'targetToDisplay',
        header: t('zone_page_target'),
      },
      {
        id: 'ttl',
        accessorKey: 'ttl',
        header: t('zone_page_ttl'),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <ActionMenu
            key={`${row.original.id}-${openModal}`}
            items={actionItemsDatagrid(row.original)}
            id={row.original.id}
            isCompact
          />
        ),
        size: 48,
        header: '',
        label: '',
      },
    ], [t, availableFieldTypes, openModal]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedRecordIds = useMemo(() => {
    return Object.keys(rowSelection).filter(
      (index) => rowSelection[index]
    );
  }, [rowSelection]);
  const hasSelectedRows = selectedRecordIds.length > 0;

  const handleDeleteClick = useCallback(() => {
    navigate(buildUrl(`${domainUrls.domainTabZone}/delete`), {
      state: { recordIds: selectedRecordIds },
    });
  }, [navigate, buildUrl, domainUrls.domainTabZone, selectedRecordIds]);

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guideUrls = useLinks(ovhSubsidiary);
  const guideItems = [{
    id: 1,
    href: guideUrls.DNS_ZONE,
    target: '_blank',
    children: t('zone_page_guide_button_edit_label'),
  }, {
    id: 2,
    href: guideUrls.DNS_ZONE,
    target: '_blank',
    children: t('zone_page_guide_button_history_label'),
  }];
  return (
    <>
      {zoneModals}
      <BannerStatus serviceName={serviceName ?? ''} />
      <Notifications />
      {!isIamPending && !isAuthorized && <UnauthorizedBanner />}
      {!isFetchingDomainZone && domainZone && isAuthorized && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <Text preset={TEXT_PRESET.label} data-testid="zone-page-description-1">{t('zone_page_description')}</Text>
              <GuideMenu items={guideItems} />
            </div>
            <Text preset={TEXT_PRESET.paragraph} data-testid="zone-page-description-2">{t('zone_page_description_2')}</Text>
          </div>
          <div
            ref={quickAddRef}
            className={`mb-4 p-4 border rounded bg-[--ods-color-neutral-050] ${showAddEntryDiv ? '' : 'hidden'}`}
          >
            <QuickAddEntry
              serviceName={serviceName ?? ''}
              visible={showAddEntryDiv}
              onSuccess={handleQuickAddSuccess}
              onCancel={handleQuickAddCancel}
            />
          </div>
          <ZoneDnsDatagrid
            columns={columns}
            topbar={
              <div className="flex gap-2">
                <ActionMenu key={openModal} label={t('zone_page_actions')} items={actionItems} id="zone-action-menu" popoverPosition={POPOVER_POSITION.bottomEnd} />
                {hasSelectedRows && (
                  <Button
                    variant={BUTTON_VARIANT.outline}
                    color={BUTTON_COLOR.critical}
                    size={BUTTON_SIZE.sm}
                    onClick={handleDeleteClick}
                    data-testid="zone-page-delete-button"
                  >
                    {t(`${NAMESPACES.ACTIONS}:delete`)}
                  </Button>
                )}
                <Button size={BUTTON_SIZE.sm} onClick={handleToggleAddEntry}>{t('zone_page_add_entry')}</Button>
              </div>
            }
            data={filteredRecords}
            hasNextPage={hasNextPage}
            onFetchNextPage={fetchNextPage}
            onFetchAllPages={fetchAllPages}
            totalCount={data?.paginatedZone?.count ?? 0}
            search={{
              onSearch: setSearchInput,
              searchInput,
              setSearchInput,
            }}
            filters={{
              add: handleAddFilter,
              filters,
              remove: handleRemoveFilter,
            }}
            rowSelection={{
              rowSelection,
              setRowSelection,
            }}
            expandable={{ expanded: expandedState, setExpanded: setExpandedState }}
            renderSubComponent={(row) => (
              <QuickAddEntry
                serviceName={serviceName ?? ''}
                visible={true}
                editingRecord={row.original}
                onSuccess={() => collapseRow(row.id)}
                onCancel={() => collapseRow(row.id)}
              />
            )}
            subComponentHeight={600}
          />
        </>
      )}

      {!isFetchingDomainZone && !domainZone && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row items-start gap-4">
            <Button size={BUTTON_SIZE.sm} onClick={() => navigate(buildUrl(`${domainUrls.zoneActivate}`))}>{t('zone_page_activate_zone')}</Button>
          </div>
        </div>
      )}
    </>
  );
}
