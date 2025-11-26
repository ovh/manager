import { ReactElement } from 'react';

import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { TVolume } from '@/api/hooks/useVolume';
import ActionsComponent from '@/components/list/Actions.component';
import CapacityComponent from '@/components/list/Capacity.component';
import StatusComponent from '@/components/list/Status.component';
import { isBlockStorageListColumn, useDatagridColumn } from '@/hooks/useDatagridColumn';

type ElementWithProps<T> = T extends (p: infer P) => JSX.Element ? ReactElement<P> : never;

type TextCellElement = ElementWithProps<typeof DataGridTextCell>;

const volumeTestData: TVolume[] = [
  {
    id: 'vol-01',
    attachedTo: ['inst-01', 'inst-02'],
    creationDate: '2022-01-01T00:00:00Z',
    name: 'Volume 1',
    description: 'Test volume 1',
    size: 100,
    status: 'available',
    statusGroup: 'available',
    statusLabel: 'volumeStatus',
    region: 'us-west-2',
    bootable: false,
    planCode: 'plan-01',
    type: 'gp2',
    regionName: 'US West (Oregon)',
    availabilityZone: 'any',
    canDetachInstance: true,
    canAttachInstance: true,
    maxAttachedInstances: 3,
  },
] as TVolume[];

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn('project-01', '/project-01'));

    const columns = result.current;

    expect(columns).toHaveLength(9);
    expect(columns[0]?.id).toBe('name');
    expect(columns[1]?.id).toBe('id');
    expect(columns[2]?.id).toBe('regionName');
    expect(columns[3]?.id).toBe('type');
    expect(columns[4]?.id).toBe('size');
    expect(columns[5]?.id).toBe('attachedTo');
    expect(columns[6]?.id).toBe('encryptionStatus');
    expect(columns[7]?.id).toBe('status');
    expect(columns[8]?.id).toBe('actions');
  });

  it('should render correct cells', () => {
    const { result } = renderHook(() => useDatagridColumn('project-01', '/project-01'));

    const columns = result.current;

    const nameCell = columns[0]?.cell(volumeTestData[0]!) as TextCellElement;
    const idCell = columns[1]?.cell(volumeTestData[0]!) as TextCellElement;
    const regionNameCell = columns[2]?.cell(volumeTestData[0]!) as TextCellElement;
    const typeCell = columns[3]?.cell(volumeTestData[0]!) as TextCellElement;
    const sizeCell = columns[4]?.cell(volumeTestData[0]!) as ElementWithProps<
      typeof CapacityComponent
    >;
    const attachedToCell = columns[5]?.cell(volumeTestData[0]!) as TextCellElement;
    const encryptionStatusCell = columns[6]?.cell(volumeTestData[0]!) as TextCellElement;
    const statusCell = columns[7]?.cell(volumeTestData[0]!) as ElementWithProps<
      typeof StatusComponent
    >;
    const actionsCell = columns[8]?.cell(volumeTestData[0]!) as ElementWithProps<
      typeof ActionsComponent
    >;

    expect(nameCell?.props.children).toBe(volumeTestData[0]?.name);
    expect(idCell?.props.children).toBe(volumeTestData[0]?.id);
    expect(regionNameCell?.props.children).toBe(volumeTestData[0]?.regionName);
    expect(typeCell?.props.children).toBe(volumeTestData[0]?.type);
    expect(sizeCell?.props.size).toBe(volumeTestData[0]?.size);
    expect(attachedToCell?.props.children).toHaveLength(volumeTestData[0]!.attachedTo.length);
    expect(encryptionStatusCell?.props.children).toBe(volumeTestData[0]?.encryptionStatus);
    expect(statusCell?.props.statusGroup).toBe(volumeTestData[0]?.statusGroup);
    expect(statusCell?.props.status).toBe(volumeTestData[0]?.statusLabel);
    expect(actionsCell?.props.projectUrl).toBeDefined();
    expect(actionsCell?.props.volume).toBe(volumeTestData[0]);
  });

  describe('isBlockStorageListColumn', () => {
    it('should return true given a correct column', () => {
      const result = isBlockStorageListColumn('encryptionStatus');

      expect(result).toBe(true);
    });

    it('should return false given an incorrect column', () => {
      const result = isBlockStorageListColumn('aaaa');

      expect(result).toBe(false);
    });
  });
});
