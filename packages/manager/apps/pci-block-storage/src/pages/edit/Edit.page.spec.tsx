import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { it, vi } from 'vitest';
import { UseMutateFunction, UseQueryResult } from '@tanstack/react-query';
import EditPage from './Edit.page';

import {
  useUpdateVolume,
  useVolume,
  UseVolumeResult,
} from '@/api/hooks/useVolume';
import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';
import { useVolumeCatalog, useVolumePricing } from '@/api/hooks/useCatalog';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import { useVolumeMaxSize } from '@/api/data/quota';

vi.mock('@/core/HidePreloader', () => ({
  default: () => <div>HidePeloader</div>,
}));

vi.mock('react-router-dom');

vi.mock('@/api/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn().mockReturnValue({ data: [] }),
}));

vi.mock('@/api/hooks/useCatalog');
vi.mocked(useVolumeCatalog).mockReturnValue({
  data: {
    models: [],
    regions: [],
  },
} as ReturnType<typeof useVolumeCatalog>);
vi.mocked(useVolumePricing).mockReturnValue(
  {} as ReturnType<typeof useVolumePricing>,
);

vi.mock('@/api/hooks/useHas3AZRegion');
vi.mocked(useHas3AZRegion).mockReturnValue({ has3AZ: true, isPending: false });

vi.mock('@/api/data/quota');
vi.mocked(useVolumeMaxSize).mockReturnValue({
  volumeMaxSize: 10_000,
} as ReturnType<typeof useVolumeMaxSize>);

vi.mock('@/api/hooks/useVolume');
const mockedVolumeData = {
  data: {
    name: 'Volume',
    size: 10,
    bootable: false,
    region: 'EU',
    type: 'standard',
  },
  isLoading: false,
  isPending: false,
} as UseQueryResult<UseVolumeResult>;

const mockUpdateVolume = vi.fn();
vi.mocked(useUpdateVolume).mockReturnValue({
  updateVolume: mockUpdateVolume as UseMutateFunction,
} as ReturnType<typeof useUpdateVolume>);

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const mod = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();

  return {
    ...mod,
    useCatalogPrice: vi
      .fn()
      .mockReturnValue({ getTextPrice: vi.fn().mockReturnValue('€10.00') }),
    useNotifications: vi.fn().mockReturnValue({
      addError: vi.fn(),
      addSuccess: vi.fn(),
    }),
    useProjectLocalRegions: vi.fn().mockReturnValue({ data: [] }),
    useProjectUrl: vi.fn().mockReturnValue('/project-url'),
    useTranslatedMicroRegions: vi
      .fn()
      .mockReturnValue({ translateMicroRegion: vi.fn().mockReturnValue('EU') }),
  };
});

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useProject: vi.fn().mockReturnValue({ data: { description: 'Project' } }),
  };
});

describe('Edit volume page', () => {
  it('renders the component and displays volume information', () => {
    vi.mocked(useVolume).mockReturnValue(
      mockedVolumeData as ReturnType<typeof useVolume>,
    );
    renderWithMockedWrappers(<EditPage />);

    expect(screen.getByTestId('editPage-input_volumeName')).toHaveValue(
      'Volume',
    );
    expect(screen.getByText('standard')).toBeVisible();
    expect(screen.getByTestId('editPage-input_volumeSize')).toHaveValue(10);
  });

  it('handles name change correctly', async () => {
    vi.mocked(useVolume).mockReturnValue(mockedVolumeData);
    renderWithMockedWrappers(<EditPage />);

    fireEvent.change(screen.getByTestId('editPage-input_volumeName'), {
      target: { value: 'New Volume Name' },
    });
    expect(screen.getByTestId('editPage-input_volumeName')).toHaveValue(
      'New Volume Name',
    );
  });

  it('displays loading spinner when data is being fetched', async () => {
    vi.mocked(useVolume).mockReturnValue({
      data: null,
      isLoading: true,
      isPending: true,
    } as UseQueryResult<UseVolumeResult>);

    renderWithMockedWrappers(<EditPage />);

    expect(screen.getByTestId('editPage-spinner')).toBeVisible();
  });

  it('updates the volume on form submission when valid', async () => {
    vi.mocked(useVolume).mockReturnValue(mockedVolumeData);
    renderWithMockedWrappers(<EditPage />);

    fireEvent.change(screen.getByTestId('editPage-input_volumeName'), {
      target: { value: 'New Volume Name' },
    });

    act(() => {
      fireEvent.click(screen.getByTestId('editPage-button_submit'));
    });

    await waitFor(() => {
      expect(mockUpdateVolume).toHaveBeenCalledTimes(1);
    });
  });
});
