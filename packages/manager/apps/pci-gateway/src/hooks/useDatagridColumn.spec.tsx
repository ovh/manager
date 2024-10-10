import { renderHook } from '@testing-library/react';
import { describe, it } from 'vitest';
import { useDatagridColumn } from './useDatagridColumn';
import { Gateway, Interface } from '@/interface';

describe('useDatagridColumn', () => {
  it('renders name cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const nameCell = result.current[0].cell({
      name: 'testName',
      id: 'testId',
    } as Gateway);
    expect(nameCell.props.children[0].props.children).toBe('testName');
    expect(nameCell.props.children[1].props.children).toBe('testId');
  });

  it('renders region cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const regionCell = result.current[1].cell({
      region: 'testRegion',
    } as Gateway);
    expect(regionCell.props.children).toBe('testRegion');
  });

  it('renders networksConnected cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const networksConnectedCell = result.current[2].cell({
      connectedNetworkCount: 2,
    } as Gateway);
    expect(networksConnectedCell.props.children).toBe(2);
  });

  it('renders formattedIps cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const formattedIpsCell = result.current[3].cell({
      formattedIps: 'testIps',
    } as Gateway);
    expect(formattedIpsCell.props.children).toBe('testIps');
  });

  it('renders flavour cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const flavourCell = result.current[4].cell({
      model: 'testModel',
    } as Gateway);
    expect(flavourCell.props.children).toBe('testModel');
  });

  it('renders status cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const statusCell = result.current[5].cell({
      status: 'testStatus',
    } as Gateway);
    expect(statusCell.props.children).toBe('testStatus');
  });

  it('renders privateIPs cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const interfaces: Interface[] = [
      {
        id: 'test-id',
        ip: '192.168.1.1',
        subnetId: 'test-subnet-id',
        networkId: 'test-network-id',
      },
      {
        id: 'test-id2',
        ip: '192.168.1.2',
        subnetId: 'test-subnet-id-2',
        networkId: 'test-network-id-2',
      },
    ];
    const privateIPsCell = result.current[6].cell({
      interfaces,
    } as Gateway);
    expect(privateIPsCell.props.interfaces).toBe(interfaces);
  });

  it('renders actions cell correctly', () => {
    const { result } = renderHook(() =>
      useDatagridColumn('projectId', 'privateNetworkUrl'),
    );
    const actionsCell = result.current[7].cell({ id: 'testId' } as Gateway);
    expect(actionsCell.props.children.props.gateway).toStrictEqual({
      id: 'testId',
    });
  });
});
