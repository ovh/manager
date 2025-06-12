import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import useRedirectTarget from './useRedirectTarget';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

// Mock PCI_FEATURES_STATES
vi.mock('@/constants', () => ({
  PCI_FEATURES_STATES: {
    CATEGORY1: {
      STATE1: {
        targetParamKeys: ['params'],
        someProperty: 'value1',
      },
      STATE2: {
        targetParamKeys: ['customParams', 'additionalParams'],
        someProperty: 'value2',
      },
    },
    CATEGORY2: {
      STATE3: {
        targetParamKeys: ['params'],
        someProperty: 'value3',
      },
    },
  },
}));

const mockUseSearchParams = vi.mocked(useSearchParams);

describe('useRedirectTarget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return redirect required when valid category and state are provided', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'category1',
        state: 'state1',
        params: { key1: 'value1', key2: 'value2' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(true);
    expect(result.current.redirectTargetParams).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
    expect(result.current.featureState).toEqual({
      targetParamKeys: ['params'],
      someProperty: 'value1',
    });
  });

  it('should handle multiple target param keys', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'category1',
        state: 'state2',
        customParams: { key1: 'value1' },
        additionalParams: { key2: 'value2' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(true);
    expect(result.current.redirectTargetParams).toEqual({
      key1: 'value1',
      key2: 'value2',
    });
  });

  it('should return no redirect when category is missing', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        state: 'state1',
        params: { key1: 'value1' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(false);
    expect(result.current.redirectTargetParams).toEqual({});
    expect(result.current.featureState).toBeUndefined();
  });

  it('should return no redirect when state is missing', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'category1',
        params: { key1: 'value1' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(false);
    expect(result.current.redirectTargetParams).toEqual({});
    expect(result.current.featureState).toBeUndefined();
  });

  it('should return no redirect when feature state does not exist', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'nonexistent',
        state: 'state1',
        params: { key1: 'value1' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(false);
    expect(result.current.redirectTargetParams).toEqual({});
    expect(result.current.featureState).toBeUndefined();
  });

  it('should handle case insensitive category and state', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'Category1',
        state: 'State1',
        params: { key1: 'value1' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(true);
    expect(result.current.featureState).toEqual({
      targetParamKeys: ['params'],
      someProperty: 'value1',
    });
  });

  it('should handle empty target parameter', () => {
    const mockSearchParams = new URLSearchParams();

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(false);
    expect(result.current.redirectTargetParams).toEqual({});
    expect(result.current.featureState).toBeUndefined();
  });

  it('should handle invalid JSON in target parameter', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set('target', 'invalid-json');

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.isRedirectRequired).toBe(false);
    expect(result.current.redirectTargetParams).toEqual({});
    expect(result.current.featureState).toBeUndefined();
  });

  it('should ignore non-object target param values', () => {
    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'category1',
        state: 'state1',
        params: { key1: 'value1' },
        stringParam: 'should be ignored',
        nullParam: null,
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.redirectTargetParams).toEqual({
      key1: 'value1',
    });
  });

  it('should use default targetParamKeys when not specified in feature state', () => {
    // Mock a feature state without targetParamKeys
    vi.doMock('@/constants', () => ({
      PCI_FEATURES_STATES: {
        CATEGORY1: {
          STATE1: {
            someProperty: 'value1',
          },
        },
      },
    }));

    const mockSearchParams = new URLSearchParams();
    mockSearchParams.set(
      'target',
      JSON.stringify({
        category: 'category1',
        state: 'state1',
        params: { key1: 'value1' },
      }),
    );

    mockUseSearchParams.mockReturnValue([mockSearchParams, vi.fn()]);

    const { result } = renderHook(() => useRedirectTarget());

    expect(result.current.redirectTargetParams).toEqual({
      key1: 'value1',
    });
  });
});
