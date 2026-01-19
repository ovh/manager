import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import RegionWithFlag from './RegionWithFlag.component';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';

// Mock useTranslatedMicroRegions
vi.mock('@/hooks/useTranslatedMicroRegions', () => ({
  useTranslatedMicroRegions: () => ({
    translateMicroRegion: (name: string) => `translated-${name}`,
  }),
}));

describe('RegionWithFlag component', () => {
  it('renders flag and translated region name', async () => {
    render(<RegionWithFlag region={mockedRegion} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('flag-container')).toBeTruthy();
      expect(screen.getByText('translated-BHS')).toBeInTheDocument();
    });
  });
});
