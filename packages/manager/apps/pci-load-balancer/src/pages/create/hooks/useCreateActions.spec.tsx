import { describe, it, Mock, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react';
import { TRegion } from '@ovh-ux/manager-pci-common';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { useCreateActions } from './useCreateActions';
import { useCreateStore } from '@/pages/create/store';
import { TFlavor } from '@/api/data/load-balancer';
import { useGetFlavor } from '@/api/hook/useFlavors';
import { TProductAddonDetail } from '@/types/product.type';
import { ListenerConfiguration } from '@/types/listener.type';

vi.mock('@/api/hook/useFlavors');

vi.mocked(useGetFlavor as Mock).mockReturnValue({
  data: undefined,
  isPending: true,
});

const mockedTrackClick = vi.fn();
vi.mocked(useOvhTracking().trackClick).mockImplementation(mockedTrackClick);

const mockedNavigate = vi.fn();
vi.mocked(useNavigate).mockReturnValue(mockedNavigate);

const mockedOnSuccess = vi.fn();
const mockedOnError = vi.fn();
vi.mock('@/pages/create/hooks/useCreateCallbacks', () => ({
  useCreateCallbacks: () => ({
    onSuccess: mockedOnSuccess,
    onError: mockedOnError,
  }),
}));

const mockedCreate = vi.fn();
const mockedReset = vi.fn();
vi.mock('@/pages/create/store', () => ({
  useCreateStore: () =>
    ({
      region: { name: 'region' } as TRegion,
      addon: { size: 'size' } as TProductAddonDetail,
      publicIp: 'ip',
      listeners: [
        { protocol: 'p1' },
        { protocol: 'p2' },
      ] as ListenerConfiguration[],
      create: mockedCreate,
      reset: mockedReset,
    } as Partial<ReturnType<typeof useCreateStore>>),
}));

describe('useCreateActions', () => {
  describe('create', () => {
    it('should track', () => {
      const { result: resultActions } = renderHook(() => useCreateActions());
      act(() => resultActions.current.create());

      expect(mockedTrackClick).toHaveBeenCalledTimes(1);
      expect(mockedTrackClick).toHaveBeenCalledWith({
        actions: [
          'confirm',
          `loadbalancer_added_region_private_size_available_2`,
        ],
        actionType: 'action',
        buttonType: ButtonType.button,
        location: PageLocation.funnel,
      });
    });

    it('should create', () => {
      const flavorMock = {
        id: 'id',
        name: 'name',
        region: 'region',
      } as TFlavor;
      (useGetFlavor as Mock).mockImplementation(() => ({
        data: flavorMock,
      }));

      const { result: resultActions } = renderHook(() => useCreateActions());
      act(() => resultActions.current.create());

      expect(mockedCreate).toHaveBeenCalledWith(
        flavorMock,
        expect.any(Function),
        expect.any(Function),
      );
    });
  });

  describe('cancel', () => {
    it('should track', () => {
      const { result: resultActions } = renderHook(() => useCreateActions());

      act(() => resultActions.current.cancel());

      expect(mockedTrackClick).toHaveBeenCalledWith({
        actionType: 'action',
        actions: [
          'confirm',
          'loadbalancer_added_region_private_size_available_2',
        ],
        buttonType: 'button',
        location: 'funnel',
      });
    });

    it('should reset store', () => {
      const { result: resultActions } = renderHook(() => useCreateActions());

      act(() => resultActions.current.cancel());

      expect(mockedReset).toHaveBeenCalled();
    });

    it('should navigate to listing page', () => {
      const { result: resultActions } = renderHook(() => useCreateActions());

      act(() => resultActions.current.cancel());

      expect(mockedNavigate).toHaveBeenCalledWith('..');
    });
  });
});
