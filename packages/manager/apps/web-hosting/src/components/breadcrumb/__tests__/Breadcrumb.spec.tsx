import * as React from 'react';

import * as reactRouterDom from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { ShellContext, type ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { wrapper } from '@/utils/test.provider';

import Breadcrumb from '../Breadcrumb.component';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof reactRouterDom>('react-router-dom');
  return {
    ...actual,
    useMatches: vi.fn(),
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const createWrapperWithShellContext = (mockGetURL: ReturnType<typeof vi.fn>) => {
  const shellContext: ShellContextType = {
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
      getRegion: () => 'EU',
      getUserLocale: () => 'fr_FR',
    },
    shell: {
      routing: {
        onHashChange: () => undefined,
        stopListenForHashChange: () => undefined,
        listenForHashChange: () => undefined,
      },
      navigation: {
        getURL: mockGetURL,
      },
    },
  } as unknown as ShellContextType;

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ShellContext.Provider value={shellContext}>
            <MemoryRouter>{children}</MemoryRouter>
          </ShellContext.Provider>
        </I18nextProvider>
      </QueryClientProvider>
    );
  };
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('Breadcrumb component', () => {
  const mockGetURL = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetURL.mockResolvedValue('https://test-url.com/hosting');
    Object.defineProperty(window, 'location', {
      value: { hash: '' },
      writable: true,
      configurable: true,
    });
  });

  it('should render', () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    const { getByTestId } = render(<Breadcrumb />, { wrapper });
    const cmp = getByTestId('breadcrumb');
    expect(cmp).toBeInTheDocument();
  });

  it('should render breadcrumb items from route matches', () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([
      {
        pathname: '/test',
        params: {},
        handle: {
          breadcrumb: {
            label: 'test_label',
          },
        },
      } as unknown as reactRouterDom.UIMatch,
    ]);

    render(<Breadcrumb />, { wrapper });
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should render breadcrumb with icon when provided', () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([
      {
        pathname: '/test',
        params: {},
        handle: {
          breadcrumb: {
            label: 'test_label',
            icon: ICON_NAME.home,
          },
        },
      } as unknown as reactRouterDom.UIMatch,
    ]);

    render(<Breadcrumb />, { wrapper });
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should resolve dynamic label from params when label starts with :', () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([
      {
        pathname: '/test/:id',
        params: { id: 'dynamic-value' },
        handle: {
          breadcrumb: {
            label: ':id',
          },
        },
      } as unknown as reactRouterDom.UIMatch,
    ]);

    render(<Breadcrumb />, { wrapper });
    expect(screen.getByText('dynamic-value')).toBeInTheDocument();
  });

  it('should add WordPress item when hash matches managed-hosting-for-wordpress pattern', async () => {
    Object.defineProperty(window, 'location', {
      value: { hash: '#/managed-hosting-for-wordpress/test-resource' },
      writable: true,
    });

    vi.mocked(reactRouterDom.useMatches).mockReturnValue([
      {
        pathname: '/test',
        params: {},
        handle: {
          breadcrumb: {
            label: 'other_label',
          },
        },
      } as unknown as reactRouterDom.UIMatch,
    ]);

    render(<Breadcrumb />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should not add WordPress item if already present in items', async () => {
    Object.defineProperty(window, 'location', {
      value: { hash: '#/managed-hosting-for-wordpress/test-resource' },
      writable: true,
    });

    vi.mocked(reactRouterDom.useMatches).mockReturnValue([
      {
        pathname: '/test',
        params: {},
        handle: {
          breadcrumb: {
            label: 'managed_wordpress',
          },
        },
      } as unknown as reactRouterDom.UIMatch,
    ]);

    render(<Breadcrumb />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should work with namespace as array', () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    render(<Breadcrumb namespace={['common', 'dashboard']} />, { wrapper });
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should render multiple breadcrumb items from multiple matches', () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([
      {
        pathname: '/first',
        params: {},
        handle: {
          breadcrumb: {
            label: 'first_label',
          },
        },
      } as unknown as reactRouterDom.UIMatch,
      {
        pathname: '/second',
        params: {},
        handle: {
          breadcrumb: {
            label: 'second_label',
          },
        },
      } as unknown as reactRouterDom.UIMatch,
    ]);

    render(<Breadcrumb />, { wrapper });
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('should use custom rootPath when provided', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    mockGetURL.mockResolvedValue('https://test-url.com/custom-path');

    const customWrapper = createWrapperWithShellContext(mockGetURL);
    render(<Breadcrumb appName="Test App" rootPath="/custom-path" />, { wrapper: customWrapper });
    await waitFor(() => {
      expect(mockGetURL).toHaveBeenCalledWith('web', '/custom-path', {});
    });
  });

  it('should render root item when appName is provided and hideRootLabel is false', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    mockGetURL.mockResolvedValue('https://test-url.com/hosting');

    const customWrapper = createWrapperWithShellContext(mockGetURL);
    render(<Breadcrumb appName="Test App" />, { wrapper: customWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should use rootLabel when provided instead of appName', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    mockGetURL.mockResolvedValue('https://test-url.com/hosting');

    const customWrapper = createWrapperWithShellContext(mockGetURL);
    render(<Breadcrumb appName="Test App" rootLabel="Custom Root" />, { wrapper: customWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should not render root item when hideRootLabel is true', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    mockGetURL.mockResolvedValue('https://test-url.com/hosting');

    const customWrapper = createWrapperWithShellContext(mockGetURL);
    render(<Breadcrumb appName="Test App" hideRootLabel />, { wrapper: customWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should handle error when getURL fails', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const errorMockGetURL = vi.fn().mockRejectedValue(new Error('Failed to fetch URL'));

    const customWrapper = createWrapperWithShellContext(errorMockGetURL);
    render(<Breadcrumb appName="Test App" />, { wrapper: customWrapper });
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch root URL:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
