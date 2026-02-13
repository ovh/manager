import BannerStatus from "@/domain/components/BannerStatus/BannerStatus";
import { useLinks } from "@/domain/constants/guideLinks";
import { urls as domainUrls } from "@/domain/routes/routes.constant";
import { useGetDomainZoneRecords } from "@/zone/hooks/useGetDomainZoneRecords/useGetDomainZoneRecords";
import { ZoneRecord, ZoneRecordFieldType } from "@/zone/types/zoneRecords.types";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { ShellContext } from "@ovh-ux/manager-react-shell-client";
import { ActionMenu, Datagrid, DatagridColumn, GuideMenu, Notifications, useColumnFilters, useDataApi, useNotifications } from "@ovh-ux/muk";
import { FilterComparator, applyFilters } from "@ovh-ux/manager-core-api";
import { Button, BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, POPOVER_POSITION, TEXT_PRESET, Text, Message, MESSAGE_COLOR } from "@ovhcloud/ods-react";
import { useContext, useMemo, useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ModifyTextualRecordModal from "@/zone/pages/zone/modify/ModifyTextualRecord.modal";
import ModifyTtlModal from "@/zone/pages/zone/modify/ModifyTtl.modal";
import ResetModal from "@/zone/pages/zone/reset/Reset.modal";
import { RowSelectionState } from '@tanstack/react-table';
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
  const tabsZone = domainUrls.domainTabZone;
  const [searchInput, setSearchInput] = useState('');
  const [openModal, setOpenModal] = useState<'add-entry' | 'modify-textual-record' | 'modify-ttl' | 'reset' | 'delete-zone' | 'delete-entry' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ZoneRecord | null>(null);
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const handleAddFilter = useCallback((filterProps: Parameters<typeof addFilter>[0]) => {
    addFilter(filterProps);
  }, [addFilter]);

  const handleRemoveFilter = useCallback((filter: Parameters<typeof removeFilter>[0]) => {
    removeFilter(filter);
  }, [removeFilter]);

  const { domainZone, isFetchingDomainZone, domainZoneError } = useGetDomainZone(serviceName, undefined, true);

  const { addWarning, addInfo, clearNotifications, notifications, clearNotification } = useNotifications();


  useEffect(() => {
    if (!isFetchingDomainZone && !domainZone && domainZoneError) {
      addWarning(t('zone_page_error_message', { message: `(${domainZoneError.response?.data?.message})` }));
      addInfo(t('zone_page_message_no_zone'), false);
    }
    return () => {
      clearNotifications();
    };
  }, [domainZone, isFetchingDomainZone, domainZoneError, addWarning, serviceName, t]);

  useEffect(() => {
    const hasFilters = filters.length > 0;
    const hasSearch = searchInput.trim().length > 0;

    if ((hasFilters || hasSearch) && hasNextPage) {
      fetchAllPages();
    }
  }, [filters, searchInput, hasNextPage, fetchAllPages]);

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
      label: t('zone_page_add_entry'),
      onClick: () => navigate(buildUrl(`${tabsZone}/add-entry`)),
    },
    {
      id: 2,
      label: t('zone_page_modify_textual'),
      onClick: () => setOpenModal('modify-textual-record'),
    },
    {
      id: 3,
      label: t('zone_page_modify_default_ttl'),
      onClick: () => setOpenModal('modify-ttl'),
    },
    {
      id: 4,
      label: t('zone_page_view_history'),
      onClick: () => navigate(buildUrl(`${tabsZone}/history`)),
    },
    {
      id: 5,
      label: t('zone_page_reset'),
      onClick: () => setOpenModal('reset'),
    },
  ];

  const closeModal = useCallback(() => {
    setOpenModal(null);
    setSelectedRecord(null);
  }, []);

  const zoneModals = (
    <>
      {openModal === 'modify-textual-record' && (
        <ModifyTextualRecordModal
          onCloseCallback={closeModal}
        />
      )}
      {openModal === 'modify-ttl' && (
        <ModifyTtlModal
          onCloseCallback={closeModal}
        />
      )}
      {openModal === 'reset' && (
        <ResetModal
          onCloseCallback={closeModal}
        />
      )}
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
      onClick: () => navigate(buildUrl(`${tabsZone}/modify-entry`), { state: { record } }),
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
        id: 'subDomain',
        header: t('zone_page_subdomain'),
        isSearchable: true,
        cell: ({ row }) => <div>{row.original.subDomain ? `${row.original.subDomain}.${row.original.zoneToDisplay}` : row.original.zoneToDisplay}</div>,
      },
      {
        id: 'ttl',
        accessorKey: 'ttl',
        header: t('zone_page_ttl'),
      },
      {
        id: 'fieldType',
        accessorKey: 'fieldType',
        header: t('zone_page_type'),
        label: t('zone_page_type'),
        isFilterable: true,
        comparator: [FilterComparator.IsEqual, FilterComparator.IsDifferent],
        filterOptions: availableFieldTypes
          .map((fieldType: ZoneRecordFieldType) => ({
            label: fieldType,
            value: fieldType,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),

      },
      {
        id: 'targetToDisplay',
        accessorKey: 'targetToDisplay',
        header: t('zone_page_target'),
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
      {isFetchingDomainZone ? null : domainZone ? (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <Text preset={TEXT_PRESET.label} data-testid="zone-page-description-1">{t('zone_page_description')}</Text>
              <GuideMenu items={guideItems} />
            </div>
            <Text preset={TEXT_PRESET.paragraph} data-testid="zone-page-description-2">{t('zone_page_description_2')}</Text>
          </div>

          <Datagrid containerHeight={500}
            columns={columns} topbar={
              <>
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
                </div>
              </>
            }
            data={filteredRecords}
            hasNextPage={hasNextPage}
            onFetchNextPage={fetchNextPage}
            onFetchAllPages={fetchAllPages}
            totalCount={data?.paginatedZone?.count ?? 0}
            search={{
              onSearch: (searchInput) => setSearchInput(searchInput),
              searchInput,
              setSearchInput
            }}
            filters={{
              add: handleAddFilter,
              filters,
              remove: handleRemoveFilter
            }}
            rowSelection={{
              rowSelection,
              setRowSelection,
            }}
          /></>) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row items-start gap-4">
            <div className="w-full">
              <Notifications />
            </div>
            <div className="w-2/3 flex justify-end">
              <Button
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.primary}
                onClick={() => navigate(buildUrl(`${domainUrls.zoneActivate}`))}
                className="w-full"
              >
                {t('zone_page_activate_zone')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}