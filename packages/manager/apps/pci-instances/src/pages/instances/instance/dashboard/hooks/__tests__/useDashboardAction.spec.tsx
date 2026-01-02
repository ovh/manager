import { describe, it, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnattachedVolumes } from '../useDashboardAction';
import { getInstance } from '@/data/api/instance';
import { TInstance } from '@/types/instance/entity.type';
import { getVolumes } from '@/data/api/volume';
import { useDedicatedUrl } from '@/hooks/url/useDedicatedUrl';

const fakeInstance = {
  id: 'fake-instance-id',
  name: 'fake-instance',
  region: {
    name: 'fake-region',
    type: 'region',
    availabilityZone: 'fake-zone-a',
  },
  volumes: [
    {
      id: 'fake-volume-1',
      name: 'fake-volume',
      size: null,
    },
  ],
  addresses: new Map(),
  task: {
    isPending: false,
    status: null,
  },
  actions: [{}],
} as TInstance;

const getInstanceMock = vi.fn().mockResolvedValue(fakeInstance);
const getVolumesMock = vi.fn();

vi.mock('@/data/api/instance');
vi.mock('@/data/api/volume');
vi.mock('@/hooks/url/useDedicatedUrl');
vi.mocked(getInstance).mockImplementation(getInstanceMock);
vi.mocked(getVolumes).mockImplementation(getVolumesMock);
vi.mocked(useDedicatedUrl).mockResolvedValue('');

const render = () =>
  renderHook(
    () =>
      useUnattachedVolumes({
        projectId: 'fake-projectId',
        region: 'fake-region',
        instanceId: 'fake-instance',
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={new QueryClient()}>
          {children}
        </QueryClientProvider>
      ),
    },
  );

describe('useUnattachedVolumes', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    {
      description: 'should return empty when volumes are already attached',
      volumes: [
        {
          id: 'fake-volume-1',
          name: 'fake-volume',
          availabilityZone: 'fake-zone-a',
          attachedInstances: [fakeInstance.id],
          status: 'available',
        },
      ],
      expected: [],
    },
    {
      description:
        'should return only unattached volumes with availabilityZone any or null',
      volumes: [
        {
          id: 'fake-volume-1',
          name: 'fake-volume',
          availabilityZone: 'fake-zone-a',
          attachedInstances: [fakeInstance.id],
          status: 'available',
        },
        {
          id: 'fake-volume-3',
          name: 'fake-volume-3',
          availabilityZone: 'any',
          attachedInstances: [],
          status: 'available',
        },
        {
          id: 'fake-volume-4',
          name: 'fake-volume-4',
          attachedInstances: [],
          availabilityZone: null,
          status: 'available',
        },
      ],
      expected: [
        {
          label: 'fake-volume-3',
          value: 'fake-volume-3',
          canBeDetached: false,
        },
        {
          label: 'fake-volume-4',
          value: 'fake-volume-4',
          canBeDetached: false,
        },
      ],
    },
    {
      description:
        'should return only unattached volumes with the same instance zone',
      volumes: [
        {
          id: 'fake-volume-1',
          name: 'fake-volume',
          availabilityZone: 'fake-zone-a',
          attachedInstances: [fakeInstance.id],
          status: 'available',
        },
        {
          id: 'fake-volume-2',
          name: 'fake-volume-2',
          availabilityZone: 'fake-zone-a',
          attachedInstances: [],
          status: 'available',
        },
        {
          id: 'fake-volume-3',
          name: 'fake-volume-3',
          availabilityZone: 'fake-zone-b',
          attachedInstances: [],
          status: 'available',
        },
      ],
      expected: [
        {
          label: 'fake-volume-2',
          value: 'fake-volume-2',
          canBeDetached: false,
        },
      ],
    },
  ])('$description', async ({ volumes, expected }) => {
    getVolumesMock.mockResolvedValue(volumes);
    const { result } = render();

    await waitFor(() => {
      expect(result.current.volumes).toStrictEqual(expected);
    });
  });

  it('should return unattached volumes with canBeDetached = true in 1AZ when status = in-use', async () => {
    getVolumesMock.mockResolvedValue([
      {
        id: 'fake-volume-1',
        name: 'fake-volume',
        availabilityZone: 'fake-zone-a',
        attachedInstances: [fakeInstance.id],
        status: 'in-use',
      },
      {
        id: 'fake-volume-2',
        name: 'fake-volume',
        availabilityZone: 'fake-zone-a',
        attachedInstances: ['fake-instance-2'],
        status: 'in-use',
      },
    ]);

    const { result } = render();

    await waitFor(() => {
      expect(result.current.volumes).toStrictEqual([
        { label: 'fake-volume', value: 'fake-volume-2', canBeDetached: true },
      ]);
    });
  });

  describe.each([
    {
      description: 'volumes are attached with less than 16 instances',
      attachedInstancesCount: 5,
      expectedCanBeDetach: false,
    },
    {
      description: 'volumes are attached with more or equal to 16 instances',
      attachedInstancesCount: 16,
      expectedCanBeDetach: true,
    },
  ])(
    'Given region is 3AZ $description',
    ({ attachedInstancesCount, expectedCanBeDetach }) => {
      it(`should return unattached volumes with canBeDetached flag = ${expectedCanBeDetach}`, async () => {
        getInstanceMock.mockResolvedValue({
          ...fakeInstance,
          region: {
            name: 'fake-region3az',
            type: 'region-3-az',
            availabilityZone: 'fake-zone-a',
          },
        });

        getVolumesMock.mockResolvedValue([
          {
            id: 'fake-volume',
            name: 'fake-volume',
            availabilityZone: 'fake-zone-a',
            attachedInstances: [...Array(attachedInstancesCount).keys()],
            status: 'in-use',
          },
        ]);

        const { result } = render();

        await waitFor(() => {
          expect(result.current.volumes).toStrictEqual([
            {
              label: 'fake-volume',
              value: 'fake-volume',
              canBeDetached: expectedCanBeDetach,
            },
          ]);
        });
      });
    },
  );
});
