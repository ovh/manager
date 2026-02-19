import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNetwork } from '@/data/hooks/network/useNetwork';
import { useShare } from '@/data/hooks/shares/useShare';
import { useProjectId } from '@/hooks/useProjectId';
import { useShareParams } from '@/hooks/useShareParams';
import type {
  TNetworkDetailsView,
  TShareDetailsView,
} from '@/pages/dashboard/view-model/shareDetails.view-model';

import { SharePropertiesBlock } from '../SharePropertiesBlock.component';

vi.mock('@/data/hooks/shares/useShare', () => ({
  useShare: vi.fn(),
}));

vi.mock('@/data/hooks/network/useNetwork', () => ({
  useNetwork: vi.fn(),
}));

vi.mock('@/hooks/useFormatShareSize', () => ({
  useFormatGiBSize: (sizeInGiB: number) => `${sizeInGiB} GiB`,
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: vi.fn(),
}));

vi.mock('@/hooks/useProjectId', () => ({
  useProjectId: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigationGetUrl: vi.fn(() => ({ data: 'https://network-url.test' })),
}));

const mockUseShare = vi.mocked(useShare);
const mockUseNetwork = vi.mocked(useNetwork);
const mockUseShareParams = vi.mocked(useShareParams);
const mockUseProjectId = vi.mocked(useProjectId);

const createShareDetails = (overrides: Partial<TShareDetailsView> = {}): TShareDetailsView =>
  ({
    id: 'share-1',
    name: 'My Share',
    region: 'GRA9',
    regionDisplayKey: 'regions:manager_components_region_GRA_micro',
    protocol: 'NFS',
    size: 100,
    status: 'available',
    statusDisplay: { labelKey: 'status:active', badgeColor: 'success' },
    createdAt: '2025-01-01',
    mountPaths: ['/data/share1'],
    enabledActions: [],
    networkId: 'network-123',
    ...overrides,
  }) as TShareDetailsView;

const createNetworkDetails = (
  overrides: Partial<TNetworkDetailsView> = {},
): TNetworkDetailsView => ({
  id: 'network-123',
  displayName: 'My Private Network',
  ...overrides,
});

describe('SharePropertiesBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShareParams.mockReturnValue({ region: 'GRA', shareId: 'share-1' });
    mockUseProjectId.mockReturnValue('project-123');
    mockUseShare.mockReturnValue({
      data: createShareDetails(),
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareDetailsView>);
    mockUseNetwork.mockReturnValue({
      data: createNetworkDetails(),
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TNetworkDetailsView>);
  });

  it('should render regino and shareId', () => {
    render(
      <MemoryRouter>
        <SharePropertiesBlock />
      </MemoryRouter>,
    );

    expect(screen.getByText('cards.properties')).toBeVisible();
    expect(screen.getByText('NFS')).toBeVisible();
    expect(screen.getByText('100 GiB')).toBeVisible();
  });

  it('should render multiple mount paths', () => {
    mockUseShare.mockReturnValue({
      data: createShareDetails({
        mountPaths: ['/path/a', '/path/b'],
      }),
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareDetailsView>);

    render(
      <MemoryRouter>
        <SharePropertiesBlock />
      </MemoryRouter>,
    );

    expect(screen.getByDisplayValue('/path/a')).toBeVisible();
    expect(screen.getByDisplayValue('/path/b')).toBeVisible();
  });

  it('should render private network block with network name', () => {
    render(
      <MemoryRouter>
        <SharePropertiesBlock />
      </MemoryRouter>,
    );

    expect(screen.getByText('share:fields.private_network')).toBeVisible();
    expect(screen.getByText('share:fields.network_name')).toBeVisible();
    expect(screen.getByText('My Private Network')).toBeVisible();
  });
});
