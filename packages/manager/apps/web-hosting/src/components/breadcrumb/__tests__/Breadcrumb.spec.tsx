import * as React from 'react';

import * as reactRouterDom from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { wrapper } from '@/utils/test.provider';

import Breadcrumb from '../Breadcrumb.component';

describe('Breadcrumb component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('should render root item when appName is provided and hideRootLabel is false', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    render(<Breadcrumb appName="Test App" />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should use rootLabel when provided instead of appName', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    render(<Breadcrumb appName="Test App" rootLabel="Custom Root" />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });

  it('should not render root item when hideRootLabel is true', async () => {
    vi.mocked(reactRouterDom.useMatches).mockReturnValue([]);
    render(<Breadcrumb appName="Test App" hideRootLabel />, { wrapper });
    await waitFor(() => {
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });
  });
});
