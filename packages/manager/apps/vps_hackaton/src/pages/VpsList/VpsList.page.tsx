import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Text, Button, Select, SelectControl, SelectContent } from '@ovhcloud/ods-react';
import type { TVpsState } from '@/domain/entities/vps';
import { useVpsList } from '@/api/hooks/useVpsList';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { VpsListTable } from './components/VpsListTable.component';
import { OnboardingPage } from '@/pages/Onboarding/Onboarding.page';
import {
  selectVpsListForView,
  DEFAULT_FILTERS,
  PAGE_SIZE_OPTIONS,
  type TVpsListFilters,
} from './view-models/vpsList.viewmodel';
import type { TSortableField } from '@/domain/services/vpsFilter.service';

const VPS_ORDER_URL = 'https://www.ovhcloud.com/fr/vps/';

const VPS_STATE_OPTIONS: Array<TVpsState> = [
  'running',
  'stopped',
  'installing',
  'maintenance',
  'rebooting',
  'starting',
  'stopping',
  'upgrading',
  'migrating',
  'rescue',
  'rescued',
  'backuping',
  'error',
];

export const VpsListPage = () => {
  const { t } = useTranslation('vps');
  const [filters, setFilters] = useState<TVpsListFilters>(DEFAULT_FILTERS);

  const selectFn = useMemo(
    () => selectVpsListForView(filters),
    [filters],
  );

  // Get filtered list for display
  const { data: paginatedData, isLoading, isError } = useVpsList({
    select: selectFn,
  });

  // Also get unfiltered count to know if VPS exist at all
  const { data: allVpsData } = useVpsList({
    select: selectVpsListForView({ ...DEFAULT_FILTERS, pageSize: 1000 }),
  });

  const hasAnyVps = allVpsData && allVpsData.totalItems > 0;
  const hasActiveFilters = filters.searchTerm.length > 0 || filters.state !== undefined;

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const handleSortChange = (field: TSortableField) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  };

  const handleStateChange = (state: TVpsState | '') => {
    setFilters((prev) => ({ ...prev, state: state || undefined, page: 1 }));
  };

  // #region agent log
  const stateFilterItems = useMemo(() => [
    { value: '', label: t('vps_list_filter_all_states') },
    ...VPS_STATE_OPTIONS.map((stateVal) => ({
      value: stateVal,
      label: t(`vps_state_${stateVal}`),
    })),
  ], [t]);

  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/939f1525-c29a-4fc7-9aeb-4c0892683f08',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'VpsList.page.tsx:useEffect',message:'Component mounted - checking Select',data:{SelectType:typeof Select,SelectExists:!!Select,stateFilterItems,filtersState:filters.state},timestamp:Date.now(),sessionId:'debug-session',runId:'select-debug',hypothesisId:'H1-H3'})}).catch(()=>{});
  }, [stateFilterItems, filters.state]);
  // #endregion

  if (isLoading) {
    return (
      <div className="p-6">
        <Text preset="heading-2" className="mb-6">
          {t('vps_list_title')}
        </Text>
        <LoadingSkeleton lines={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Text preset="heading-2" className="mb-6">
          {t('vps_list_title')}
        </Text>
        <div className="rounded-lg border border-[--ods-color-critical-200] bg-[--ods-color-critical-100] p-4">
          <Text preset="paragraph" className="text-[--ods-color-critical-700]">
            {t('vps_list_error')}
          </Text>
        </div>
      </div>
    );
  }

  // Only show onboarding if there are truly no VPS (not due to filtering)
  if (!hasAnyVps && !isLoading) {
    return <OnboardingPage />;
  }

  const { items, totalItems, totalPages, currentPage, pageSize } = paginatedData || {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Text preset="heading-2">
          {t('vps_list_title')}
        </Text>
        <Button
          variant="default"
          onClick={() => window.open(VPS_ORDER_URL, '_blank')}
        >
          {t('vps_list_order_button')}
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Input
          type="text"
          name="search"
          placeholder={t('vps_list_search_placeholder')}
          value={filters.searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleSearchChange(e.target.value);
          }}
          className="max-w-md"
        />
        {/* #region agent log */}
        <Select
          name="stateFilter"
          items={stateFilterItems}
          value={filters.state ? [filters.state] : ['']}
          onValueChange={(detail) => {
            fetch('http://127.0.0.1:7242/ingest/939f1525-c29a-4fc7-9aeb-4c0892683f08',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'VpsList.page.tsx:Select:onValueChange',message:'State filter changed',data:{value:detail.value},timestamp:Date.now(),sessionId:'debug-session',runId:'select-fix',hypothesisId:'H-Select'})}).catch(()=>{});
            handleStateChange((detail.value[0] || '') as TVpsState | '');
          }}
          className="min-w-[180px]"
        >
          <SelectControl placeholder={t('vps_list_filter_all_states')} />
          <SelectContent />
        </Select>
        {/* #endregion */}
      </div>

      {items && items.length > 0 ? (
        <>
          <VpsListTable
            vpsList={items}
            sortField={filters.sortField}
            sortDirection={filters.sortDirection}
            onSortChange={handleSortChange}
          />
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[--ods-color-neutral-200]">
            <div className="flex items-center gap-2">
              <Text preset="paragraph" className="text-[--ods-color-neutral-600]">
                {t('vps_list_items_per_page')}
              </Text>
              <Select
                name="pageSize"
                items={PAGE_SIZE_OPTIONS.map((size) => ({
                  value: String(size),
                  label: String(size),
                }))}
                value={[String(pageSize)]}
                onValueChange={(detail) => {
                  handlePageSizeChange(Number(detail.value[0]));
                }}
              >
                <SelectControl />
                <SelectContent />
              </Select>
              <Text preset="paragraph" className="text-[--ods-color-neutral-600] ml-4">
                {t('vps_list_showing_items', {
                  start: (currentPage - 1) * pageSize + 1,
                  end: Math.min(currentPage * pageSize, totalItems),
                  total: totalItems,
                })}
              </Text>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                {t('vps_list_previous')}
              </Button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                {t('vps_list_next')}
              </Button>
            </div>
          </div>
        </>
      ) : hasActiveFilters ? (
        <div className="rounded-lg border border-[--ods-color-neutral-200] bg-[--ods-color-neutral-100] p-8 text-center">
          <Text preset="paragraph" className="text-[--ods-color-neutral-600]">
            {t('vps_list_no_results')}
          </Text>
        </div>
      ) : null}
    </div>
  );
};

export default VpsListPage;
