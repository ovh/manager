import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwiftHeader } from './SwiftHeader.component';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedSwift } from '@/__tests__/helpers/mocks/swift';
import storages from '@/types/Storages';

vi.mock('@/hooks/useTranslatedMicroRegions', () => ({
  getMacroRegion: (region: string) => region,
  useTranslatedMicroRegions: () => ({
    translateMacroRegion: (region: string) => `Region-${region}`,
  }),
}));

vi.mock('@/hooks/useLocaleByteConverter.hook', () => ({
  useLocaleBytesConverter: () => (bytes: number) => `${bytes} bytes`,
}));

vi.mock('@/lib/flagHelper', () => ({
  getRegionFlag: () => 'FR',
}));

vi.mock('@/components/flag/Flag.component', () => ({
  default: () => <span data-testid="flag" />,
}));

describe('SwiftHeader', () => {
  it('should display container name from swift data', () => {
    render(<SwiftHeader swift={mockedSwift} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'test-container',
    );
  });

  it('should fallback to "Dashboard" when name is undefined', () => {
    const swiftWithoutName = {
      ...mockedSwift,
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
    render(<SwiftHeader swift={mockedSwift} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('Swift')).toBeInTheDocument();
  });

  it('should display region information', () => {
    render(<SwiftHeader swift={mockedSwift} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('Region-GRA')).toBeInTheDocument();
  });

  it('should display storage size', () => {
    render(<SwiftHeader swift={mockedSwift} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText('1024 bytes')).toBeInTheDocument();
  });
});
