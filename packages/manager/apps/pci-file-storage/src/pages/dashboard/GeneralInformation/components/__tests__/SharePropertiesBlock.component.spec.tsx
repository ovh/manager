import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';
import type { TShareDetailsView } from '@/pages/dashboard/view-model/shareDetails.view-model';

import { SharePropertiesBlock } from '../SharePropertiesBlock.component';

vi.mock('@/data/hooks/shares/useShare', () => ({
  useShare: vi.fn(),
}));

vi.mock('@/hooks/useFormatShareSize', () => ({
  useFormatGiBSize: (sizeInGiB: number) => `${sizeInGiB} GiB`,
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: vi.fn(),
}));

const mockUseShare = vi.mocked(useShare);
const mockUseShareParams = vi.mocked(useShareParams);

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
    ...overrides,
  }) as TShareDetailsView;

describe('SharePropertiesBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShareParams.mockReturnValue({ region: 'GRA', shareId: 'share-1' });
    mockUseShare.mockReturnValue({
      data: createShareDetails(),
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareDetailsView>);
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
});
