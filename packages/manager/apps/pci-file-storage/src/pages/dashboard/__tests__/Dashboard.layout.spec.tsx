import React from 'react';

import { render, screen } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShare } from '@/data/hooks/shares/useShare';

import DashboardLayout from '../Dashboard.layout';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' }),
    useParams: () => ({ shareId: 'share-123' }),
    Outlet: () => <div data-testid="outlet">Outlet content</div>,
  };
});

vi.mock('@/data/hooks/shares/useShare', () => ({
  useShare: vi.fn(),
}));

vi.mock('@/hooks/useProjectId', () => ({
  useProjectId: () => 'project-1',
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: () => ({ region: 'GRA9', shareId: 'share-123' }),
}));

vi.mock('@/pages/view-model/guides.view-model', () => ({
  useFileStorageGuideItems: () => [],
}));

vi.mock('@/components/breadcrumb/Breadcrumb.component', () => ({
  Breadcrumb: () => <div>Breadcrumb</div>,
}));

vi.mock('@/pages/dashboard/ShareEditableName/ShareEditableName.component', () => ({
  ShareEditableName: () => <div>ShareEditableName</div>,
}));

vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChangelogMenu: () => <div>ChangelogMenu</div>,
  GuideMenu: () => <div>GuideMenu</div>,
}));

const mockUseShare = vi.mocked(useShare);

const createAxios404 = (): AxiosError =>
  new AxiosError('Not Found', '404', undefined, undefined, {
    status: 404,
    statusText: 'Not Found',
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
    data: {},
  });

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Outlet when share is loaded successfully', () => {
    mockUseShare.mockReturnValue({
      data: { name: 'My Share' },
      error: null,
    } as ReturnType<typeof useShare>);

    render(<DashboardLayout />);

    expect(screen.getByTestId('outlet')).toBeVisible();
  });

  it('should render ShareNotFound when share returns a 404 error', () => {
    mockUseShare.mockReturnValue({
      data: undefined,
      error: createAxios404(),
    } as unknown as ReturnType<typeof useShare>);

    render(<DashboardLayout />);

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    expect(
      screen.getByText('dashboard:not_found.description{"shareId":"share-123"}'),
    ).toBeVisible();
  });

  it('should render Outlet when share returns a non-404 error', () => {
    mockUseShare.mockReturnValue({
      data: undefined,
      error: new AxiosError('Server Error', '500', undefined, undefined, {
        status: 500,
        statusText: 'Internal Server Error',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
        data: {},
      }),
    } as unknown as ReturnType<typeof useShare>);

    render(<DashboardLayout />);

    expect(screen.getByTestId('outlet')).toBeVisible();
    expect(screen.queryByText(/not_found\.description/)).not.toBeInTheDocument();
  });
});
