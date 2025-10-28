import { renderHook } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { ensureNameIsUnique } from '@/helpers';
import { isNodePoolNameValid } from '@/helpers/matchers/matchers';
import { NodePoolPrice, NodePoolState } from '@/types';

import { useNodePoolErrors } from './useNodePoolErrors';

vi.mock('@/helpers', () => ({
  ensureNameIsUnique: vi.fn(),
}));

vi.mock('@/helpers/matchers/matchers', () => ({
  isNodePoolNameValid: vi.fn(),
}));

describe('useNodePoolErrors', () => {
  const createNodePoolState = (overrides?: Partial<NodePoolState>): NodePoolState => ({
    name: 'test-pool',
    antiAffinity: false,
    isTouched: false,
    scaling: {
      quantity: { desired: 1, min: 0, max: 5 },
      isAutoscale: false,
    },
    ...overrides,
  });

  const createNodePool = (name: string): NodePoolPrice => ({
    name,
    antiAffinity: false,
    autoscale: false,
    desiredNodes: 1,
    flavorName: 'b2-7',
    monthlyPrice: 100,
    monthlyBilled: false,
    localisation: 'GRA7',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (isNodePoolNameValid as Mock).mockReturnValue(true);
    (ensureNameIsUnique as Mock).mockImplementation(() => {});
  });

  describe('isValidName', () => {
    it('should return true when name is valid', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(true);

      const nodePoolState = createNodePoolState({ name: 'valid-name' });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.isValidName).toBe(true);
    });

    it('should return false when name is invalid', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(false);

      const nodePoolState = createNodePoolState({ name: 'Invalid-Name' });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.isValidName).toBe(false);
    });
  });

  describe('error validation - valid pattern', () => {
    it('should set valid error when name is invalid and touched', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(false);

      const nodePoolState = createNodePoolState({ name: 'Invalid', isTouched: true });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.error?.valid).toBe(
        'kube_add_node_pool_name_input_pattern_validation_error',
      );
    });

    it('should not set valid error when name is invalid but not touched', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(false);

      const nodePoolState = createNodePoolState({ name: 'Invalid', isTouched: false });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.error?.valid).toBeNull();
    });

    it('should clear valid error when name becomes valid', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(true);

      const nodePoolState = createNodePoolState({ name: 'valid-name', isTouched: true });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.error?.valid).toBeNull();
    });
  });

  describe('error validation - uniqueness without availability zones', () => {
    it('should not set exists error when nodes list is empty', () => {
      const nodePoolState = createNodePoolState({ name: 'test-pool' });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, []));

      expect(result.current.error?.exists).toBeNull();
    });

    it('should not set exists error when nodes is null', () => {
      const nodePoolState = createNodePoolState({ name: 'test-pool' });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.error?.exists).toBeNull();
    });

    it('should validate name uniqueness when no availability zones', () => {
      const nodes = [createNodePool('existing-pool')];
      const nodePoolState = createNodePoolState({ name: 'new-pool' });

      renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(ensureNameIsUnique).toHaveBeenCalledWith('new-pool', nodes);
    });

    it('should set exists error when name is not unique', () => {
      (ensureNameIsUnique as Mock).mockImplementation(() => {
        throw new Error('name already exists');
      });

      const nodes = [createNodePool('existing-pool')];
      const nodePoolState = createNodePoolState({ name: 'existing-pool' });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(result.current.error?.exists).toBe(
        'kube_add_node_pool_name_already_exist_validation_error',
      );
    });
  });

  describe('error validation - uniqueness with availability zones', () => {
    it('should validate name with single checked zone', () => {
      const nodes = [createNodePool('test-pool-a')];
      const nodePoolState = createNodePoolState({
        name: 'test-pool',
        selectedAvailabilityZones: [
          { zone: 'zone-a', checked: true },
          { zone: 'zone-b', checked: false },
        ],
      });

      renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(ensureNameIsUnique).toHaveBeenCalled();
    });

    it('should validate name with multiple checked zones', () => {
      const nodes = [createNodePool('test-pool-a')];
      const nodePoolState = createNodePoolState({
        name: 'test-pool',
        selectedAvailabilityZones: [
          { zone: 'zone-a', checked: true },
          { zone: 'zone-b', checked: true },
        ],
      });

      renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(ensureNameIsUnique).toHaveBeenCalledTimes(2);
    });

    it('should validate base name when all zones are unchecked', () => {
      const nodes = [createNodePool('existing-pool')];
      const nodePoolState = createNodePoolState({
        name: 'new-pool',
        selectedAvailabilityZones: [
          { zone: 'zone-a', checked: false },
          { zone: 'zone-b', checked: false },
        ],
      });

      renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(ensureNameIsUnique).toHaveBeenCalledWith('new-pool', nodes);
    });
  });

  describe('handleCreationError', () => {
    it('should set exists error when error message is "name already exists"', () => {
      const nodePoolState = createNodePoolState();
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      const error = new Error('name already exists');
      result.current.handleCreationError(error);

      expect(result.current.error?.exists).toBe(
        'kube_add_node_pool_name_already_exist_validation_error',
      );
    });

    it('should not set exists error for other error messages', () => {
      const nodePoolState = createNodePoolState();
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      const error = new Error('some other error');
      result.current.handleCreationError(error);

      expect(result.current.error?.exists).toBeNull();
    });

    it('should not set exists error when error is not an Error instance', () => {
      const nodePoolState = createNodePoolState();
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      result.current.handleCreationError('string error');

      expect(result.current.error?.exists).toBeNull();
    });

    it('should not set exists error when error is null', () => {
      const nodePoolState = createNodePoolState();
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      result.current.handleCreationError(null);

      expect(result.current.error?.exists).toBeNull();
    });
  });

  describe('clearExistsError', () => {
    it('should clear exists error', () => {
      (ensureNameIsUnique as Mock).mockImplementation(() => {
        throw new Error('name already exists');
      });

      const nodes = [createNodePool('existing-pool')];
      const nodePoolState = createNodePoolState({ name: 'existing-pool' });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(result.current.error?.exists).toBe(
        'kube_add_node_pool_name_already_exist_validation_error',
      );

      result.current.clearExistsError();

      expect(result.current.error?.exists).toBeNull();
    });

    it('should not affect valid error', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(false);

      const nodePoolState = createNodePoolState({ name: 'Invalid', isTouched: true });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.error?.valid).toBe(
        'kube_add_node_pool_name_input_pattern_validation_error',
      );

      result.current.clearExistsError();

      expect(result.current.error?.valid).toBe(
        'kube_add_node_pool_name_input_pattern_validation_error',
      );
      expect(result.current.error?.exists).toBeNull();
    });
  });

  describe('error object structure', () => {
    it('should return null when no errors', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(true);

      const nodePoolState = createNodePoolState({ name: 'valid-name', isTouched: false });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, null));

      expect(result.current.error).toEqual({ valid: null, exists: null });
    });

    it('should return both errors when both validations fail', () => {
      (isNodePoolNameValid as Mock).mockReturnValue(false);
      (ensureNameIsUnique as Mock).mockImplementation(() => {
        throw new Error('name already exists');
      });

      const nodes = [createNodePool('existing-pool')];
      const nodePoolState = createNodePoolState({
        name: 'existing-pool',
        isTouched: true,
      });
      const { result } = renderHook(() => useNodePoolErrors(nodePoolState, nodes));

      expect(result.current.error?.valid).toBe(
        'kube_add_node_pool_name_input_pattern_validation_error',
      );
      expect(result.current.error?.exists).toBe(
        'kube_add_node_pool_name_already_exist_validation_error',
      );
    });
  });
});
