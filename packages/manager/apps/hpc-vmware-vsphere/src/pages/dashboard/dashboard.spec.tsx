import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './index';
import appConfig from '@/hpc-vmware-vsphere.config';

const queryClient = new QueryClient();

const { legacyApplication, legacyPath, dedicatedCloudTitle } = appConfig;

const legacyAppBaseUrl = `https://www.ovh.com/#/${legacyApplication}/${legacyPath}`;
const service = {
  name: 'pcc-xxx',
  description: 'Dsdfsdfqsd_anusha_2 dd',
};

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const module = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...module,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
    GuideButton: vi.fn().mockReturnValue(<div></div>),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const module = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...module,
    useParams: () => ({ serviceName: service.name }),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const module: any = await importOriginal();
  return {
    ...module,
    useNavigationGetUrl: vi.fn(() => {
      return {
        data: legacyAppBaseUrl,
      };
    }),
  };
});

vi.mock('@/hooks/useActivePanel', () => ({
  useActivePanel: vi.fn(() => ({
    name: 'logs',
    title: 'tabs_label_logs',
    to: '/logs',
    isRedirectLegacy: false,
  })),
}));

vi.mock('@/hooks/breadcrumb/useHybridBreadcrumb', () => ({
  useHybridBreadcrumb: vi.fn(() => {
    return [
      {
        label: dedicatedCloudTitle,
        href: legacyAppBaseUrl,
      },
      {
        label: service.description,
        href: `${legacyAppBaseUrl}/${service.name}`,
      },
      {
        label: 'tabs_label_logs',
        to: `/vsphere/${service.name}/logs`,
      },
      {
        label: 'tabs_label_streams',
        to: `/vsphere/${service.name}/logs/streams`,
      },
    ];
  }),
}));

vi.mock('@/data/hooks/useVmwareVsphere', () => ({
  useVmwareVsphere: vi.fn(() => ({
    data: {
      data: {
        description: service.description,
      },
    },
    isLoading: false,
  })),
}));

const shellContext = {
  shell: {
    environment: {
      getEnvironment: () => {
        return {
          getUser: () => ({ ovhSubsidiary: 'spyOn_ovhSubsidiary' }),
        };
      },
    },
    navigation: {
      getURL: vi.fn().mockResolvedValue(legacyAppBaseUrl),
    },
  },
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('Dashboard page', () => {
  const renderDashboardPage = () =>
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ShellContext.Provider
            value={(shellContext as unknown) as ShellContextType}
          >
            <Dashboard />
          </ShellContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>,
    );

  it('renders correct breadcrumb items', async () => {
    const { getByTestId, container } = renderDashboardPage();

    await waitFor(() => {
      const breadcrumb = getByTestId('breadcrumb');
      expect(breadcrumb).toBeInTheDocument();

      const breadcrumbItems = container.querySelectorAll('ods-breadcrumb-item');

      expect(breadcrumbItems.length).toBe(4);

      expect(breadcrumbItems[0]).toHaveAttribute('href', legacyAppBaseUrl);
      expect(breadcrumbItems[0]).toHaveAttribute('label', dedicatedCloudTitle);

      expect(breadcrumbItems[1]).toHaveAttribute(
        'href',
        `${legacyAppBaseUrl}/${service.name}`,
      );
      expect(breadcrumbItems[1]).toHaveAttribute('label', service.description);

      expect(breadcrumbItems[2]).not.toHaveAttribute('href');
      expect(breadcrumbItems[2]).toHaveAttribute('label', 'tabs_label_logs');

      expect(breadcrumbItems[3]).not.toHaveAttribute('href');
      expect(breadcrumbItems[3]).toHaveAttribute('label', 'tabs_label_streams');
    });
  });
});
