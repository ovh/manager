import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { nichandle } from './__mocks__/nichandle';
import { Path, To } from 'react-router-dom';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (translationKey: string) => translationKey,
      i18n: {
        language: 'fr_FR',
        changeLanguage: () => new Promise(() => {}),
      },
    }),
    getI18n: () => ({
      language: (language: string) => language,
    }),
    Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
  };
});

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(),
    useResourcesIcebergV2: vi.fn(),
    useAuthorizationIam: vi.fn(),
  };
});

vi.mock(import('@/domain/utils/dnsUtils'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    computeDisplayNameServers: vi.fn(),
    canSaveNewDnsConfig: vi.fn(),
  };
});
export const navigate = vi.fn();

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
          serviceName: 'serviceName',
          domain: 'domain',
        } as Record<string, string | undefined>),
    ),
  };
});

const mocks = vi.hoisted(() => ({
  shell: {
    navigation: {
      getURL: (_: unknown, path: string): Promise<string> => {
        return new Promise<string>((resolve) => {
          return resolve(`https://ovh.test/#${path}`);
        });
      },
    },
  },
  environment: {
    getRegion: vi.fn(() => 'EU'),
    getUserLocale: vi.fn(() => 'fr_FR'),
    getUser: vi.fn(() => {
      return { ovhSubsidiary: 'FR' };
    }),
  },
}));
const trackClickMock = vi.fn();
export const mockAddError = vi.fn();
export const mockAddSuccess = vi.fn();
export const mockClearNotifications = vi.fn();

vi.mock('@ovh-ux/manager-react-components', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-components');
  
  type ManagerTileItemComponent = React.FC<{ children?: React.ReactNode }> & {
    Label: React.FC<{ children?: React.ReactNode }>;
  };
  const ManagerTileItem: ManagerTileItemComponent = Object.assign(
    ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="manager-tile-item">{children}</div>
    ),
    {
      Label: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="tile-label">{children}</div>
      ),
      Description: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="tile-description">{children}</div>
      ),
    },
  );

  return {
    ...actual,
    BaseLayout: ({
      children,
      header,
      message,
      tabs,
    }: {
      children: React.ReactNode;
      header?: {
        title: string;
        changelogButton?: React.ReactNode;
        headerButton?: React.ReactNode;
      };
      message?: React.ReactNode;
      tabs?: React.ReactNode;
    }) => (
      <div data-testid="base-layout">
        {header && (
          <div data-testid="header">
            <h1 data-testid="title">{header.title}</h1>
            {header.changelogButton}
            {header.headerButton}
          </div>
        )}
        {tabs}
        {message}
        {children}
      </div>
    ),
    ErrorBanner: ({ error }: { error: { data: { message: string } } }) => (
      <div data-testid="error-banner">{error.data.message}</div>
    ),
    useNotifications: () => ({
      notifications: [] as Array<{ id: string; message: string }>,
      addError: mockAddError,
      addSuccess: mockAddSuccess,
      clearNotifications: mockClearNotifications,
    }),
    Notifications: () => <div data-testid="notifications">Notifications</div>,
    ChangelogButton: () => <div data-testid="changelog-button">Changelog</div>,
          ActionMenu: ({ id, items, isCompact, ...props }: React.PropsWithChildren<{ id: string; items: Array<{ id: number; label: string; onClick?: () => void; href?: string; target?: string; isDisabled?: boolean; 'data-testid'?: string; [key: string]: unknown }>; isCompact?: boolean; [key: string]: unknown }>) => (
            <div data-testid={id} {...props}>
              {items.map((item) => {
                const { id: itemId, label, onClick, href, target, isDisabled, 'data-testid': dataTestId, ...itemProps } = item;
                if (href) {
                  const defaultTestId = isCompact 
                    ? 'navigation-action-trigger-action-popover' 
                    : 'navigation-action-trigger-action';
                  return (
                    <a
                      key={itemId}
                      data-testid={dataTestId || defaultTestId}
                      href={href}
                      target={target}
                      {...itemProps}
                    >
                      {label}
                    </a>
                  );
                }
                return (
                  <button
                    key={itemId}
                    data-testid={dataTestId || `action-item-${itemId}`}
                    onClick={onClick}
                    disabled={isDisabled}
                    {...itemProps}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ),
    ManagerTile: Object.assign(
      ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="manager-tile">{children}</div>
      ),
      {
        Item: ManagerTileItem,
        Label: ({ children }: { children?: React.ReactNode }) => (
          <div data-testid="tile-label">{children}</div>
        ),
        Title: ({ children }: { children?: React.ReactNode }) => (
          <h2 data-testid="manager-tile-title">{children}</h2>
        ),
        Divider: () => <hr data-testid="manager-tile-divider" />,
      },
    ),
    
    DataGridTextCell: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="datagrid-text-cell">{children}</div>
    ),
    Modal: ({
      isOpen,
      heading,
      primaryLabel,
      secondaryLabel,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      children,
      isLoading,
      type,
    }: {
      isOpen?: boolean;
      heading?: string;
      primaryLabel?: string;
      secondaryLabel?: string;
      onPrimaryButtonClick?: () => void;
      onSecondaryButtonClick?: () => void;
      children?: React.ReactNode;
      isLoading?: boolean;
      type?: string;
    }) => {
      if (isOpen === false) {
        return null;
      }
      return (
        <div data-testid="modal" data-loading={isLoading ? '' : undefined} data-type={type}>
          {heading && <h1>{heading}</h1>}
          {secondaryLabel && (
            <button onClick={onSecondaryButtonClick}>{secondaryLabel}</button>
          )}
          {primaryLabel && (
            <button onClick={onPrimaryButtonClick}>{primaryLabel}</button>
          )}
          {children}
        </div>
      );
    },
    Drawer: ({
      isOpen,
      heading,
      primaryButtonLabel,
      secondaryButtonLabel,
      onPrimaryButtonClick,
      onSecondaryButtonClick,
      children,
      isPrimaryButtonDisabled,
      isPrimaryButtonLoading,
      onDismiss,
      'data-testid': testId,
    }: {
      isOpen: boolean;
      heading: string;
      primaryButtonLabel: string;
      secondaryButtonLabel: string;
      onPrimaryButtonClick: () => void;
      onSecondaryButtonClick: () => void;
      children?: React.ReactNode;
      isPrimaryButtonDisabled?: boolean;
      isPrimaryButtonLoading?: boolean;
      onDismiss?: () => void;
      'data-testid'?: string;
    }) =>
      isOpen ? (
        <div data-testid={testId || 'drawer'}>
          <h1>{heading}</h1>
          {secondaryButtonLabel && (
            <button onClick={onSecondaryButtonClick || onDismiss}>
              {secondaryButtonLabel}
            </button>
          )}
          {primaryButtonLabel && (
            <button
              onClick={onPrimaryButtonClick}
              disabled={isPrimaryButtonDisabled || isPrimaryButtonLoading}
              data-testid="drawer-primary-button"
            >
              {primaryButtonLabel}
            </button>
          )}
          {children}
        </div>
      ) : null,
    TagsList: ({ tags }: { tags: Record<string, string> }) => (
      <div data-testid="tags-list">
        {Object.entries(tags).map(([key, value]) => (
          <span key={key} data-testid={`tag-${key}`}>
            {key}: {value}
          </span>
        ))}
      </div>
    ),
  };
});

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    Datagrid: ({
      data,
      children,
      isLoading,
      columns,
      topbar,
      rowSelection,
      expandable,
      ...props
    }: {
      children?: React.ReactNode;
      data: Array<Record<string, unknown>>;
      columns?: Array<{
        id: string;
        header?: React.ReactNode;
        accessorKey?: string;
        cell?: (props: { row: { original: Record<string, unknown> } }) => React.ReactNode;
      }>;
      topbar?: React.ReactNode;
      isLoading?: boolean;
      expandable?: {
        expanded: Record<string, boolean>;
        setExpanded: (state: Record<string, boolean>) => void;
        getRowCanExpand: (row: { original: unknown }) => boolean;
      };
      rowSelection?: {
        rowSelection: Record<string, boolean>;
        setRowSelection: (selection: Record<string, boolean>) => void;
      };
      [key: string]: unknown;

    }) => {
      const getSelectionState = () => rowSelection?.rowSelection ?? {};
      const toggleRowSelection = (rowId: string) => {
        const setter = rowSelection?.setRowSelection;
        if (!setter) return;
        const selectionState = getSelectionState();
        const isSelected = Boolean(selectionState[rowId]);
        const updatedSelection = { ...selectionState };
        if (isSelected) {
          delete updatedSelection[rowId];
        } else {
          updatedSelection[rowId] = true;
        }
        setter(updatedSelection);
      };
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
        const rowData = row as { subRows?: unknown[]; id?: string };
        const rowKey = isSubRow
          ? `subrow-${parentIndex}-${index}`
          : rowData.id
          ? `row-${rowData.id}`
          : `row-${index}`;
        const hasSubRows = rowData?.subRows && rowData.subRows.length > 0;
        const shouldExpand = hasSubRows && expandable?.getRowCanExpand({ original: row }) !== false;

        const rowId = rowData.id ?? `row-${index}`;
        const rowTestId = isSubRow
          ? `datagrid-subrow-${parentIndex}-${index}`
          : `datagrid-row-${rowId}`;
        const isSelected = Boolean(getSelectionState()[rowId]);
        return (
          <React.Fragment key={rowKey}>
            <div data-testid={rowTestId}>
              {!!rowSelection && (
                <label>
                  <input
                    type="checkbox"
                    data-testid={`checkbox-${rowId}`}
                    checked={isSelected}
                    onChange={() => toggleRowSelection(rowId)}
                  />
                </label>
              )}
              {Array.isArray(columns) &&
                columns.map((col) =>
                  renderCell(
                    col as {
                      id: string;
                      cell?: (context: {
                        row: { original: unknown };
                        getValue: () => unknown;
                      }) => React.ReactNode;
                      accessorFn?: (row: unknown) => unknown;
                    },
                    row,
                  ),
                )}
            </div>
            {shouldExpand &&
              Array.isArray(rowData.subRows) &&
              rowData.subRows.map((subRow, subIndex) =>
                renderRow(subRow, subIndex, true, index),
              )}
          </React.Fragment>
        );
      };

      return (
        <div data-testid="datagrid" {...props}>
          {isLoading && <div data-testid="datagrid-loading">Loading</div>}
          <div data-testid="datagrid-content">
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
              <div data-testid="datagrid-rows">
                {data.map((row, index) => renderRow(row, index))}
              </div>
            )}
            {children}
          </div>
        </div>
      );
  },
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
    CellRow: ({
      children,
      'data-testid': testId,
      type,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
      type?: string;
    }) => <div data-testid={testId || 'cell-row'} data-type={type}>{children}</div>,
  };
});
let currentDrawerContext: {
  onOpenChange?: (detail: { open: boolean }) => void;
  closeOnInteractOutside?: boolean;
} = {};

vi.mock('@ovhcloud/ods-react', async () => {
  const actual = await vi.importActual('@ovhcloud/ods-react');
  
  const CheckboxControlComponent = ({ 'data-testid': testId, 'data-state': state, ...props }: { 'data-testid'?: string; 'data-state'?: string; [key: string]: unknown }) => {
    const finalState = state || 'unchecked';
    return <div data-testid={testId || 'checkbox-control'} data-state={finalState} {...props} />;
  };
  
  return {
    ...actual,
    ModalOpenChangeDetail: {},
    Modal: ({
      children,
      open,
      onOpenChange,
    }: {
      children: React.ReactNode;
      open: boolean;
      onOpenChange?: (detail: { open: boolean }) => void;
    }) => (
      open ? (
        <div
          data-testid="modal"
          data-open={open}
          role="dialog"
          onClick={() => onOpenChange?.({ open: false })}
        >
          {children}
        </div>
      ) : null
    ),
    ModalContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="modal-content">{children}</div>
    ),
    ModalBody: ({
      children,
      style,
    }: {
      children: React.ReactNode;
      style?: React.CSSProperties;
    }) => (
      <div data-testid="modal-body" style={style}>
        {children}
      </div>
    ),
    Drawer: ({
      children,
      open,
      onOpenChange,
      closeOnInteractOutside,
      closeOnEscape,
      ...props
    }: {
      children: React.ReactNode;
      open: boolean;
      onOpenChange?: (detail: { open: boolean }) => void;
      closeOnInteractOutside?: boolean;
      closeOnEscape?: boolean;
      [key: string]: unknown;
    }) => {
      currentDrawerContext = { onOpenChange, closeOnInteractOutside };
      const { closeOnEscape: _, ...filteredProps } = props;
      return open ? (
        <div
          data-testid="drawer"
          data-open={open}
          onClick={(e) => {
            if (onOpenChange && e.target === e.currentTarget) {
              onOpenChange({ open: false });
            }
          }}
          {...filteredProps}
        >
          {typeof onOpenChange === 'function' && (
            <button
              data-testid="drawer-close-trigger"
              onClick={() => onOpenChange({ open: false })}
            >
              Close Drawer
            </button>
          )}
          {children}
        </div>
      ) : null;
    },
    DrawerContent: ({
      children,
      position,
      className,
    }: {
      children: React.ReactNode;
      position?: string;
      className?: string;
    }) => (
      <div
        data-testid="drawer-content"
        data-position={position}
        className={className}
      >
        {children}
      </div>
    ),
    DrawerBody: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div data-testid="drawer-body" className={className}>
        {children}
      </div>
    ),
    Button: ({
      children,
      onClick,
      disabled,
      loading,
      variant,
      color,
      ...props
    }: {
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      loading?: boolean;
      variant?: string;
      color?: string;
      [key: string]: unknown;
    }) => {
      const explicitTestId = (props as { 'data-testid'?: string })['data-testid'];
     
      const testId = explicitTestId || 'button';
      const isDisabled = disabled || loading;
      
      const handleClick = () => {
        if (!isDisabled) {
          onClick?.();
          if (currentDrawerContext.closeOnInteractOutside && currentDrawerContext.onOpenChange) {
            currentDrawerContext.onOpenChange({ open: false });
          }
        }
      };
      
      return (
        <button
          data-testid={testId}
          data-variant={variant}
          data-color={color}
          className={color ? `button-${color}` : variant ? `button-${variant}` : undefined}
          onClick={handleClick}
          disabled={isDisabled}
        >
          {children}
        </button>
      );
    },
    Card: ({ children, className, 'data-testid': testId, ...props }: { children: React.ReactNode; className?: string; 'data-testid'?: string; [key: string]: unknown }) => (
      <div data-testid={testId || 'card'} className={className} {...props}>
        {children}
      </div>
    ),
    Checkbox: ({
      children,
      onCheckedChange,
      checked,
      disabled,
      'data-testid': testId,
      ...props
    }: {
      children?: React.ReactNode;
      onCheckedChange?: (detail: { checked: boolean }) => void;
      checked?: boolean;
      disabled?: boolean;
      'data-testid'?: string;
      [key: string]: unknown;
    }) => {
      const checkboxChecked = checked;
      const checkboxState = checkboxChecked ? 'checked' : 'unchecked';
      return (
        <div
          data-testid={testId || 'checkbox'}
          data-checked={checkboxChecked}
          data-state={checkboxState}
          data-disabled={disabled ? '' : undefined}
          {...props}
        >
          <input
            type="checkbox"
            onChange={(e) => onCheckedChange?.({ checked: e.target.checked })}
            checked={checked}
            disabled={disabled}
            data-testid="checkbox-input"
          />
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const childProps = child.props as { 'data-testid'?: string };
              const childTestId = childProps['data-testid'];
              if (childTestId?.includes('checkbox') && childTestId?.includes('control')) {
                return React.cloneElement(child as React.ReactElement, {
                  'data-state': checkboxState,
                });
              }
            }
            return child;
          })}
        </div>
      );
    },
    CheckboxControl: CheckboxControlComponent,
    CheckboxLabel: ({ children }: { children: React.ReactNode }) => (
      <label data-testid="checkbox-label">{children}</label>
    ),
    Badge: ({ children, color, 'data-testid': testId }: { children: React.ReactNode; color?: string; 'data-testid'?: string }) => (
      <span data-testid={testId || 'badge'} data-color={color}>
        {children}
      </span>
    ),
    Icon: (props: { name: string; 'data-testid'?: string; className?: string; [key: string]: unknown }) => {
      const { name, 'data-testid': testId, className, ...restProps } = props;
      const explicitTestId = testId !== undefined ? testId : `icon-${name}`;
      return <span data-testid={explicitTestId} className={className} {...restProps} />;
    },
    Spinner: ({ size }: { size?: string }) => (
      <div data-testid="spinner" role="progressbar" aria-label="Loading">
        Loading...
      </div>
    ),
    ProgressBar: ({ value, max }: { value: number; max: number }) => (
      <div data-testid="progress-bar" data-value={value} data-max={max} />
    ),
    Message: ({
      children,
      color,
      dismissible,
      ...props
    }: {
      children: React.ReactNode;
      color?: string;
      dismissible?: boolean;
      [key: string]: unknown;
    }) => {
      const explicitTestId = (props as { 'data-testid'?: string })['data-testid'];
   
      const testId = explicitTestId || 'message';

      return (
        <div
          data-testid={testId}
          data-message-color={color ? `message-${color}` : undefined}
          data-color={color}
          data-dismissible={dismissible !== undefined ? String(dismissible) : undefined}
          className="message"
        >
          {children}
        </div>
      );
    },
    MessageBody: ({ children, 'data-testid': testId, ...props }: { children: React.ReactNode; 'data-testid'?: string; [key: string]: unknown }) => (
      <div data-testid={testId || 'message-body'} {...props}>
        {children}
      </div>
    ),
    Link: ({
      children,
      href,
      onClick,
      download,
      ...props
    }: {
      children?: React.ReactNode;
      href?: string;
      onClick?: () => void;
      download?: string | boolean;
      [key: string]: unknown;
    }) => {
      const explicitTestId = (props as { 'data-testid'?: string })['data-testid'];
      let testId = explicitTestId;
      if (!testId) {
        if (download !== undefined) {
          testId = 'download-link';
        } else if (href?.includes('/hosting/')) {
          testId = 'hosting-link';
        } else {
          testId = 'link';
        }
      }
      return (
        <a data-testid={testId} href={href} onClick={onClick} download={download}>
          {children}
        </a>
      );
    },
    MessageIcon: ({ name }: { name: string }) => (
      <span data-testid={`message-icon-${name}`} />
    ),
    Text: ({
      children,
      preset,
      className,
      ...props
    }: {
      children: React.ReactNode;
      preset?: string;
      className?: string;
      [key: string]: unknown;
    }) => (
      <span data-testid="text" data-preset={preset} className={className} {...props}>
        {children}
      </span>
    ),
    Toggle: ({
      children,
      checked,
      onCheckedChange,
      disabled,
      'data-testid': testId,
      ...props
    }: {
      children?: React.ReactNode;
      checked?: boolean;
      onCheckedChange?: () => void;
      disabled?: boolean;
      'data-testid'?: string;
      [key: string]: unknown;
    }) => (
      <label
        data-testid={testId || 'toggle'}
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        <input
          type="checkbox"
          role="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={() => onCheckedChange?.()}
          aria-label={props['aria-label'] as string}
        />
        {children}
      </label>
    ),
    ToggleControl: ({ 'data-testid': testId, ...props }: { 'data-testid'?: string; [key: string]: unknown }) => (
      <span data-testid={testId || 'toggle-control'} {...props} />
    ),
    ToggleLabel: ({ children }: { children: React.ReactNode }) => (
      <span data-testid="toggle-label">{children}</span>
    ),
    Skeleton: ({ 'data-testid': testId, ...props }: { 'data-testid'?: string; [key: string]: unknown }) => (
      <div data-testid={testId || 'skeleton'} data-ods="skeleton" {...props} />
    ),
    Tooltip: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip">{children}</div>
    ),
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip-trigger">{children}</div>
    ),
    TooltipContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tooltip-content">{children}</div>
    ),
    BADGE_COLOR: {
      alpha: 'alpha',
      beta: 'beta',
      critical: 'critical',
      information: 'information',
      neutral: 'neutral',
      success: 'success',
      warning: 'warning',
    },
    ICON_NAME: {
      arrowRight: 'arrow-right',
      circleQuestion: 'circle-question',
      WARNING_TRIANGLE_FILL: 'warning-triangle-fill',
      externalLink: 'external-link',
    },
    TEXT_PRESET: {
      heading2: 'heading2',
      heading3: 'heading3',
      heading4: 'heading4',
      heading5: 'heading5',
      paragraph: 'paragraph',
    },
    DRAWER_POSITION: {
      right: 'right',
    },
    MESSAGE_COLOR: {
      information: 'information',
      warning: 'warning',
    },
    Tab: ({
      children,
      value,
      disabled,
      'data-testid': testId,
      ...props
    }: {
      children: React.ReactNode;
      value: string;
      disabled?: boolean;
      'data-testid'?: string;
      [key: string]: unknown;
    }) => (
      <button
        data-testid={testId}
        data-value={value}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    ),
    TabList: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="tab-list">{children}</div>
    ),
    Tabs: ({
      children,
      value,
      defaultValue,
      onValueChange,
    }: {
      children: React.ReactNode;
      value?: string;
      defaultValue?: string;
      onValueChange?: (event: { value: string }) => void;
    }) => (
      <div data-testid="tabs" data-value={value || defaultValue}>
        {children}
      </div>
    ),
    TabContent: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => (
      <div data-testid={`tab-content-${value}`}>{children}</div>
    ),
    Select: ({
      children,
      items,
      value,
      onValueChange,
      id,
    }: {
      children: React.ReactNode;
      items?: Array<{ label: string; value: string }>;
      value?: string[];
      onValueChange?: (detail: { value: string[] }) => void;
      id?: string;
    }) => {
      const selectId = id || 'default';
      const selectContextRef = React.useRef({ onValueChange, items });
      selectContextRef.current = { onValueChange, items };
      
      return (
        <div data-testid={`select-${selectId}`} data-value={value?.[0]} data-select-context={selectId}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement, {
                'data-select-id': selectId,
                selectOnValueChange: onValueChange,
                selectItems: items,
              });
            }
            return child;
          })}
          {items?.map((item) => (
            <div key={item.value} data-value={item.value}>
              {item.label}
            </div>
          ))}
        </div>
      );
    },
    SelectControl: ({
      children,
      'data-select-id': selectId,
      selectOnValueChange,
      selectItems,
      ...props
    }: {
      children?: React.ReactNode;
      'data-select-id'?: string;
      selectOnValueChange?: (detail: { value: string[] }) => void;
      selectItems?: Array<{ label: string; value: string }>;
      [key: string]: unknown;
    }) => {
      const onValueChange = selectOnValueChange || (selectId ? (window as any)[`select-${selectId}-onValueChange`] : undefined);
      const items = selectItems || (selectId ? (window as any)[`select-${selectId}-items`] : undefined);
      
      if (selectId && onValueChange) {
        (window as any)[`select-${selectId}-onValueChange`] = onValueChange;
      }
      if (selectId && items) {
        (window as any)[`select-${selectId}-items`] = items;
      }
      
      return (
        <button
          data-testid="select-control"
          onClick={() => {
            if (items && items.length > 0 && onValueChange) {
              onValueChange({ value: [items[0].value] });
            }
          }}
          {...props}
        >
          {children}
        </button>
      );
    },
    SelectContent: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="select-content" {...props}>
        {children}
      </div>
    ),
    FormField: ({
      children,
      invalid,
      ...props
    }: {
      children: React.ReactNode;
      invalid?: boolean;
      [key: string]: unknown;
    }) => (
      <div data-testid="form-field" data-invalid={invalid ? '' : undefined} {...props}>
        {children}
      </div>
    ),
    FormFieldLabel: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <label data-testid="form-field-label" {...props}>
        {children}
      </label>
    ),
    FormFieldError: ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }) => {

      const hasContent = children != null && String(children) !== 'undefined' && String(children).trim() !== '';
      return (
        <div data-testid="form-field-error" className={className} {...props}>
          {hasContent && (
            <span aria-live="polite" data-ods="form-field-error">
              {children}
            </span>
          )}
        </div>
      );
    },
    Input: React.forwardRef<HTMLInputElement, {
      name?: string;
      type?: string;
      placeholder?: string;
      readOnly?: boolean;
      value?: string | number;
      defaultValue?: string | number;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
      className?: string;
      loading?: boolean;
      [key: string]: unknown;
    }>((props, ref) => {
      const {
        name: propName,
        type,
        placeholder,
        readOnly,
        value: propValue,
        defaultValue,
        onChange: propOnChange,
        onBlur: propOnBlur,
        className,
        loading,
        ...restProps
      } = props;
    
      const registerValue = (restProps as { value?: string | number }).value;
      const registerOnChange = (restProps as {
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }).onChange;
      const registerOnBlur = (restProps as {
        onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
      }).onBlur;
      const registerName = (restProps as { name?: string }).name;
    
      const finalValue =
        propValue ?? registerValue ?? defaultValue ?? '';
      const isControlled = propValue !== undefined;
      const finalOnChange = registerOnChange || propOnChange;
      const finalOnBlur = registerOnBlur || propOnBlur;
      const finalName = registerName || propName;
    
      const { value: _, onChange: __, onBlur: ___, name: ____, ...cleanRestProps } =
        restProps;
    
      const inputType = type || 'text';
      const isTextInput =
        inputType === 'text' ||
        inputType === 'email' ||
        inputType === 'password';
    
      return (
        <input
          ref={ref}
          data-testid="input"
          name={finalName}
          type={inputType}
          placeholder={placeholder}
          readOnly={readOnly}
          value={isControlled ? String(propValue) : undefined}
          onChange={finalOnChange}
          onBlur={finalOnBlur}
          className={className}
          aria-busy={loading ? 'true' : undefined}
          role={isTextInput ? 'textbox' : undefined}
          {...cleanRestProps}
        />
      );
    }),
    Textarea: React.forwardRef<
    HTMLTextAreaElement,
    {
      name?: string;
      placeholder?: string;
      readOnly?: boolean;
      value?: string;
      defaultValue?: string;
      onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
      className?: string;
      [key: string]: unknown;
    }
  >((props, ref) => {
    const {
      name: propName,
      placeholder,
      readOnly,
      value: propValue,
      defaultValue,
      onChange: propOnChange,
      onBlur: propOnBlur,
      className,
      ...restProps
    } = props;
  
    const registerValue = (restProps as { value?: string }).value;
    const registerOnChange = (restProps as {
      onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }).onChange;
    const registerOnBlur = (restProps as {
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    }).onBlur;
    const registerName = (restProps as { name?: string }).name;
  
    const finalName = registerName || propName;
    const finalOnChange = registerOnChange || propOnChange;
    const finalOnBlur = registerOnBlur || propOnBlur;
  
    const isControlled = propValue !== undefined;
  
    const { value: _, onChange: __, onBlur: ___, name: ____, ...cleanRest } =
      restProps;
  
    return (
      <textarea
        ref={ref}
        data-testid="textarea"
        name={finalName}
        placeholder={placeholder}
        readOnly={readOnly}
        defaultValue={defaultValue}
        value={isControlled ? String(propValue) : undefined}
        onChange={finalOnChange}
        onBlur={finalOnBlur}
        className={className}
        role="textbox"
        {...cleanRest}
      />
    );
    }),
  };
});
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useContext: vi.fn(),
  ShellContext: React.createContext({
    shell: mocks.shell,
    environment: mocks.environment,
  }),
  useOvhTracking: () => ({ trackClick: trackClickMock }),
  useNavigationGetUrl: vi.fn((
    linkParams: [string, string, unknown],
  ): UseQueryResult<unknown, Error> => {
    return {
      data: `https://ovh.test/#/${linkParams[0]}${linkParams[1]}`,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as UseQueryResult<unknown, Error>;
  }),
  useNavigation: () => ({
    navigateTo: vi.fn(),
  }),
}));

vi.mock('@/common/hooks/nichandle/useNichandleInformation', () => ({
  useNichandleInformation: vi.fn(() => {
    return {
      nichandleInformation: nichandle,
    };
  }),
}));

// Note: useGetServiceInformation is NOT mocked here to allow individual tests to mock it as needed

vi.mock('@ovh-ux/manager-module-order', () => {
  return {
    getExpressOrderURL: () => 'https://order.eu.ovhcloud.com/fr',
    getOrderURL: () => 'https://order.eu.ovhcloud.com/fr',
  };
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock window.open for tests
vi.stubGlobal('open', vi.fn());

// Add a fake close() method because jsdom doesn't support HTMLDialogElement.
// Without this mock, components using <dialog> (like the ODS Drawer) would crash during tests.
Object.defineProperty(global.HTMLDialogElement.prototype, 'close', {
  value: vi.fn(),
});

// Filter out noisy logs from i18next translation loading
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.info = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress translation/jsdom loading logs
  if (
    message.includes('Loading fallback language') ||
    message.includes('namespace:') ||
    message.includes('Language changed to')
  ) {
    return;
  }
  originalConsoleInfo(...args);
};

console.log = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress translation change logs
  if (message.includes('Language changed to:')) {
    return;
  }
  originalConsoleLog(...args);
};

console.warn = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress translation fallback warnings
  if (
    message.includes('Could not load') &&
    message.includes('Will fallback to')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

console.error = (...args: unknown[]) => {
  const message = args.join(' ');
  // Suppress XMLHttpRequest AggregateError from jsdom
  if (message.includes('AggregateError') || message.includes('xhr-utils')) {
    return;
  }
  originalConsoleError(...args);
};
