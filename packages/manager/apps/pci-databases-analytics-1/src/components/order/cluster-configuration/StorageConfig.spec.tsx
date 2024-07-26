import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import StorageConfig from '@/components/order/cluster-configuration/StorageConfig.component';
import {
  mockedAvailabilities,
  mockedAvailabilitiesUpdate,
} from '@/__tests__/helpers/mocks/availabilities';

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('StorageConfig component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the component', async () => {
    const onChange = vi.fn();
    render(
      <StorageConfig
        availability={mockedAvailabilities}
        value={20}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('storage-configuration-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('storage-unit-value-container'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('storage-slider')).toBeInTheDocument();
    });
  });
  it('should display nothing', async () => {
    const onChange = vi.fn();
    render(
      <StorageConfig
        availability={mockedAvailabilitiesUpdate}
        value={20}
        onChange={onChange}
      />,
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('storage-flavor-description'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('storage-unit-value-container'),
      ).not.toBeInTheDocument();
    });
  });
});
