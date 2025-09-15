import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnattachedVolumes } from '../useDashboardAction';
import { getInstance } from '@/data/api/instance';
import { TInstance } from '@/types/instance/entity.type';
import { getVolumes } from '@/data/api/volume';

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
  task: {
    isPending: false,
    status: null,
  },
  actions: [{}],
} as TInstance;

const getVolumesMock = vi.fn();

vi.mock('@/data/api/instance');
vi.mock('@/data/api/volume');
vi.mocked(getInstance).mockResolvedValue(fakeInstance);
vi.mocked(getVolumes).mockImplementation(getVolumesMock);

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
  it.each([
    {
      description: 'should return empty when volumes are already attached',
      volumes: [
        {
          id: 'fake-volume-1',
          name: 'fake-volume',
          availabilityZone: 'fake-zone-a',
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
        },
        {
          id: 'fake-volume-2',
          name: 'fake-volume-2',
          availabilityZone: 'fake-zone-b',
        },
        {
          id: 'fake-volume-3',
          name: 'fake-volume-3',
          availabilityZone: 'any',
        },
        {
          id: 'fake-volume-4',
          name: 'fake-volume-4',
          availabilityZone: null,
        },
      ],
      expected: [
        { label: 'fake-volume-3', value: 'fake-volume-3' },
        { label: 'fake-volume-4', value: 'fake-volume-4' },
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
        },
        {
          id: 'fake-volume-2',
          name: 'fake-volume-2',
          availabilityZone: 'fake-zone-a',
        },
        {
          id: 'fake-volume-2',
          name: 'fake-volume-2',
          availabilityZone: 'fake-zone-b',
        },
      ],
      expected: [{ label: 'fake-volume-2', value: 'fake-volume-2' }],
    },
    {
      description:
        'should return only unattached volumes with availabilityZone any and null in the same instance zone',
      volumes: [
        {
          id: 'fake-volume-1',
          name: 'fake-volume',
          availabilityZone: 'fake-zone-a',
        },
        {
          id: 'fake-volume-2',
          name: 'fake-volume-2',
          availabilityZone: 'fake-zone-b',
        },
        {
          id: 'fake-volume-3',
          name: 'fake-volume-3',
          availabilityZone: 'any',
        },
        {
          id: 'fake-volume-4',
          name: 'fake-volume-4',
          availabilityZone: null,
        },
        {
          id: 'fake-volume-5',
          name: 'fake-volume-5',
          availabilityZone: 'fake-zone-a',
        },
      ],
      expected: [
        { label: 'fake-volume-3', value: 'fake-volume-3' },
        { label: 'fake-volume-4', value: 'fake-volume-4' },
        { label: 'fake-volume-5', value: 'fake-volume-5' },
      ],
    },
  ])('$description', async ({ volumes, expected }) => {
    getVolumesMock.mockResolvedValue(volumes);
    const { result } = render();

    await waitFor(() => {
      expect(result.current.volumes).toStrictEqual(expected);
    });
  });
});
