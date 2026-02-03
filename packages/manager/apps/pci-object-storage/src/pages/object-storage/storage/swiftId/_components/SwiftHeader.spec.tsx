import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwiftHeader } from './SwiftHeader.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import storages from '@/types/Storages';

vi.mock('@/hooks/useTranslatedMicroRegions', () => ({
  getMacroRegion: (region: string) => region,
  useTranslatedMicroRegions: () => ({
    translateMacroRegion: (region: string) => `Region-${region}`,
  }),
}));

describe('SwiftHeader', () => {
  it('should display container name from swift data', () => {
    render(<SwiftHeader swift={mockedContainerDetail} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      mockedContainerDetail.name,
    );
  });

  it('should fallback to "Dashboard" when name is undefined', () => {
    const swiftWithoutName = {
      ...mockedContainerDetail,
      name: undefined,
    } as storages.ContainerDetail;

    render(<SwiftHeader swift={swiftWithoutName} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Dashboard',
    );
  });

  it('should display Swift type badge', () => {
    render(<SwiftHeader swift={mockedContainerDetail} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('Swift')).toBeInTheDocument();
  });

  it('should display region information', () => {
    render(<SwiftHeader swift={mockedContainerDetail} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(
      screen.getByText(`Region-${mockedContainerDetail.region}`),
    ).toBeInTheDocument();
  });
});
