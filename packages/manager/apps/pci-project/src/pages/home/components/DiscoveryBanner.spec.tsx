/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { DiscoveryBanner } from './DiscoveryBanner.component';
import { mockProject, mockDiscoveryProject } from '@/data/__mocks__';

// Mock le hook useActivationUrl
vi.mock('@/hooks/useActivationUrl', () => ({
  useActivationUrl: vi.fn(() => ({
    goToActivation: vi.fn(),
  })),
}));

// Mock isDiscoveryProject et useProject avec des fonctions directes
vi.mock('@ovh-ux/manager-pci-common', () => ({
  isDiscoveryProject: vi.fn(),
  useProject: vi.fn(),
}));

describe('DiscoveryBanner', () => {
  it('does not render if project is not discovery', async () => {
    vi.mocked(isDiscoveryProject).mockReturnValue(false);
    vi.mocked(useProject).mockReturnValue({
      data: mockProject,
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isSuccess: true,
    } as any);

    render(<DiscoveryBanner />);
    expect(screen.queryByTestId('ods-message')).not.toBeInTheDocument();
  });

  it('renders banner for discovery project', async () => {
    vi.mocked(useProject).mockReturnValue({
      data: mockDiscoveryProject,
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isSuccess: true,
    } as any);
    vi.mocked(isDiscoveryProject).mockReturnValue(true);

    render(<DiscoveryBanner />);
    expect(screen.getByTestId('ods-message')).toBeInTheDocument();
  });
});
