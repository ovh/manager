import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';
import {
  DEFAULT_FORM_STATE,
  TWorkflowScheduling,
  useWorkflowStepper,
} from './useWorkflowStepper';
import { TInstance } from '@/type';

describe('useWorkflowStepper hook', () => {
  it('initializes with default form state', () => {
    const { result } = renderHook(() => useWorkflowStepper());
    expect(result.current.form).toEqual(DEFAULT_FORM_STATE);
  });

  it('updates type and opens resource step on type submit', () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit('exampleType');
    });
    expect(result.current.form.type).toBe('exampleType');
    expect(result.current.resource.step.isOpen).toBe(true);
  });

  it('resets to default form state except type on type edit', async () => {
    const { result } = renderHook(() => useWorkflowStepper());
    await act(() => {
      result.current.type.submit('exampleType');
      result.current.type.edit();
    });
    waitFor(() =>
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: 'exampleType',
      }),
    );
  });

  it('updates instance and opens scheduling step on resource submit', () => {
    const instance = { id: 'instance1' } as TInstance;
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit('exampleType');
      result.current.resource.submit(instance);
    });
    expect(result.current.form.instance).toBe(instance);
    expect(result.current.scheduling.step.isOpen).toBe(true);
  });

  it('resets to default form state except type and instance on resource edit', async () => {
    const instance = { id: 'instance1' } as TInstance;
    const { result } = renderHook(() => useWorkflowStepper());
    await act(() => {
      result.current.type.submit('exampleType');
      result.current.resource.submit(instance);
      result.current.resource.edit();
    });
    waitFor(() =>
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: 'exampleType',
        instance,
      }),
    );
  });

  it('updates scheduling and opens naming step on scheduling submit', () => {
    const scheduling = { name: 'scheduling1' } as TWorkflowScheduling;
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit('exampleType');
      result.current.resource.submit({ id: 'instance1' } as TInstance);
      result.current.scheduling.submit(scheduling);
    });
    expect(result.current.form.scheduling).toBe(scheduling);
    expect(result.current.naming.step.isOpen).toBe(true);
  });

  it('resets to default form state except type, instance, and scheduling on scheduling edit', () => {
    const scheduling = { name: 'scheduling1' } as TWorkflowScheduling;
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit('exampleType');
      result.current.resource.submit({ id: 'instance1' } as TInstance);
      result.current.scheduling.submit(scheduling);
      result.current.scheduling.edit();
    });
    waitFor(() => {
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: 'exampleType',
        instance: { id: 'instance1' },
      });
    });
  });

  it('updates name on naming update', () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.naming.update('exampleName');
    });
    expect(result.current.form.name).toBe('exampleName');
  });

  it('locks naming step on naming submit', () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.naming.submit();
    });
    expect(result.current.naming.step.isLocked).toBe(true);
  });
});
