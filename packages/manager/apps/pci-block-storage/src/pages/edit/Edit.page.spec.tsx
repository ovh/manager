import { BrowserRouter } from 'react-router-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { it, vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import EditPage from './Edit.page';

import * as volumeHook from '@/api/hooks/useVolume';

import { TVolume } from '@/api/data/volume';
import queryClient from '@/queryClient';

vi.mock('@/core/HidePreloader', () => ({
  default: () => <div>HidePeloader</div>,
}));

vi.mock('@/api/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn().mockReturnValue({ data: [] }),
}));

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

const shellContext = {
  environment: {
    getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
  },
  shell: {
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const wrapper = ({ children }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        {children}
      </ShellContext.Provider>
    </QueryClientProvider>
  </BrowserRouter>
);

const renderEditPage = () => {
  render(<EditPage />, { wrapper });
};

describe('Edit volume page', () => {
  it('renders the component and displays volume information', () => {
    vi.spyOn(volumeHook, 'useVolume').mockReturnValue({
      data: {
        name: 'Volume',
        size: 10,
        bootable: false,
        region: 'EU',
        type: 'standard',
      },
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TVolume>);

    renderEditPage();

    expect(screen.getByTestId('editPage-input_volumeName')).toHaveValue(
      'Volume',
    );
    expect(screen.getByText('standard')).toBeVisible();
    expect(screen.getByTestId('editPage-input_volumeSize')).toHaveValue(10);
  });

  it('handles name change correctly', async () => {
    vi.spyOn(volumeHook, 'useVolume').mockReturnValue({
      data: {
        name: 'Volume',
        size: 10,
        bootable: false,
        region: 'EU',
        type: 'standard',
      },
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TVolume>);

    renderEditPage();

    fireEvent.change(screen.getByTestId('editPage-input_volumeName'), {
      target: { value: 'New Volume Name' },
    });
    expect(screen.getByTestId('editPage-input_volumeName')).toHaveValue(
      'New Volume Name',
    );
  });

  it('displays loading spinner when data is being fetched', async () => {
    vi.spyOn(volumeHook, 'useVolume').mockReturnValue({
      data: null,
      isLoading: true,
      isPending: true,
    } as UseQueryResult<TVolume>);

    renderEditPage();

    expect(screen.getByTestId('editPage-spinner')).toBeVisible();
  });

  it('updates the volume on form submission when valid', async () => {
    const mockUpdateVolume = vi.fn();

    vi.spyOn(volumeHook, 'useVolume').mockReturnValue({
      data: {
        name: 'Volume',
        size: 10,
        bootable: false,
        region: 'EU',
        type: 'standard',
      },
      isLoading: false,
      isPending: false,
    } as UseQueryResult<TVolume>);
    vi.spyOn(volumeHook, 'useUpdateVolume').mockReturnValue(({
      updateVolume: mockUpdateVolume,
    } as unknown) as never);

    renderEditPage();

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
