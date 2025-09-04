import { UseQueryResult } from '@tanstack/react-query';
import { describe, vi, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useProductMaintenance } from '@ovh-ux/manager-react-components';

import { TRegion } from '@/api/data/region';
import { useServerContainer } from '@/api/hooks/useContainer';
import AddReplicationPage from './ManageReplication.page';
import {
  useStorageEndpoint,
  useStorage,
  useAllServerStorages,
} from '@/api/hooks/useStorages';
import { replicationTestWrapper } from '@/wrapperRenders';
import { STATUS_ENABLED, STATUS_DISABLED } from '@/constants';
import { TServerContainer } from '@/api/data/container';
import { TStorage, TStoragesAapiResult } from '@/api/data/storages';
import { ReplicationRuleId } from './ReplicationRuleName.component';
import { ReplicationRuleDestination } from './ReplicationRuleDestination.component';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';

interface UseStorageReturn {
  isPending: boolean;
  storage: TStorage;
  error: Error | null;
  storages: TStoragesAapiResult;
}

interface StorageEndpointReturn {
  isPending: boolean;
  region: TRegion;
  url: string;
}

const mockContainer: TServerContainer = {
  createdAt: '2023-01-01',
  encryption: { sseAlgorithm: 'AES256' },
  id: 'container-id',
  name: 'test-container',
  objects: [],
  objectsCount: 0,
  objectsSize: 0,
  ownerId: 12345,
  region: 'GRA',
  s3StorageType: '1AZ',
  storedBytes: 0,
  storedObjects: 0,
  versioning: { status: STATUS_ENABLED },
  objectLock: { status: STATUS_DISABLED },
  virtualHost: 'test-container.s3.gra.perf.cloud.ovh.net',
  staticUrl: 'https://test-container.s3.gra.perf.cloud.ovh.net',
  replication: {
    rules: [],
  },
  deploymentMode: '3-az',
};

const TStorageReturn: UseStorageReturn = {
  isPending: false,
  storage: {
    id: 'container-id',
    name: 'test-container',
    region: 'GRA',
    archive: false,
    containerType: 'private',

    storedBytes: 1000,
    storedObjects: 3,
    objectsCount: 3,
    containerCount: 3,
    usedSpace: 512,
    deploymentMode: '3-az',
    mode: '3-AZ Deployment',
    offer: 'standard',
  },
  error: null,
  storages: {
    resources: [
      {
        id: 'container-id',
        name: 'test-container',
        region: 'GRA',
        archive: false,
        containerType: 'private',

        storedBytes: 1000,
        storedObjects: 3,
        objectsCount: 3,
        containerCount: 3,
        usedSpace: 512,
        deploymentMode: '3-az',
        mode: '3-AZ Deployment',
        offer: 'standard',
      },
    ],
    errors: [],
  },
};

const mockRegion: TRegion = {
  name: 'Gravelines',
  continentCode: 'EU',
  datacenterLocation: 'FR',
  ipCountries: [],
  services: [],
  status: 'UP',
  type: 'region',
};

const mockContainerTContainer: TContainer = {
  createdAt: '2023-01-01',
  encryption: { sseAlgorithm: 'AES256' },
  id: mockContainer.id,
  name: 'test-container',
  objects: [],
  objectsCount: 3,
  objectsSize: 0,
  ownerId: 12345,
  region: 'GRA',
  s3StorageType: '1az',
  storedBytes: 0,
  storedObjects: 0,
  versioning: { status: STATUS_ENABLED },
  objectLock: { status: STATUS_DISABLED },
  virtualHost: 'test-container.s3.gra.perf.cloud.ovh.net',
  staticUrl: mockContainer.staticUrl,
  replication: {
    rules: [],
  },
  deploymentMode: '3-az',
  regionDetails: mockRegion,
  usedSpace: '0',
  publicUrl: '',
  tags: {},
};

const mockContainerStorage: TStorage = {
  id: 'container-id',
  name: 'test-container',
  region: 'GRA',
  s3StorageType: '1AZ',
  deploymentMode: '3-az',
  mode: '3-AZ Deployment',
  offer: 'standard',
  containerCount: 1,
  usedSpace: 1024,
  archive: false,
  containerType: 'private',
  state: 'active',

  storedObjects: 3,
  objectsCount: 3,

  storedBytes: 1000,
};

const mockDestinationContainerStorage: TStorage = {
  id: 'dest-container-id',
  name: 'destination-container',
  region: 'GRA',
  s3StorageType: '1AZ',
  deploymentMode: '3-az',
  mode: '3-AZ Deployment',
  offer: 'standard',
  containerCount: 1,
  usedSpace: 1024,
  archive: false,

  state: 'active',

  storedObjects: 3,
  objectsCount: 3,

  storedBytes: 1000,
};

vi.mock('@/api/hooks/useContainer', () => ({
  useServerContainer: vi.fn<[], UseQueryResult<TServerContainer, Error>>(),
  useGetRegion: vi.fn(),
}));

vi.mock('@ovhcloud/ods-components', () => ({
  OdsRadio: () => <div data-testid="ods-radio-mock" />,
}));

vi.mock('@/api/hooks/useStorages', async () => ({
  ...(await vi.importActual('@/api/hooks/useStorages')),
  useStorageEndpoint: vi.fn<[], StorageEndpointReturn>(),
  useStorage: vi.fn<[], UseStorageReturn>(),
  useAllServerStorages: vi.fn(),
  useUpdateStorage: vi.fn(() => ({
    updateContainer: vi.fn(),
    addReplicationRule: vi.fn(),
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    isIdle: true,
    status: 'idle',
    data: undefined,
    error: null,
    variables: undefined,
  })),
}));

describe('AddReplicationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProductMaintenance).mockReturnValue({
      hasMaintenance: false,
      maintenanceURL: '',
    });

    vi.mocked(useServerContainer).mockReturnValue({
      data: mockContainer,
      isPending: false,
      error: null,
      isError: false,
      isLoading: false,
      isSuccess: true,
    } as UseQueryResult<TServerContainer, Error>);

    vi.mocked(useStorage).mockReturnValue(TStorageReturn);

    vi.mocked(useStorageEndpoint).mockReturnValue({
      isPending: false,
      region: mockRegion,
      url: 'https://storage.example.com',
    });

    vi.mocked(useAllServerStorages).mockReturnValue({
      isLoading: false,
      isPending: false,
      allStorages: [mockContainerStorage, mockDestinationContainerStorage],
      error: null,
      isRefreshing: false,
      refresh: vi.fn(),
    });
  });

  it('should display spinner when data is loading', () => {
    vi.mocked(useServerContainer).mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
      isError: false,
      isLoading: true,
      isSuccess: false,
    } as UseQueryResult<TServerContainer, Error>);

    render(<AddReplicationPage />, { wrapper: replicationTestWrapper });

    const spinner = document.querySelector('ods-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('size', 'md');
  });
});

describe('ReplicationRuleId', () => {
  const props = {
    replicationRuleId: '',
    setReplicationRuleId: vi.fn(),
    isReplicationRuleIdTouched: false,
    setIsReplicationRuleIdTouched: vi.fn(),
    isValidReplicationRuleId: false,
  };

  it('should render label and input field', () => {
    render(<ReplicationRuleId {...props} />);

    expect(
      screen.getByTestId('replication-rule-name-input'),
    ).toBeInTheDocument();
  });
});

describe('ReplicationRuleDestination', () => {
  const mockSetDestination = vi.fn();
  const mockSetDestinationDetails = vi.fn();
  const mockSetUseStorageclass = vi.fn();

  const props = {
    destination: null,
    setDestination: mockSetDestination,
    allStorages: [
      {
        createdAt: '2023-01-01',
        encryption: { sseAlgorithm: 'AES256' },
        id: 'dest-container-id',
        name: 'destination-container-1',
        objects: [],
        objectsCount: 0,
        objectsSize: 0,
        ownerId: 12345,
        region: 'GRA',
        s3StorageType: '1AZ',
        storedBytes: 0,
        storedObjects: 0,
        versioning: { status: STATUS_ENABLED },
        objectLock: { status: STATUS_DISABLED },
        virtualHost: 'server-container.s3.gra.perf.cloud.ovh.net',
        staticUrl: 'https://server-container.s3.gra.perf.cloud.ovh.net',
        replication: {
          rules: [],
        },
        deploymentMode: '3-az',
        mode: 'some-mode',
        offer: 'some-offer',
        containerCount: 1,
        usedSpace: 100,
      },
      {
        createdAt: '2023-01-01',
        encryption: { sseAlgorithm: 'AES256' },
        id: 'dest-container-id-2',
        name: 'destination-container',
        objects: [],
        objectsCount: 0,
        objectsSize: 0,
        ownerId: 12345,
        region: 'GRA',
        s3StorageType: '1AZ',
        storedBytes: 0,
        storedObjects: 0,
        versioning: { status: STATUS_ENABLED },
        objectLock: { status: STATUS_DISABLED },
        virtualHost: 'server-container.s3.gra.perf.cloud.ovh.net',
        staticUrl: 'https://server-container.s3.gra.perf.cloud.ovh.net',
        replication: {
          rules: [],
        },
        deploymentMode: '3-az',
        mode: 'some-mode',
        offer: 'some-offer',
        containerCount: 1,
        usedSpace: 100,
      },
    ],
    setDestinationDetails: mockSetDestinationDetails,
    serverDestinationContainer: {
      createdAt: '2023-01-01',
      encryption: { sseAlgorithm: 'AES256' },
      id: 'server-container-id',
      name: 'server-container-name',
      objects: [],
      objectsCount: 0,
      objectsSize: 0,
      ownerId: 12345,
      region: 'GRA',
      s3StorageType: '1AZ',
      storedBytes: 0,
      storedObjects: 0,
      versioning: { status: STATUS_ENABLED },
      objectLock: { status: STATUS_DISABLED },
      virtualHost: 'server-container.s3.gra.perf.cloud.ovh.net',
      staticUrl: 'https://server-container.s3.gra.perf.cloud.ovh.net',
      replication: {
        rules: [],
      },
      deploymentMode: '3-az',
      mode: 'some-mode',
      offer: 'some-offer',
      containerCount: 1,
      usedSpace: 100,
    },
    asyncReplicationLink: 'https://example.com',
    setUseStorageclass: mockSetUseStorageclass,
  };

  it('should render combobox with available destinations', () => {
    render(
      <ReplicationRuleDestination
        {...props}
        container={mockContainerTContainer}
      />,
    );

    expect(screen.getByText('destination-container-1')).toBeInTheDocument();
    expect(screen.getByText('destination-container')).toBeInTheDocument();
  });

  it('should call setDestination when a destination is selected', async () => {
    render(
      <ReplicationRuleDestination
        {...props}
        container={mockContainerTContainer}
      />,
      {
        wrapper: ({ children }) => <div>{children}</div>,
      },
    );

    const combobox = await screen.findByTestId('replication-rule-combobox');
    expect(combobox).toBeInTheDocument();

    const comboboxInput = await screen.findByPlaceholderText(
      'containers/replication/add:pci_projects_project_storages_containers_replication_add_destination_placeholder',
    );

    fireEvent.change(comboboxInput, {
      target: { value: 'destination-container' },
    });

    const option = await screen.findByText('destination-container');
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockSetDestination).toHaveBeenCalledWith({
        name: 'destination-container',
        region: 'GRA',
      });
    });
  });
});
