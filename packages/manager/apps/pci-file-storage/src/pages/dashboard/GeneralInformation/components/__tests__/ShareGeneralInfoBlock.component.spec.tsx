import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TShareDetailsView } from '@/adapters/shares/left/shareDetails.data';
import { useShare } from '@/data/hooks/shares/useShare';
import { useShareParams } from '@/hooks/useShareParams';

import { ShareGeneralInfoBlock } from '../ShareGeneralInfoBlock.component';

vi.mock('@/data/hooks/shares/useShare', () => ({
  useShare: vi.fn(),
}));

vi.mock('@/hooks/useShareParams', () => ({
  useShareParams: vi.fn(),
}));

const mockUseShare = vi.mocked(useShare);
const mockUseShareParams = vi.mocked(useShareParams);

const createShareDetails = (
  overrides: Partial<TShareDetailsView> = {},
): TShareDetailsView =>
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
    mountPaths: [],
    enabledActions: [],
    ...overrides,
  }) as TShareDetailsView;

describe('ShareGeneralInfoBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseShareParams.mockReturnValue({ region: 'GRA', shareId: 'share-1' });
    mockUseShare.mockReturnValue({
      data: createShareDetails(),
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareDetailsView>);
  });

  it('should render card share info', () => {
    render(
        <ShareGeneralInfoBlock />
    );

    expect(screen.getByText('general_information:cards.informations')).toBeVisible();
    expect(screen.getByText('share-1')).toBeVisible();
    expect(screen.getByText('My Share')).toBeVisible();
    expect(screen.getByText('status:active')).toBeVisible();
    expect(screen.getByText('2025-01-01')).toBeVisible();

  });

  it.each([
    {
      enabledActions: ['delete'],
      description:
        'should render delete action link when enabledActions includes delete',
    },
    {
      enabledActions: [] as string[],
      description:
        'should not render delete action link when enabledActions excludes delete',
    },
  ])('$description', ({ enabledActions }) => {
    mockUseShare.mockReturnValue({
      data: createShareDetails({ enabledActions }),
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TShareDetailsView>);

    render(
      <MemoryRouter>
        <ShareGeneralInfoBlock />
      </MemoryRouter>,
    );

    if (enabledActions.includes('delete')) {
      expect(
        screen.getByRole('link', { name: 'general_information:actions.delete' }),
      ).toBeVisible();
    } else {
      expect(
        screen.queryByRole('link', {
          name: 'general_information:actions.delete',
        }),
      ).not.toBeInTheDocument();
    }
  });
});
