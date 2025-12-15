import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TLocalisation } from '@ovh-ux/manager-pci-common';

import { UpdatePolicy } from '@/types';

import { useClusterCreationStepper } from './useCusterCreationStepper';

vi.mock('./useStep', () => ({
  useStep: vi.fn().mockReturnValue({
    isOpen: false,
    unlock: vi.fn(),
    uncheck: vi.fn(),
    close: vi.fn(),
    check: vi.fn(),
    lock: vi.fn(),
    open: vi.fn(),
  }),
}));

describe('useClusterCreationStepper', () => {
  it('should initialize with default form values', () => {
    const { result } = renderHook(useClusterCreationStepper);

    expect(result.current.form).toEqual({
      region: null,
      version: '',
      plan: null,
      updatePolicy: null,
      network: null,

      clusterName: '',
    });
  });

  it('should update cluster name and progress step', () => {
    const { result } = renderHook(useClusterCreationStepper);

    act(() => {
      result.current.clusterName.submit('MyCluster');
    });

    expect(result.current.form.clusterName).toBe('MyCluster');
    expect(result.current.clusterName.step.check).toHaveBeenCalled();
    expect(result.current.clusterName.step.lock).toHaveBeenCalled();
    expect(result.current.location.step.open).toHaveBeenCalled();
  });

  it('should update region and progress step', () => {
    const { result } = renderHook(() => useClusterCreationStepper());
    const mockRegion = {
      name: 'GRA1',
      country: 'FR',
    } as unknown as TLocalisation;

    act(() => {
      result.current.location.submit(mockRegion);
    });

    expect(result.current.form.region).toEqual(mockRegion);
    expect(result.current.location.step.check).toHaveBeenCalled();
    expect(result.current.location.step.lock).toHaveBeenCalled();
    expect(result.current.version.step.open).toHaveBeenCalled();
  });

  it('should update version and update policy then progress step', () => {
    const { result } = renderHook(() => useClusterCreationStepper());

    act(() => {
      result.current.version.submit('1.23', UpdatePolicy.AlwaysUpdate);
    });

    expect(result.current.form.version).toBe('1.23');
    expect(result.current.form.updatePolicy).toBe(UpdatePolicy.AlwaysUpdate);
    expect(result.current.version.step.check).toHaveBeenCalled();
    expect(result.current.version.step.lock).toHaveBeenCalled();
    expect(result.current.network.step.open).toHaveBeenCalled();
  });
});
