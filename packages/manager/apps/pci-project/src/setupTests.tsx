/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';
import { fetch } from 'cross-fetch';
import queryClient from '@/queryClient';

global.fetch = fetch;

// Configuration pour les tests - les warnings sont maintenant corrigés à la source

// Mock PNG assets globally to avoid import issues
vi.mock('@/assets/credit_card.png', () => ({ default: 'credit_card.png' }));
vi.mock('@/assets/paypal.png', () => ({ default: 'paypal.png' }));
vi.mock('@/assets/bank_account.png', () => ({ default: 'bank_account.png' }));
vi.mock('@/assets/sepa_direct_debit.png', () => ({
  default: 'sepa_direct_debit.png',
}));

// Handle unhandled promise rejections in tests to prevent Vitest warnings
const originalUnhandledRejection = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason, promise) => {
  // Check if this is a test-related rejection that we want to suppress
  if (reason instanceof Error && reason.message.includes('Navigation error')) {
    // Silently handle navigation errors in tests
    return;
  }
  // For other unhandled rejections, call the original handlers
  originalUnhandledRejection.forEach((handler) => {
    if (typeof handler === 'function') {
      handler(reason, promise);
    }
  });
});

// Mock react-i18next with improved translation handling
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string, options?: any) => {
      // Handle interpolation for better test coverage
      if (options && typeof options === 'object') {
        return Object.entries(options).reduce(
          (key, [param, value]) => key.replace(`{{${param}}}`, String(value)),
          translationKey,
        );
      }
      return translationKey;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
      languages: ['en', 'fr'],
    },
  }),
}));

// Mock OVH tracking with improved functionality
const trackClickMock = vi.fn();
const trackPageMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackPage: trackPageMock,
    }),
  };
});

// Mock React Router with improved functionality
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    useHref: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
    useParams: () => ({
      projectId: 'test-project-id',
    }),
    useLocation: () => ({
      pathname: '/test',
      search: '',
      hash: '',
      state: null,
    }),
  };
});

// Mock PCI Common with improved components
vi.mock('@ovh-ux/manager-pci-common', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-pci-common') = await importOriginal();
  return {
    ...actual,
    isDiscoveryProject: vi.fn().mockReturnValue(false),
    useProject: () => ({
      data: {
        status: 'ok',
        project_id: 'test-project-id',
        description: 'Test Project',
      },
      isLoading: false,
      error: null,
    }),
    PciTrustedZoneBanner: () => <div data-testid="pci-trusted-zone-banner" />,
    useTrustedZoneBanner: vi.fn().mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
    }),
    useProjectRegions: vi.fn().mockReturnValue({
      data: ['EU', 'US'],
      isLoading: false,
    }),
    useFeatureAvailability: vi.fn().mockReturnValue({
      isFeatureAvailable: vi.fn().mockReturnValue(true),
    }),
  };
});

// Mock Manager React Components with improved ODS 18 support
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...actual,
    // Improved DataGrid components
    DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="text-cell">{children}</div>
    ),
    DatagridColumn: {},
    Datagrid: ({
      children,
      topbar,
      isLoading,
      totalItems,
      hasNextPage,
      onFetchNextPage,
      onSortChange,
      ...props
    }: {
      children?: React.ReactNode;
      topbar?: React.ReactNode;
      isLoading?: boolean;
      totalItems?: number;
      hasNextPage?: boolean;
      onFetchNextPage?: () => void;
      onSortChange?: (sorting: any) => void;
    }) => (
      <div
        data-testid="datagrid"
        data-total-items={totalItems}
        data-has-next-page={hasNextPage}
        {...props}
      >
        {isLoading ? (
          <div data-testid="loading-row" />
        ) : (
          <>
            <div data-testid="layout-topbar">{topbar}</div>
            {children}
          </>
        )}
      </div>
    ),
    // Improved layout components
    BaseLayout: ({
      children,
      header,
      breadcrumb,
      ...props
    }: {
      children: React.ReactNode;
      header?: any;
      breadcrumb?: React.ReactNode;
    }) => (
      <div data-testid="base-layout" {...props}>
        {header && <div data-testid="header">{header.title}</div>}
        {breadcrumb && (
          <div data-testid="breadcrumb-container">{breadcrumb}</div>
        )}
        {children}
      </div>
    ),
    PageLayout: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-testid="page-layout" {...props}>
        {children}
      </div>
    ),
    // Improved navigation components
    useProjectUrl: vi.fn().mockReturnValue('/project-url'),
    useNotifications: vi.fn(() => ({
      addError: vi.fn(),
      addSuccess: vi.fn(),
      addInfo: vi.fn(),
      addWarning: vi.fn(),
    })),
    useFormatDate: vi.fn(({ date, format }) => `formatted_${date}_${format}`),
    useFormattedDate: vi.fn((date) => `formatted_${date}`),
    useDateFnsLocale: vi.fn(() => 'en'),
    // Improved API hooks
    useResourcesV6: vi.fn(),
    useIcebergV2: vi.fn(),
    useIcebergV6: vi.fn(),
    useCatalogPrice: vi.fn(() => ({
      getFormattedCatalogPrice: () => `PRICE`,
      getTextPrice: () => `€10.00`,
    })),
    // Improved user hooks
    useMe: vi.fn(() => ({
      data: { ovhSubsidiary: 'FR' },
      isLoading: false,
    })),
    // Improved breadcrumb
    useBreadcrumb: vi.fn(() => ({
      setBreadcrumb: vi.fn(),
    })),
    // Improved notifications
    Notifications: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="notifications">{children}</div>
    ),
    ErrorBanner: ({ error }: { error: any }) => (
      <div data-testid="error-banner">{error?.message}</div>
    ),
  };
});

// Mock ODS Components with improved ODS 18 support
vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...actual,
    // Improved ODS Button with better event handling
    OdsButton: ({
      label,
      onClick,
      icon,
      variant,
      isDisabled,
      isLoading,
      displayTooltip,
      'data-testid': dataTestId,
      ...props
    }: {
      label?: string;
      onClick?: () => void;
      icon?: string;
      variant?: string;
      isDisabled?: boolean;
      isLoading?: boolean;
      displayTooltip?: boolean;
      'data-testid'?: string;
    }) => {
      // Filtrer les props problématiques
      const { displaytooltip, ...cleanProps } = props as any;

      return (
        <button
          data-testid={dataTestId || 'ods-button'}
          onClick={onClick}
          data-icon={icon}
          data-variant={variant}
          disabled={isDisabled}
          data-loading={isLoading ? 'true' : 'false'}
          data-display-tooltip={displayTooltip ? 'true' : 'false'}
          role="button"
          {...cleanProps}
        >
          {icon && <span className={`icon-${icon}`} />}
          {label}
        </button>
      );
    },
    // Improved ODS Input with better event handling
    OdsInput: ({
      name,
      type,
      value,
      hasError,
      isReadonly,
      onOdsChange,
      maxlength,
      isDisabled,
      'data-testid': dataTestId,
      ...props
    }: {
      name: string;
      type?: string;
      value?: string;
      hasError?: boolean;
      isReadonly?: boolean;
      onOdsChange?: (event: any) => void;
      maxlength?: number;
      isDisabled?: boolean;
      'data-testid'?: string;
    }) => {
      const inputRef = React.useRef<HTMLInputElement>(null);

      React.useEffect(() => {
        const input = inputRef.current;
        if (input && onOdsChange) {
          const handleOdsChange = (event: any) => {
            if (event.type === 'odsChange') {
              onOdsChange(event);
            }
          };
          input.addEventListener('odsChange', handleOdsChange);
          return () => input.removeEventListener('odsChange', handleOdsChange);
        }
        return undefined;
      }, [onOdsChange]);

      // Filtrer les props problématiques
      const { isdisabled, ...cleanProps } = props as any;

      return (
        <input
          ref={inputRef}
          data-testid={dataTestId || 'ods-input'}
          name={name}
          type={type || 'text'}
          value={value}
          data-error={hasError ? 'true' : 'false'}
          data-readonly={isReadonly ? 'true' : 'false'}
          readOnly={isReadonly}
          disabled={isDisabled}
          maxLength={maxlength}
          onChange={(e) => {
            if (onOdsChange) {
              // Simuler l'événement ODS
              const odsEvent = new CustomEvent('odsChange', {
                detail: { value: e.target.value },
              });
              onOdsChange(odsEvent);
            }
          }}
          {...cleanProps}
        />
      );
    },
    // Improved ODS Checkbox
    OdsCheckbox: ({
      isChecked,
      isDisabled,
      isRequired,
      onOdsChange,
      children,
      inputId,
      name,
      'data-testid': dataTestId,
      ...props
    }: {
      inputId: string;
      name: string;
      isChecked?: boolean;
      isDisabled?: boolean;
      isRequired?: boolean;
      onOdsChange?: (event: any) => void;
      children?: React.ReactNode;
      'data-testid'?: string;
    }) => {
      const checkboxRef = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        const checkbox = checkboxRef.current;
        if (checkbox && onOdsChange) {
          const handleOdsChange = (event: any) => {
            if (event.type === 'odsChange') {
              onOdsChange(event);
            }
          };
          checkbox.addEventListener('odsChange', handleOdsChange);
          return () =>
            checkbox.removeEventListener('odsChange', handleOdsChange);
        }
        return undefined;
      }, [onOdsChange]);

      // Filtrer les props problématiques
      const { inputid, ...cleanProps } = props as any;

      return (
        <div
          ref={checkboxRef}
          data-testid={dataTestId || 'ods-checkbox'}
          data-checked={isChecked ? 'true' : 'false'}
          data-disabled={isDisabled ? 'true' : 'false'}
          data-required={isRequired ? 'true' : 'false'}
          data-input-id={inputId}
          data-name={name}
          onClick={() =>
            onOdsChange && onOdsChange({ detail: { checked: !isChecked } })
          }
          {...cleanProps}
        >
          {children}
        </div>
      );
    },
    // Improved ODS Radio
    OdsRadio: ({
      inputId,
      name,
      isChecked,
      isDisabled,
      onOdsChange,
      ...props
    }: {
      inputId: string;
      name: string;
      isChecked?: boolean;
      isDisabled?: boolean;
      onOdsChange?: (event: any) => void;
    }) => {
      const radioRef = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        const radio = radioRef.current;
        if (radio && onOdsChange) {
          const handleOdsChange = (event: any) => {
            if (event.type === 'odsChange') {
              onOdsChange(event);
            }
          };
          radio.addEventListener('odsChange', handleOdsChange);
          return () => radio.removeEventListener('odsChange', handleOdsChange);
        }
        return undefined;
      }, [onOdsChange]);

      return (
        <div
          ref={radioRef}
          data-testid="ods-radio"
          data-input-id={inputId}
          data-name={name}
          data-checked={isChecked ? 'true' : 'false'}
          data-disabled={isDisabled ? 'true' : 'false'}
          onClick={() =>
            onOdsChange && onOdsChange({ detail: { checked: !isChecked } })
          }
          {...props}
        />
      );
    },
    // Improved ODS Modal
    OdsModal: ({
      isOpen,
      children,
      onOdsClose,
      isDismissible,
      'data-testid': dataTestId,
      ...restProps
    }: {
      isOpen: boolean;
      children: React.ReactNode;
      onOdsClose: () => void;
      isDismissible?: boolean;
      'data-testid'?: string;
    }) =>
      isOpen ? (
        <div
          data-testid={dataTestId || 'ods-modal'}
          {...restProps}
          onClick={() => isDismissible && onOdsClose && onOdsClose()}
        >
          {children}
        </div>
      ) : null,
    // Improved ODS Text
    OdsText: ({ children, preset, color, ...props }: any) => (
      <div
        data-testid="ods-text"
        data-preset={preset}
        data-color={color}
        {...props}
      >
        {children}
      </div>
    ),
    // Improved ODS Card
    OdsCard: ({ children, ...props }: any) => (
      <div data-testid="ods-card" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Link
    OdsLink: ({ label, href, ...props }: any) => (
      <a data-testid="ods-link" href={href} {...props}>
        {label}
      </a>
    ),
    // Improved ODS Message
    OdsMessage: ({ children, color, isDismissible, ...props }: any) => (
      <div
        data-testid="ods-message"
        data-color={color}
        data-is-dismissible={isDismissible}
        {...props}
      >
        {children}
      </div>
    ),
    // Improved ODS Spinner
    OdsSpinner: ({ ...props }: any) => (
      <div data-testid="ods-spinner" {...props} />
    ),
    // Improved ODS Skeleton
    OdsSkeleton: ({ ...props }: any) => (
      <div data-testid="ods-skeleton" {...props} />
    ),
    // Improved ODS Badge
    OdsBadge: ({ children, color, label, ...props }: any) => (
      <div data-testid="ods-badge" data-color={color} label={label} {...props}>
        {label || children}
      </div>
    ),
    // Improved ODS Tooltip
    OdsTooltip: ({ children, ...props }: any) => (
      <div data-testid="ods-tooltip" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Popover
    OdsPopover: ({ children, withArrow, triggerId, ...props }: any) => {
      // Filtrer toutes les props problématiques qui pourraient être passées
      const {
        triggerid,
        witharrow,
        'with-arrow': withArrowProp,
        'trigger-id': triggerIdProp,
        ...cleanProps
      } = props as any;

      return (
        <div
          data-testid="ods-popover"
          data-with-arrow={withArrow ? 'true' : 'false'}
          data-trigger-id={triggerId}
          {...cleanProps}
        >
          {children}
        </div>
      );
    },
    // Improved ODS Tabs
    OdsTabs: ({ children, ...props }: any) => (
      <div data-testid="ods-tabs" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Accordion
    OdsAccordion: ({ children, ...props }: any) => (
      <div data-testid="ods-accordion" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Clipboard
    OdsClipboard: ({ children, ...props }: any) => (
      <div data-testid="ods-clipboard" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Pagination
    OdsPagination: ({ children, ...props }: any) => (
      <div data-testid="ods-pagination" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Table
    OdsTable: ({ children, ...props }: any) => (
      <div data-testid="ods-table" {...props}>
        {children}
      </div>
    ),
    // Improved ODS Divider
    OdsDivider: ({ ...props }: any) => (
      <div data-testid="ods-divider" {...props} />
    ),
    // Improved ODS Icon
    OdsIcon: ({ name, ...props }: any) => (
      <span data-testid="ods-icon" data-name={name} {...props} />
    ),
  };
});

// Configuration globale pour les helpers ODS
(global as any).ODS_TEST_CONFIG = {
  defaultTimeout: 5000,
  retryAttempts: 3,
  debugMode: process.env.NODE_ENV === 'test',
};

// Mock TanStack Query pour les tests
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    }),
  };
});

// Mock des utilitaires de test OVH (si disponibles)
(global as any).testHelpers = {
  getOdsButtonByLabel: (label: string) =>
    document.querySelector(`[data-testid="ods-button"]:has-text("${label}")`),
  getOdsInputByTestId: (testId: string) =>
    document.querySelector(`[data-testid="${testId}"]`),
  getOdsModalByTestId: (testId: string) =>
    document.querySelector(`[data-testid="${testId}"]`),
  assertModalVisibility: (visible: boolean) => {
    const modal = document.querySelector('[data-testid="ods-modal"]');
    if (visible) {
      expect(modal).toBeInTheDocument();
    } else {
      expect(modal).not.toBeInTheDocument();
    }
  },
  changeInputValue: (input: Element, value: string) => {
    const event = new Event('input', { bubbles: true });
    Object.defineProperty(event, 'target', { value: { value } });
    input.dispatchEvent(event);
  },
};

// Configuration automatique pour chaque test
beforeEach(() => {
  vi.clearAllMocks();
  queryClient.clear();
});
