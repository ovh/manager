import React from 'react';

import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { ApiResponse } from '@ovh-ux/manager-core-api';
import { useDeleteService } from '../../../services/hooks/useDeleteService';
import { Cart, CartItem, Order } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { getUpgradedBandwidth } from '../../api/get/upgradedBandwidth';
import {
  addVrackBandwidthToCart,
  assignCart,
  checkoutCart,
  createCart,
} from '../../api/post/cart';
import {
  UpgradeBandwidthResponse,
  postUpgradeBandwidth,
} from '../../api/post/upgradeBandwidth';
import { useVrackDefaultBandwidthCartOptions } from '../useDefaultBandwidthOptions';
import { useUpgradeDowngradeBandwidth } from '../useUpgradeDowngradeBandwidth';
import { DEFAULT_BANDWIDTH_PLAN_CODE } from '../useVrackBandwidthCartOptions';

vi.mock('../../api/get/upgradedBandwidth', () => ({
  getUpgradedBandwidth: vi.fn(),
}));
vi.mock('../../api/post/upgradeBandwidth', () => ({
  postUpgradeBandwidth: vi.fn(),
}));
vi.mock('../../api/post/cart', () => ({
  createCart: vi.fn(),
  assignCart: vi.fn(),
  addVrackBandwidthToCart: vi.fn(),
  checkoutCart: vi.fn(),
}));
vi.mock('../useDefaultBandwidthOptions', () => ({
  useVrackDefaultBandwidthCartOptions: vi.fn(),
}));
vi.mock('../useVrackBandwidthCartOptions', () => ({
  DEFAULT_BANDWIDTH_PLAN_CODE: 'default-bandwidth-plancode',
}));
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
}));
vi.mock('../../../services/hooks/useDeleteService', () => ({
  useDeleteService: vi.fn(),
}));

type DefaultBandwidthQueryResult = ReturnType<
  typeof useVrackDefaultBandwidthCartOptions
>;

function mockUseMutation() {
  vi.mocked(useMutation).mockImplementation(
    (options: UseMutationOptions<unknown, unknown, unknown, unknown>) => {
      return ({
        mutate: (vars: unknown) => {
          void Promise.resolve(options.mutationFn!(vars))
            .then((res) => options.onSuccess?.(res, vars, undefined))
            .catch((err: unknown) => options.onError?.(err, vars, undefined));
        },
        mutateAsync: (vars: unknown) =>
          Promise.resolve(options.mutationFn!(vars)),
      } as unknown) as UseMutationResult<unknown, unknown, unknown, unknown>;
    },
  );
}

describe('useUpgradeDowngradeBandwidth (new)', () => {
  const defaultSubsidiary = 'FR';

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMutation();
    vi.mocked(useDeleteService).mockReturnValue(({
      mutateAsync: vi.fn(),
    } as unknown) as ReturnType<typeof useDeleteService>);
  });

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <ShellContext.Provider
      value={
        ({
          environment: { user: { ovhSubsidiary: defaultSubsidiary } },
        } as unknown) as React.ContextType<typeof ShellContext>
      }
    >
      {children}
    </ShellContext.Provider>
  );

  it('creates a cart and checks out when default bandwidth option applies', async () => {
    const cartResponse = ({
      data: { cartId: 'cart-123' },
    } as unknown) as ApiResponse<Cart>;

    vi.mocked(useVrackDefaultBandwidthCartOptions).mockReturnValue(({
      data: { isDefaultBandwidthOption: () => true },
    } as unknown) as DefaultBandwidthQueryResult);

    vi.mocked(createCart).mockResolvedValue(cartResponse);
    vi.mocked(assignCart).mockResolvedValue(
      ({} as unknown) as ApiResponse<void>,
    );
    vi.mocked(addVrackBandwidthToCart).mockResolvedValue(
      ({} as unknown) as ApiResponse<CartItem>,
    );
    vi.mocked(checkoutCart).mockResolvedValue(
      ({} as unknown) as ApiResponse<Order>,
    );

    const { result } = renderHook(
      () =>
        useUpgradeDowngradeBandwidth({
          serviceName: 'service-1',
          currentBandwidthLimit: 0,
          region: 'FR',
        }),
      {
        wrapper,
      },
    );

    await result.current.mutateAsync({ planCode: 'band-1' });

    expect(createCart).toHaveBeenCalledWith(defaultSubsidiary);
    expect(assignCart).toHaveBeenCalledWith(cartResponse.data.cartId);
    expect(addVrackBandwidthToCart).toHaveBeenCalled();
    expect(checkoutCart).toHaveBeenCalledWith(cartResponse.data.cartId);
  });

  it('posts upgrade when default option is false', async () => {
    vi.mocked(useVrackDefaultBandwidthCartOptions).mockReturnValue(({
      data: { isDefaultBandwidthOption: () => false },
    } as unknown) as DefaultBandwidthQueryResult);

    vi.mocked(getUpgradedBandwidth).mockResolvedValue({
      data: ['service-1-FR'],
    } as ApiResponse<string[]>);
    vi.mocked(postUpgradeBandwidth).mockResolvedValue(
      ({} as unknown) as ApiResponse<UpgradeBandwidthResponse>,
    );

    const { result } = renderHook(
      () =>
        useUpgradeDowngradeBandwidth({
          serviceName: 'service-1',
          currentBandwidthLimit: 0,
          region: 'FR',
        }),
      {
        wrapper,
      },
    );

    await result.current.mutateAsync({ planCode: 'non-default' });

    expect(postUpgradeBandwidth).toHaveBeenCalled();
  });

  it('calls refetch when data is undefined then proceeds', async () => {
    type RefetchResult = Awaited<
      ReturnType<DefaultBandwidthQueryResult['refetch']>
    >;

    const refetch = vi.fn().mockResolvedValue(({
      data: { isDefaultBandwidthOption: () => false },
    } as unknown) as RefetchResult);

    vi.mocked(useVrackDefaultBandwidthCartOptions).mockReturnValue(({
      data: undefined,
      refetch,
    } as unknown) as DefaultBandwidthQueryResult);

    vi.mocked(getUpgradedBandwidth).mockResolvedValue({
      data: ['s-1-FR'],
    } as ApiResponse<string[]>);
    vi.mocked(postUpgradeBandwidth).mockResolvedValue(
      ({} as unknown) as ApiResponse<UpgradeBandwidthResponse>,
    );

    const { result } = renderHook(
      () =>
        useUpgradeDowngradeBandwidth({
          serviceName: 's-1',
          currentBandwidthLimit: 0,
          region: 'FR',
        }),
      {
        wrapper,
      },
    );

    await result.current.mutateAsync({ planCode: 'p-1' });

    expect(refetch).toHaveBeenCalledWith({ throwOnError: true });
    expect(postUpgradeBandwidth).toHaveBeenCalled();
  });

  it('deletes service when plan is DEFAULT_BANDWIDTH_PLAN_CODE and not default', async () => {
    const mutateAsync = vi
      .fn()
      .mockResolvedValue({ data: { message: 'deleted' } } as ApiResponse<{
        message: string;
      }>);

    vi.mocked(useDeleteService).mockReturnValue(({
      mutateAsync,
    } as unknown) as ReturnType<typeof useDeleteService>);

    vi.mocked(useVrackDefaultBandwidthCartOptions).mockReturnValue(({
      data: { isDefaultBandwidthOption: () => false },
    } as unknown) as DefaultBandwidthQueryResult);

    vi.mocked(getUpgradedBandwidth).mockResolvedValue({
      data: ['s-1-FR'],
    } as ApiResponse<string[]>);

    const { result } = renderHook(
      () =>
        useUpgradeDowngradeBandwidth({
          serviceName: 's-1',
          currentBandwidthLimit: 0,
          region: 'FR',
        }),
      {
        wrapper,
      },
    );

    const res = await result.current.mutateAsync({
      planCode: DEFAULT_BANDWIDTH_PLAN_CODE,
    });

    expect(mutateAsync).toHaveBeenCalled();
    expect(res.order).toBeNull();
    expect((res as { order: null; message: string }).message).toBe('deleted');
  });

  it('throws when no upgraded service found', async () => {
    vi.mocked(useVrackDefaultBandwidthCartOptions).mockReturnValue(({
      data: { isDefaultBandwidthOption: () => false },
    } as unknown) as DefaultBandwidthQueryResult);

    vi.mocked(getUpgradedBandwidth).mockResolvedValue({
      data: ['other-FR'],
    } as ApiResponse<string[]>);

    const { result } = renderHook(
      () =>
        useUpgradeDowngradeBandwidth({
          serviceName: 's-1',
          currentBandwidthLimit: 0,
          region: 'FR',
        }),
      {
        wrapper,
      },
    );

    await expect(result.current.mutateAsync({ planCode: 'p' })).rejects.toThrow(
      'No upgraded bandwidth option found for this service',
    );
  });
});
