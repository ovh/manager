import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { applyFilters } from '@ovh-ux/manager-core-api';
import {
  useAllLoadBalancers,
  useLoadBalancers,
  useLoadBalancer,
  useLoadBalancerFlavor,
  useDeleteLoadBalancer,
  useRenameLoadBalancer,
  useCreateLoadBalancer,
} from './useLoadBalancer';
import {
  getLoadBalancers,
  getLoadBalancer,
  getLoadBalancerFlavor,
  deleteLoadBalancer,
  updateLoadBalancerName,
  createLoadBalancer,
  TLoadBalancer,
  TFlavor,
  TLoadBalancerResponse,
} from '../data/load-balancer';
import { paginateResults, sortResults } from '@/helpers';
import { wrapper } from '@/wrapperRenders';
import { TPrivateNetwork, TSubnet } from '../data/network';
import { TFloatingIp } from '../data/floating-ips';
import { TRegion } from './useRegions';

vi.mock('../data/load-balancer');

describe('useLoadBalancer hooks', () => {
  describe('useAllLoadBalancers', () => {
    it('should fetch all load balancers', async () => {
      const mockData = [{ id: '1', name: 'lb1' }] as TLoadBalancer[];
      vi.mocked(getLoadBalancers).mockResolvedValue({
        resources: mockData,
      } as TLoadBalancerResponse);

      const { result } = renderHook(() => useAllLoadBalancers('projectId'), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useLoadBalancers', () => {
    it('should return paginated and sorted load balancers', async () => {
      const mockData = [{ id: '1', name: 'lb1' }] as TLoadBalancer[];
      vi.mocked(getLoadBalancers).mockResolvedValue({
        resources: mockData,
      } as TLoadBalancerResponse);
      vi.mocked(applyFilters).mockReturnValue(mockData);
      vi.mocked(sortResults).mockReturnValue(mockData);
      vi.mocked(paginateResults).mockReturnValue({
        rows: mockData,
        pageCount: 1,
        totalRows: 1,
      });

      const pagination = { pageIndex: 0, pageSize: 10 };
      const sorting = { id: 'name', desc: false };
      const filters = [];

      const { result } = renderHook(
        () => useLoadBalancers('projectId', pagination, sorting, filters),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.paginatedLoadBalancer).toEqual({
        rows: mockData,
        pageCount: 1,
        totalRows: 1,
      });
    });
  });

  describe('useLoadBalancer', () => {
    it('should fetch a single load balancer', async () => {
      const mockData = { id: '1', name: 'lb1' } as TLoadBalancer;
      vi.mocked(getLoadBalancer).mockResolvedValue(mockData);

      const { result } = renderHook(
        () =>
          useLoadBalancer({
            projectId: 'projectId',
            region: 'region',
            loadBalancerId: 'loadBalancerId',
          }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useLoadBalancerFlavor', () => {
    it('should fetch load balancer flavor', async () => {
      const mockData = { id: '1', name: 'flavor1' } as TFlavor;
      vi.mocked(getLoadBalancerFlavor).mockResolvedValue(mockData);

      const { result } = renderHook(
        () =>
          useLoadBalancerFlavor({
            projectId: 'projectId',
            region: 'region',
            flavorId: 'flavorId',
          }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useDeleteLoadBalancer', () => {
    it('should delete a load balancer', async () => {
      vi.mocked(deleteLoadBalancer).mockResolvedValue({} as never);
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useDeleteLoadBalancer({
            projectId: 'projectId',
            loadBalancer: { id: '1', name: 'lb1' } as TLoadBalancer,
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.deleteLoadBalancer();
      });

      expect(deleteLoadBalancer).toHaveBeenCalledWith('projectId', {
        id: '1',
        name: 'lb1',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('useRenameLoadBalancer', () => {
    it('should rename a load balancer', async () => {
      vi.mocked(updateLoadBalancerName).mockResolvedValue({});
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useRenameLoadBalancer({
            projectId: 'projectId',
            loadBalancer: { id: '1', name: 'lb1' } as TLoadBalancer,
            name: 'newName',
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.renameLoadBalancer();
      });

      expect(updateLoadBalancerName).toHaveBeenCalledWith(
        'projectId',
        { id: '1', name: 'lb1' },
        'newName',
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('useCreateLoadBalancer', () => {
    it('should create a load balancer', async () => {
      vi.mocked(createLoadBalancer).mockResolvedValue({});
      const onError = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useCreateLoadBalancer({
            projectId: 'projectId',
            flavor: {
              id: '1',
              name: 'flavor',
            } as TFlavor,
            region: {
              name: 'region',
            } as TRegion,
            floatingIp: {
              id: '1',
              ip: '1.1.1.1',
            } as TFloatingIp,
            privateNetwork: {
              id: '1',
              name: 'privateNetwork',
            } as TPrivateNetwork,
            subnet: {
              id: '1',
              name: 'subnet',
            } as TSubnet,
            gateways: [],
            listeners: [],
            name: 'lb1',
            onError,
            onSuccess,
          }),
        { wrapper },
      );

      await act(async () => {
        await result.current.doCreateLoadBalancer();
      });

      expect(createLoadBalancer).toHaveBeenCalledWith({
        projectId: 'projectId',
        flavor: {
          id: '1',
          name: 'flavor',
        },
        region: {
          name: 'region',
        },
        floatingIp: {
          id: '1',
          ip: '1.1.1.1',
        },
        privateNetwork: {
          id: '1',
          name: 'privateNetwork',
        },
        subnet: {
          id: '1',
          name: 'subnet',
        },
        gateways: [],
        listeners: [],
        name: 'lb1',
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
