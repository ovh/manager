/* eslint-disable max-lines-per-function */
/* eslint-disable react/no-multi-comp */
/* eslint-disable max-lines */
import React from 'react';

import { Path, To } from 'react-router-dom';

import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

import { managedWordpressRerefenceAvailableLanguageMock } from '@/data/__mocks__/managedWordpress/language';
import {
  managedWordpressResourceDetailsMock,
  managedWordpressResourceMock,
} from '@/data/__mocks__/managedWordpress/ressource';
import { managedWordpressRerefenceSupportedVersionMock } from '@/data/__mocks__/managedWordpress/supportedPhpVersion';
import { managedWordpressWebsitesTaskMock } from '@/data/__mocks__/managedWordpress/tasks';
import {
  managedWordpressWebsitesDeleteMock,
  managedWordpressWebsitesDetailsMock,
  managedWordpressWebsitesMock,
} from '@/data/__mocks__/managedWordpress/website';

const mocksAxios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

const mockUseDataApi = vi.hoisted(() => vi.fn());

vi.mock('axios', async (importActual) => {
  const actual = await importActual<typeof import('axios')>();

  const mockAxios = {
    default: {
      ...actual.default,
      get: mocksAxios.get,
      post: mocksAxios.post,
      put: mocksAxios.put,
      delete: mocksAxios.delete,
      create: vi.fn(() => ({
        ...actual.default.create(),
        get: mocksAxios.get,
        post: mocksAxios.post,
        put: mocksAxios.put,
        delete: mocksAxios.delete,
      })),
    },
  };

  return mockAxios;
});

export const navigate = vi.fn();
const mockUseInfiniteQuery = vi.fn();

vi.mock('@tanstack/react-query', async (importActual) => {
  const actual = await importActual<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useInfiniteQuery: mockUseInfiniteQuery,
  };
});

vi.mock('@ovh-ux/muk', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/muk')>();
  return {
    ...actual,
    useDataApi: mockUseDataApi,
    useNotifications: vi.fn(() => ({
      notifications: [],
      addSuccess: vi.fn(),
      addError: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    })),
    useFormatDate: vi.fn(),
    ActionMenu: ({
      id,
      items,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      items?: Array<{ id: number; label: string; onClick?: () => void }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {items?.map((item) => (
          <button key={item.id} data-testid={`action-item-${item.id}`} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    ),
    Badge: ({
      children,
      'data-testid': dataTestId,
      color,
      onClick,
      ...props
    }: React.PropsWithChildren<{
      children: React.ReactNode;
      'data-testid'?: string;
      color?: string;
      onClick?: () => void;
      [key: string]: unknown;
    }>) => (
      <span
        data-testid={dataTestId}
        color={color}
        onClick={onClick}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {children}
      </span>
    ),
    BaseLayout: ({
      breadcrumb,
      message,
      children,
      tabs,
    }: React.PropsWithChildren<{
      children: React.ReactNode;
      message: React.ReactElement;
      breadcrumb: React.ReactElement;
      tabs: React.ReactElement;
    }>) => (
      <div>
        <div>{breadcrumb}</div>
        {message && <div>{message}</div>}
        {tabs && <div>{tabs}</div>}
        {children}
      </div>
    ),
    Datagrid: ({
      children,
      isLoading,
      data,
      columns,
      topbar,
      expandable,
      ...props
    }: {
      children?: React.ReactNode;
      isLoading?: boolean;
      data?: unknown[];
      columns?: Array<{
        id: string;
        header?: string | React.ReactNode;
        cell?: (context: {
          row: { original: unknown };
          getValue: () => unknown;
        }) => React.ReactNode;
        accessorFn?: (row: unknown) => unknown;
      }>;
      topbar?: React.ReactElement;
      expandable?: {
        expanded: Record<string, boolean>;
        setExpanded: (state: Record<string, boolean>) => void;
        getRowCanExpand: (row: { original: unknown }) => boolean;
      };
      [key: string]: unknown;
    }) => {
      if (isLoading) {
        return (
          <div data-testid="datagrid" {...props}>
            <div data-testid="datagrid-loading">Loading...</div>
          </div>
        );
      }

      const renderCell = (
        column: {
          id: string;
          cell?: (context: {
            row: { original: unknown };
            getValue: () => unknown;
          }) => React.ReactNode;
          accessorFn?: (row: unknown) => unknown;
        },
        row: unknown,
      ) => {
        if (column.cell) {
          const getValue = () => column.accessorFn?.(row) ?? '';
          const cellContent = column.cell({ row: { original: row }, getValue });
          return (
            <div key={column.id} data-testid={`cell-${column.id}`}>
              {cellContent}
            </div>
          );
        }
        const value = column.accessorFn?.(row) ?? '';
        const displayValue =
          typeof value === 'string' || typeof value === 'number' ? String(value) : '';
        return (
          <div key={column.id} data-testid={`cell-${column.id}`}>
            {displayValue}
          </div>
        );
      };

      const renderRow = (row: unknown, index: number, isSubRow = false, parentIndex = 0) => {
        const rowKey = isSubRow ? `subrow-${parentIndex}-${index}` : `row-${index}`;
        const rowData = row as { subRows?: unknown[] };
        const hasSubRows = rowData?.subRows && rowData.subRows.length > 0;
        const shouldExpand = hasSubRows && expandable?.getRowCanExpand({ original: row }) !== false;

        return (
          <React.Fragment key={rowKey}>
            <div
              data-testid={
                isSubRow ? `datagrid-subrow-${parentIndex}-${index}` : `datagrid-row-${index}`
              }
            >
              {columns?.map((col) => renderCell(col, row))}
            </div>
            {shouldExpand &&
              rowData.subRows?.map((subRow, subIndex) => renderRow(subRow, subIndex, true, index))}
          </React.Fragment>
        );
      };

      return (
        <div data-testid="datagrid" {...props}>
          {topbar}
          {columns && columns.length > 0 && (
            <div data-testid="datagrid-headers">
              {columns.map((col, index) => (
                <div key={col.id || index} data-testid={`header-${col.id || index}`}>
                  {typeof col.header === 'string' ? col.header : col.header}
                </div>
              ))}
            </div>
          )}
          {data && data.length > 0 && (
            <div data-testid="datagrid-rows">{data.map((row, index) => renderRow(row, index))}</div>
          )}
          {children}
        </div>
      );
    },
    ChangelogMenu: ({
      id,
      links,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      links?: Record<string, string>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="action-menu" data-id={id} {...props}>
        {links &&
          Object.entries(links).map(([key, value]) => (
            <a key={key} data-testid={`changelog-link-${key}`} href={value}>
              {key}
            </a>
          ))}
      </div>
    ),
    GuideMenu: ({
      id,
      items,
      ...props
    }: React.PropsWithChildren<{
      id?: string;
      items?: Array<{ id: number; label: string; href?: string; onClick?: () => void }>;
      [key: string]: unknown;
    }>) => (
      <div data-testid="guide-menu" data-id={id} {...props}>
        {items?.map((item) => (
          <button key={item.id} data-testid={`guide-item-${item.id}`} onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    ),
    Modal: ({
      children,
      primaryButton,
      secondaryButton,
    }: React.PropsWithChildren<{
      children: React.ReactNode;
      primaryButton?: { label: string; disabled: boolean; onClick: () => void };
      secondaryButton?: { label: string; disabled: boolean; onClick: () => void };
    }>) => (
      <div data-testid="modal">
        {children}
        {primaryButton && (
          <button
            data-testid="primary-button"
            onClick={primaryButton.onClick}
            disabled={primaryButton.disabled}
          >
            {primaryButton.label}
          </button>
        )}
        {secondaryButton && (
          <button
            data-testid="secondary-button"
            onClick={secondaryButton.onClick}
            disabled={secondaryButton.disabled}
          >
            {secondaryButton.label}
          </button>
        )}
      </div>
    ),
    LinkCard: ({
      href,
      externalHref,
      description,
    }: React.PropsWithChildren<{
      externalHref: string;
      href: string;
      description: string;
    }>) => (
      <a
        href={href}
        target={externalHref ? '_blank' : undefined}
        rel={externalHref ? 'noreferrer' : undefined}
        className="no-underline"
      >
        {description}
      </a>
    ),
    MODAL_COLOR: {
      critical: 'critical',
      information: 'information',
      neutral: 'neutral',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
    },
    BADGE_COLOR: {
      alpha: 'alpha',
      beta: 'beta',
      new: 'new',
      promotion: 'promotion',
      critical: 'critical',
      information: 'information',
      neutral: 'neutral',
      primary: 'primary',
      success: 'success',
      warning: 'warning',
    },
  };
});

vi.mock('@/data/api/managedWordpress', () => ({
  getManagedCmsResource: vi.fn(() => Promise.resolve(managedWordpressResourceMock)),
  getManagedCmsResourceDetails: vi.fn(() => Promise.resolve(managedWordpressResourceDetailsMock)),
  getManagedCmsResourceWebsites: vi.fn(() =>
    Promise.resolve({
      data: managedWordpressWebsitesMock,
      cursorNext: null,
      status: 200,
    }),
  ),
  getAllManagedCmsResourceWebsites: vi.fn(() => Promise.resolve(managedWordpressWebsitesMock)),
  getManagedCmsResourceWebsiteDetails: vi.fn(() =>
    Promise.resolve(managedWordpressWebsitesDetailsMock),
  ),
  deleteManagedCmsResourceWebsite: vi.fn(() => Promise.resolve(managedWordpressWebsitesDeleteMock)),
  getManagedCmsResourceWebsiteTasks: vi.fn(() => Promise.resolve(managedWordpressWebsitesTaskMock)),
  getManagedCmsReferenceAvailableLanguages: vi.fn(() =>
    Promise.resolve(managedWordpressRerefenceAvailableLanguageMock),
  ),
  getManagedCmsSupportedPHPVersions: vi.fn(() =>
    Promise.resolve(managedWordpressRerefenceSupportedVersionMock),
  ),
  getManagedCmsResourceWebsiteDetailsQueryKey: vi.fn(),
  getManagedCmsResourceWebsitesQueryKey: vi.fn(),
  postManagedCmsResourceWebsite: vi.fn(() => Promise.resolve({ id: 'mock-website-id' })),
  putManagedCmsResourceWebsiteTasks: vi.fn(() => Promise.resolve({ id: 'mock-task-id' })),
}));

mockUseDataApi.mockReturnValue({
  flattenData: [],
  isLoading: false,
  isError: false,
  error: null,
  isSuccess: true,
  isFetching: false,
  status: 'success',
  fetchNextPage: vi.fn(),
  hasNextPage: false,
  isFetchingNextPage: false,
  pageIndex: 0,
  totalCount: 0,
});
export { mockUseDataApi, mockUseInfiniteQuery };
vi.mock('@ovh-ux/manager-react-shell-client', async (importActual) => {
  const actual = await importActual<typeof import('@ovh-ux/manager-react-shell-client')>();
  return {
    ...actual,
    useOvhTracking: vi.fn(() => {
      return {
        trackClick: vi.fn(),
        trackPage: vi.fn(),
        trackCurrentPage: vi.fn(),
      };
    }),
    PageLocation: {
      ...actual.PageLocation,
    },
    ButtonType: {
      ...actual.ButtonType,
    },
  };
});

export const mockInfiniteQueryResult = {
  data: managedWordpressWebsitesMock,
  status: 'success' as const,
  isSuccess: true,
  isError: false,
  error: null,
  isPending: false,
  isLoading: false,
  isLoadingError: false,
  isRefetchError: false,
  isRefetching: false,
  isFetching: false,
  isFetchingNextPage: false,
  isFetchingPreviousPage: false,
  hasNextPage: false,
  hasPreviousPage: false,
  fetchNextPage: vi.fn(),
  fetchPreviousPage: vi.fn(),
  refetch: vi.fn(),
  remove: vi.fn(),
  pages: [
    {
      data: managedWordpressWebsitesMock,
      cursorNext: null,
      status: 200,
    },
  ],
  pageParams: [null],
};

// Don't mock @/data/api/managedWordpress - let it use the mocked @ovh-ux/manager-core-api
// The API functions will use the mocked v2.get, v2.post, etc.

mockUseInfiniteQuery.mockReturnValue(
  mockInfiniteQueryResult as unknown as ReturnType<typeof mockUseInfiniteQuery>,
);

afterEach(() => {
  vi.clearAllMocks();
});

// Mock @ovhcloud/ods-react components for testing
vi.mock('@ovhcloud/ods-react', async (importActual) => {
  const actual = await importActual<typeof import('@ovhcloud/ods-react')>();
  return {
    ...actual,
    Select: ({
      items,
      onChange,
      onValueChange,
      'data-testid': dataTestId,
      id,
      name,
      multiple,
      ...props
    }: React.PropsWithChildren<{
      items?: Array<{ label: string; value: string }>;
      onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
      onValueChange?: (detail: { value: string[] }) => void;
      'data-testid'?: string;
      id?: string;
      name?: string;
      multiple?: boolean;
      [key: string]: unknown;
    }>) => (
      <select
        id={id}
        name={name}
        data-testid={dataTestId}
        multiple={multiple}
        onChange={(e) => {
          if (onValueChange) {
            const selectedValues = multiple
              ? Array.from(e.target.selectedOptions).map((option) => option.value)
              : [e.target.value];
            onValueChange({ value: selectedValues });
          }
          if (onChange) {
            onChange(e);
          }
        }}
        {...props}
      >
        {items?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    ),
    SelectControl: ({ children }: React.PropsWithChildren) => <>{children}</>,
    SelectContent: ({ children }: React.PropsWithChildren) => <>{children}</>,
    RadioGroup: ({ children, ...props }: React.PropsWithChildren) => (
      <div data-testid="radio-group" {...props}>
        {children}
      </div>
    ),
    Radio: ({
      value,
      onChange,
      disabled,
      id,
      'input-id': inputId,
      ...props
    }: React.PropsWithChildren<{
      value?: string;
      onChange?: () => void;
      disabled?: boolean;
      id?: string;
      'input-id'?: string;
      [key: string]: unknown;
    }>) => (
      <div data-testid={`radio-${value}`} {...props}>
        <input
          type="radio"
          id={inputId || id}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    ),
    RadioControl: ({ ...props }: React.PropsWithChildren) => (
      <span data-testid="radio-control" {...props} />
    ),
    RadioLabel: ({ children, ...props }: React.PropsWithChildren) => (
      <label data-testid="radio-label" {...props}>
        {children}
      </label>
    ),
  };
});

// Mock React Router
vi.mock('react-router-dom', async (importActual) => {
  return {
    ...(await importActual<typeof import('react-router-dom')>()),
    useLocation: vi.fn(() => ({
      pathname: '',
      search: '',
    })),
    useResolvedPath: vi.fn(() => ({
      pathname: '',
    })),
    useNavigate: vi.fn(() => navigate),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
    useMatches: vi.fn(() => []),
    useHref: vi.fn<(url: To) => string>((url) =>
      typeof url === 'string' ? url : (url as Path).pathname,
    ),
    useParams: vi.fn(
      () =>
        ({
          serviceName: 'test-service',
          domain: 'test-domain.com',
          path: '/public_html',
        }) as Record<string, string | undefined>,
    ),
  };
});
