/**
 * Listing.page.tsx
 * -----------------------------------------------------------------------------
 * Minimal **listing page** component:
 *
 * - Delegates data fetching to `useListingData` (which itself uses the
 *   `useResources` facade and normalizes the return shape).
 * - Uses optional custom columns from `useListingColumns`; otherwise falls
 *   back to an **auto-generated column** rendering raw JSON.
 * - Always supplies a numeric `totalItems` (required by Datagrid), falling back
 *   to the loaded size when total is unknown (Iceberg v2).
 *
 * Rendering:
 * - Renders an OVHcloud `Datagrid` with sorting, pagination, and infinite scroll.
 * - Uses `Outlet` to support nested routes beneath the listing.
 */
import React, { useMemo } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell, Datagrid, useDataGrid } from '@ovh-ux/manager-react-components';

import { useListingData } from '@/data/hooks/listing/useListingData';
import { useListingColumns } from '@/hooks/listing/useListingColumns';
import { ListingItemType } from '@/types/Listing.type';

/**
 * Listing page component.
 *
 * - Fetches data via `useListingData`.
 * - Defines columns via `useListingColumns`, with i18n translation for labels.
 * - Falls back to a generic auto column if no custom columns are defined.
 * - Provides sorting state using `useDataGrid`.
 * - Integrates with React Router's `<Outlet />` for nested detail views.
 *
 * @returns React component rendering a `Datagrid` with listing items.
 *
 * @example
 * ```tsx
 * import { BrowserRouter, Routes, Route } from 'react-router-dom';
 * import ListingPage from '@/pages/Listing.page';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/listing" element={<ListingPage />}>
 *           <Route path=":id" element={<DetailPage />} />
 *         </Route>
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 */
export default function ListingPage() {
  const { t } = useTranslation(['listing', 'common']);

  const { items, total, isLoading, hasNextPage, fetchNextPage } = useListingData<ListingItemType>();

  const baseColumns = useListingColumns<ListingItemType>();

  const columns = useMemo(() => {
    if (baseColumns.length > 0) {
      return baseColumns.map((c) => ({ ...c, label: t(String(c.label)) }));
    }

    const EMPTY = t('common:empty', '—');
    return [
      {
        id: 'auto',
        label: t('listing:auto_column', 'Result'),
        isSortable: false,
        cell: (row: ListingItemType) => (
          <DataGridTextCell>{row ? JSON.stringify(row) : EMPTY}</DataGridTextCell>
        ),
      },
    ];
  }, [baseColumns, t]);

  const initialSort = useMemo(() => ({ id: columns[0]?.id ?? 'auto', desc: false }), [columns]);
  const { sorting, setSorting } = useDataGrid(initialSort);

  // Datagrid requires a number; when total is unknown (v2) fall back to loaded size.
  const totalItems = Number.isFinite(total) ? total : items.length;

  return (
    <>
      <Datagrid
        columns={columns}
        items={items}
        totalItems={totalItems}
        isLoading={isLoading}
        sorting={sorting}
        onSortChange={setSorting}
        hasNextPage={hasNextPage}
        onFetchNextPage={fetchNextPage}
        noResultLabel={t('listing:no_results', 'No results')}
      />
      <Outlet />
    </>
  );
}
