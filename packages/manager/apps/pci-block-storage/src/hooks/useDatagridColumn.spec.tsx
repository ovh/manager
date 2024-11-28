import { describe, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';
import { TVolume } from '@/api/data/volume';
import { Instance } from '@/api/data/instance';

const volumeTestData: TVolume[] = [
  {
    id: 'vol-01',
    attachedTo: ['inst-01', 'inst-02'],
    instances: [
      {
        id: 'inst-01',
        name: 'Instance 1',
      },
      {
        id: 'inst-02',
        name: 'Instance 2',
      },
    ] as Instance[],
    creationDate: '2022-01-01T00:00:00Z',
    name: 'Volume 1',
    description: 'Test volume 1',
    size: 100,
    status: 'available',
    statusGroup: 'available',
    region: 'us-west-2',
    bootable: false,
    planCode: 'plan-01',
    type: 'gp2',
    regionName: 'US West (Oregon)',
  },
];

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('project-01', '/project-01'),
    );

    const columns = result.current;

    expect(columns).toHaveLength(8);
    expect(columns[0].id).toBe('name');
    expect(columns[1].id).toBe('id');
    expect(columns[2].id).toBe('regionName');
    expect(columns[3].id).toBe('type');
    expect(columns[4].id).toBe('size');
    expect(columns[5].id).toBe('attachedTo');
    expect(columns[6].id).toBe('status');
    expect(columns[7].id).toBe('actions');
  });

  it('should render correct cells', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('project-01', '/project-01'),
    );

    const columns = result.current;

    const nameCell = columns[0].cell(volumeTestData[0]);
    const idCell = columns[1].cell(volumeTestData[0]);
    const regionNameCell = columns[2].cell(volumeTestData[0]);
    const typeCell = columns[3].cell(volumeTestData[0]);
    const sizeCell = columns[4].cell(volumeTestData[0]);
    const attachedToCell = columns[5].cell(volumeTestData[0]);
    const statusCell = columns[6].cell(volumeTestData[0]);
    const actionsCell = columns[7].cell(volumeTestData[0]);

    expect(nameCell.props.children).toBe(volumeTestData[0].name);
    expect(idCell.props.children).toBe(volumeTestData[0].id);
    expect(regionNameCell.props.children).toBe(volumeTestData[0].regionName);
    expect(typeCell.props.children).toBe(volumeTestData[0].type);
    expect(sizeCell.props.size).toBe(volumeTestData[0].size);
    expect(attachedToCell.props.children).toHaveLength(
      volumeTestData[0].attachedTo.length,
    );
    expect(statusCell.props.statusGroup).toBe(volumeTestData[0].statusGroup);
    expect(statusCell.props.status).toBe(volumeTestData[0].status);
    expect(actionsCell.props.projectUrl).toBeDefined();
    expect(actionsCell.props.volume).toBe(volumeTestData[0]);
  });
});
