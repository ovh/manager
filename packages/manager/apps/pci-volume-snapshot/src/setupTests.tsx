import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { OdsInputChangeEvent } from '@ovhcloud/ods-components';
import { vi } from 'vitest';
import React from 'react';

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useSearchParams: vi.fn(() => [
      new URLSearchParams({ snapshotId: 'test-snapshot-id' }),
    ]),
    useParams: () => ({
      projectId: 'project-id',
      snapshotId: 'snapshot-id',
      kubeId: 'kube-id',
    }),
    useHref: vi.fn().mockImplementation((to: string) => to),
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
    Navigate: () => null,
    Outlet: vi.fn(() => 'Outlet'),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useProject: vi.fn().mockResolvedValue({
      projectName: 'project-name',
      project_id: 'project-id',
      data: { description: 'Test Project' },
    }),
    PciAnnouncementBanner: () => (
      <div data-testid="announcement-banner">Announcement Banner</div>
    ),
  };
});

vi.mock('@ovh-ux/manager-react-components', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-components');
  return {
    ...mod,
    useProjectUrl: vi.fn().mockReturnValue('mockProjectUrl'),
    useDatagridSearchParams: () => ({
      pagination: vi.fn(),
      setPagination: vi.fn(),
      sorting: vi.fn(),
      setSorting: vi.fn(),
    }),
    PciGuidesHeader: vi.fn(() => <div></div>),
    ChangelogButton: () => <div></div>,
    RedirectionGuard: ({
      children,
      condition,
    }: {
      children: React.ReactNode;
      condition: boolean;
    }) => (condition ? <div>Redirected</div> : <div>{children}</div>),
    Notifications: vi
      .fn()
      .mockReturnValue(<div data-testid="notifications"></div>),
    useNotifications: vi.fn(() => ({
      addError: vi.fn(),
      addSuccess: vi.fn(),
    })),
    useTranslatedMicroRegions: vi.fn(() => ({
      translateMicroRegion: (codeRegion: string) => `Coruscant (${codeRegion})`,
    })),
    convertHourlyPriceToMonthly: vi.fn(() => 2),
    useCatalogPrice: vi.fn(() => ({
      getFormattedCatalogPrice: () => `PRICE`,
    })),
  };
});

vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
  const actual = (await importOriginal()) || {};
  return {
    ...(typeof actual === 'object' && actual !== null ? actual : {}),
    OdsButton: ({
      label,
      icon,
      isDisabled,
      onClick,
      className,
      'data-testid': dataTestId,
    }: {
      label: string;
      icon: string;
      isDisabled: string | boolean;
      onClick: () => void;
      className: string;
      'data-testid': string;
    }) => (
      <button
        type="button"
        className={className}
        disabled={isDisabled === 'true' || isDisabled === true}
        onClick={onClick}
        data-testid={dataTestId}
      >
        {icon && <span className={`icon-${icon}`} />}
        {label}
      </button>
    ),
    OdsInput: ({
      name,
      value,
      onOdsChange,
      onKeyDown,
      className,
      'data-testid': dataTestId,
    }: {
      name: string;
      value: string;
      onOdsChange: (e: Partial<OdsInputChangeEvent>) => void;
      onKeyDown: () => void;
      className: string;
      'data-testid': string;
    }) => (
      <input
        type="text"
        name={name}
        className={className}
        value={value}
        onChange={(e) => {
          onOdsChange?.({
            detail: {
              value: e.target.value,
              name,
            },
            stopPropagation: () => {},
            preventDefault: () => {},
          });
        }}
        onKeyDown={onKeyDown}
        data-testid={dataTestId}
      />
    ),
    OdsSelect: ({
      name,
      value,
      onOdsChange,
      children,
      'data-testid': dataTestId,
    }: {
      name: string;
      value: string;
      children: React.ReactNode;
      onOdsChange: (e: Partial<OdsInputChangeEvent>) => void;
      'data-testid': string;
    }) => (
      <select
        name={name}
        value={value}
        onChange={(e) => {
          onOdsChange?.({
            detail: { value: e.target.value, name },
            stopPropagation: () => {},
            preventDefault: () => {},
          });
        }}
        data-testid={dataTestId}
      >
        {children}
      </select>
    ),
    OdsBadge: ({
      color,
      label,
      'data-testid': testId,
    }: {
      color: string;
      label: string;
      'data-testid': string;
    }) => (
      <div data-testid={testId} data-color={color}>
        {label}
      </div>
    ),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      exists: () => true,
      language: 'en-US',
    },
  }),
  Trans: vi.fn(({ children }: { children: string }) => children),
  Translation: vi.fn(({ children }) => children((key: string) => key)),
}));

vi.mock('date-fns', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    format: vi.fn((date, formatStr, options) => {
      // Simple mock implementation
      const locale = options?.locale?.code || 'en';
      const dateObj = new Date(date);

      // Return a predictable format for testing
      if (formatStr === 'PPpp') {
        return `${dateObj.toLocaleDateString()}, ${dateObj.toLocaleTimeString()} (${locale})`;
      }
      if (formatStr === 'P p') {
        return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()} (${locale})`;
      }
      return `${dateObj.toISOString()} (${formatStr}) (${locale})`;
    }),
  };
});

vi.mock('date-fns/locale', () => ({
  enUS: { code: 'en' },
  enGB: { code: 'en-GB' },
  fr: { code: 'fr' },
  frCA: { code: 'fr-CA' },
  de: { code: 'de' },
  es: { code: 'es' },
  it: { code: 'it' },
  pl: { code: 'pl' },
  pt: { code: 'pt' },
}));

vi.mock('@ovh-ux/manager-core-utils', () => ({
  getDateFnsLocale: (language: string) => {
    const localeMap: Record<string, string> = {
      'en-US': 'enUS',
      'fr-FR': 'fr',
      'de-DE': 'de',
      'es-ES': 'es',
    };
    return localeMap[language] || 'enUS';
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return {
    ...mod,
    useTracking: vi.fn(() => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    })),
    useOvhTracking: vi.fn(() => ({
      trackCurrentPage: vi.fn(),
      trackPage: vi.fn(),
      trackClick: vi.fn(),
    })),
  };
});

vi.mock('@ovh-ux/manager-core-api', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...mod,
    fetchIcebergV6: vi.fn(),
    v6: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});
