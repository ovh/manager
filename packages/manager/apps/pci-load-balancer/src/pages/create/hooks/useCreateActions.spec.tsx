import { describe, it, Mock, vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { useCreateActions } from './useCreateActions';
import { TAddon, useCreateStore } from '@/pages/create/store';
import { TRegion } from '@/api/hook/useRegions';
import { useTracking } from '../hooks/useTracking';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';
import { TFlavor } from '@/api/data/load-balancer';
import { useGetFlavor } from '@/api/hook/useFlavors';

vi.mock('@/api/hook/useFlavors', async () => {
  const { ...rest } = await vi.importActual('@/api/hook/useAddons');
  return {
    ...rest,
    useGetFlavor: vi
      .fn()
      .mockImplementation(() => ({ data: undefined, isPending: true })),
  };
});

vi.mock('../hooks/useTracking', async () => {
  const { ...rest } = await vi.importActual('../hooks/useTracking');

  return {
    ...rest,
    useTracking: vi.fn().mockImplementation(() => ({
      trackClick: vi.fn(),
      trackPage: vi.fn(),
    })),
  };
});

vi.mock('react-router-dom', async () => {
  const { ...rest } = await vi.importActual('react-router-dom');

  return {
    ...rest,
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
  };
});

const renderStore = () => renderHook(() => useCreateStore());

describe('useCreateActions', () => {
  describe('create', () => {
    it('should track', () => {
      const [trackClickSpy, trackPageSpy] = [vi.fn(), vi.fn()];
      (useTracking as Mock).mockImplementation(() => ({
        trackClick: trackClickSpy,
        trackPage: trackPageSpy,
      }));

      const { result: resultActions } = renderHook(() => useCreateActions());
      const { result: resultStore } = renderStore();

      const { create } = resultStore.current;

      resultStore.current.create = vi.fn();

      act(() => {
        resultStore.current.set.addon({ code: 'code' } as TAddon);
        resultStore.current.set.region({ name: 'name' } as TRegion);
      });

      act(() => resultActions.current.create());

      expect(trackClickSpy).toHaveBeenCalledTimes(2);

      expect(trackClickSpy).toHaveBeenNthCalledWith(1, {
        name: LOAD_BALANCER_CREATION_TRACKING.SUBMIT,
        type: 'action',
      });

      expect(trackClickSpy).toHaveBeenNthCalledWith(2, {
        name: `${LOAD_BALANCER_CREATION_TRACKING.CONFIRM}::code::name`,
        type: 'action',
      });

      resultStore.current.create = create;
    });

    it('should create', () => {
      const { result: resultActions } = renderHook(() => useCreateActions());
      const { result: resultStore } = renderStore();

      const flavorMock = {
        id: 'id',
        name: 'name',
        region: 'region',
      } as TFlavor;
      (useGetFlavor as Mock).mockImplementation(() => ({
        data: flavorMock,
      }));

      act(() => {
        resultStore.current.set.addon({ code: 'code' } as TAddon);
        resultStore.current.set.region({ name: 'name' } as TRegion);
        resultStore.current.set.name('');
      });

      const { create } = resultStore.current;

      resultStore.current.create = vi.fn();

      act(() => resultActions.current.create());

      expect(resultStore.current.create).toHaveBeenCalledWith(
        flavorMock,
        expect.any(Function),
        expect.any(Function),
      );

      resultStore.current.create = create;
    });
  });

  describe('cancel', () => {
    it('should track', () => {
      const [trackClickSpy, trackPageSpy] = [vi.fn(), vi.fn()];

      (useTracking as Mock).mockImplementation(() => ({
        trackClick: trackClickSpy,
        trackPage: trackPageSpy,
      }));
      const { result: resultActions } = renderHook(() => useCreateActions());

      act(() => resultActions.current.cancel());

      expect(trackClickSpy).toHaveBeenNthCalledWith(1, {
        name: LOAD_BALANCER_CREATION_TRACKING.CANCEL,
        type: 'action',
      });
    });

    it('should reset store', () => {
      const { result: resultActions } = renderHook(() => useCreateActions());
      const { result: resultStore } = renderStore();
      const { reset } = resultStore.current;
      resultStore.current.reset = vi.fn();

      act(() => resultActions.current.cancel());

      expect(resultStore.current.reset).toHaveBeenCalled();

      resultStore.current.reset = reset;
    });

    it('should navigate to listing page', () => {
      const navigateSpy = vi.fn();

      (useNavigate as Mock).mockImplementation(() => navigateSpy);
      const { result: resultActions } = renderHook(() => useCreateActions());

      act(() => resultActions.current.cancel());

      expect(navigateSpy).toHaveBeenCalledWith('..');
    });
  });
});
