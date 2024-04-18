import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import StorageConfig from '@/components/Order/cluster-config/storage-config';
import { mockedAvailabilities } from '@/__tests__/helpers/mocks/availabilities';
import { database } from '@/models/database';

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const availabilitiesWithStorage: database.Availability = {
  ...mockedAvailabilities,
  specifications: {
    ...mockedAvailabilities.specifications,
    storage: {
      maximum: {
        unit: 'GB',
        value: 100,
      },
      minimum: {
        unit: 'GB',
        value: 10,
      },
      step: {
        unit: 'GB',
        value: 10,
      },
    },
  },
};

describe('StorageConfig component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the component', async () => {
    const onChange = vi.fn();
    render(
      <StorageConfig
        availability={availabilitiesWithStorage}
        value={10}
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
        availability={mockedAvailabilities}
        value={10}
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
