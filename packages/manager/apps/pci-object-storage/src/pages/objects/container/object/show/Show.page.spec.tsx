import { UseQueryResult } from '@tanstack/react-query';
import { describe, vi, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useProductMaintenance } from '@ovh-ux/manager-react-components';
import { TServerContainer } from '@/api/data/container';
import {
  usePaginatedObjects,
  useServerContainer,
} from '@/api/hooks/useContainer';
import ShowPage from './Show.page';
import { useStorageEndpoint } from '@/api/hooks/useStorages';
import { wrapperShow } from '@/wrapperRenders';

vi.mock('@/api/hooks/useContainer', () => ({
  useServerContainer: vi.fn(),
  usePaginatedObjects: vi.fn(),
}));

vi.mock('@/api/hooks/useStorages', async () => ({
  ...(await vi.importActual('@/api/hooks/useStorages')),
  useStorageEndpoint: vi.fn(),
}));

vi.mock('date-fns', () => ({
  format: vi.fn(() => 'formattedDate'),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  ...(await vi.importActual('@ovh-ux/manager-react-shell-client')),
  useOvhTracking: vi.fn().mockReturnValue({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  }),
}));

vi.mock('@/hooks/useFeatureAvailability', () => ({
  useFeatureAvailability: vi.fn(() => ({
    data: {
      'storage:standard-infrequent-access': true,
    },
  })),
}));

vi.mock('@/hooks/useStandardInfrequentAccessAvailability', () => ({
  default: vi.fn(() => true),
}));

vi.mock('@/constants', async () => ({
  ...(await vi.importActual('@/constants')),
  standardInfrequentAcess: 'storage:standard-infrequent-access',
}));

describe('Show page', () => {
  const mockServerContainer = ({
    name: 'test-container',
    id: 'container-id',
    region: 'GRA',
    objects: [
      {
        name: 'test-object',
        size: 1024,
        lastModified: new Date('2023-10-31T23:00:00.000Z'),
        contentType: 'text/plain',
      },
    ],
    s3StorageType: true,
    versioning: {
      status: 'enabled',
    },
  } as unknown) as TServerContainer;

  beforeEach(() => {
    vi.mocked(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
      maintenanceURL: '',
    });
  });

  it('should display spinner when data is loading', () => {
    vi.mocked(useServerContainer).mockReturnValue({
      isPending: true,
      data: undefined,
    } as UseQueryResult<TServerContainer>);

    vi.mocked(usePaginatedObjects).mockReturnValue({
      isPending: true,
    } as never);

    vi.mocked(useStorageEndpoint).mockReturnValue({
      isPending: true,
    } as never);

    render(<ShowPage />, { wrapper: wrapperShow });

    const spinner = document.querySelector('ods-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('size', 'md');
  });

  it('should display container information when loaded', async () => {
    vi.mocked(useServerContainer).mockReturnValue({
      data: mockServerContainer,
      isPending: false,
    } as UseQueryResult<TServerContainer>);

    vi.mocked(usePaginatedObjects).mockReturnValue({
      isPending: false,
      paginatedObjects: {
        rows: mockServerContainer.objects,
        totalRows: 1,
      },
    } as never);

    vi.mocked(useStorageEndpoint).mockReturnValue({
      url: 'https://storage.example.com',
      isPending: false,
    } as never);

    render(<ShowPage />, { wrapper: wrapperShow });

    expect(await screen.findByText('test-container')).toBeInTheDocument();

    const clipboards = screen.getAllByTestId('clipboard');
    const values = clipboards.map((el) => el.getAttribute('value'));

    expect(values).toContain('container-id');
    expect(values).toContain('https://storage.example.com');
  });

  it('should display maintenance banner when there is maintenance', () => {
    vi.mocked(useProductMaintenance).mockReturnValue({
      hasMaintenance: true,
      maintenanceURL: 'https://status.ovh.com',
    });

    vi.mocked(useServerContainer).mockReturnValue({
      data: mockServerContainer,
      isPending: false,
    } as UseQueryResult<TServerContainer>);

    vi.mocked(usePaginatedObjects).mockReturnValue({
      isPending: false,
      paginatedObjects: {
        rows: mockServerContainer.objects,
        totalRows: 1,
      },
    } as never);

    vi.mocked(useStorageEndpoint).mockReturnValue({
      url: 'https://storage.example.com',
      isPending: false,
    } as never);

    render(<ShowPage />, { wrapper: wrapperShow });
    expect(screen.getByTestId('maintenance-banner')).toBeInTheDocument();
  });
});
