import React from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { waitFor } from '@testing-library/dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { platformMock } from '@/data/api';
import * as hooks from '@/data/hooks';
import { render } from '@/utils/test.provider';

import Layout from './layout';

vi.mock('react-router-dom', async (importActual) => {
  return {
    ...(await importActual<typeof import('react-router-dom')>()),
    useLocation: vi.fn(),
    Navigate: vi.fn(() => null),
  };
});

vi.mock('@/data/hooks');

const platformId = platformMock[0].id;

const mockLocation = (pathname: string, search = '') => {
  vi.mocked(useLocation).mockReturnValue({
    pathname,
    search,
    hash: '',
    state: null,
    key: 'default',
  });
};

const mockPlatform = (overrides = {}) => {
  vi.mocked(hooks.usePlatform).mockReturnValue({
    platformId,
    data: { currentState: { numberOfOrganizations: 1 } },
    isLoading: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof hooks.usePlatform>);
};

const getNavigateTarget = () => vi.mocked(Navigate).mock.calls[0]?.[0];

describe('Layout', () => {
  beforeEach(() => {
    mockPlatform();
    mockLocation(`/${platformId}`);
  });

  it('should render correctly', async () => {
    const { queryByTestId, container } = render(<Layout />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(container).toBeVisible();
    expect(Navigate).not.toHaveBeenCalled();
  });

  it('redirects the root path to the resolved platform', () => {
    mockLocation('/');
    render(<Layout />);

    expect(getNavigateTarget()).toEqual(
      expect.objectContaining({ to: `/${platformId}`, replace: true }),
    );
  });

  it('prefixes a platform less deep link with the resolved platform', () => {
    mockLocation('/services');
    render(<Layout />);

    expect(getNavigateTarget()).toEqual(
      expect.objectContaining({ to: `/${platformId}/services`, replace: true }),
    );
  });

  it('keeps the search params while prefixing a platform less deep link', () => {
    mockLocation('/email_accounts/add', '?offer=PRO');
    render(<Layout />);

    expect(getNavigateTarget()).toEqual(
      expect.objectContaining({ to: `/${platformId}/email_accounts/add?offer=PRO` }),
    );
  });

  it('does not prefix a path already scoped to a platform', () => {
    mockLocation(`/${platformId}/services`);
    render(<Layout />);

    expect(Navigate).not.toHaveBeenCalled();
  });

  it('does not prefix an unknown path', () => {
    mockLocation('/unknown_section');
    render(<Layout />);

    expect(Navigate).not.toHaveBeenCalled();
  });

  it('does not prefix onboarding routes', () => {
    mockLocation('/onboarding/welcome');
    render(<Layout />);

    expect(Navigate).not.toHaveBeenCalled();
  });

  it('redirects to onboarding when no platform is available', () => {
    mockPlatform({ platformId: undefined, data: null });
    mockLocation('/services');
    render(<Layout />);

    expect(getNavigateTarget()).toEqual(expect.objectContaining({ to: 'onboarding' }));
  });

  it('redirects to the onboarding welcome page when the platform has no organization', () => {
    mockPlatform({ data: { currentState: { numberOfOrganizations: 0 } } });
    mockLocation('/services');
    render(<Layout />);

    expect(getNavigateTarget()).toEqual(expect.objectContaining({ to: 'onboarding/welcome' }));
  });
});
