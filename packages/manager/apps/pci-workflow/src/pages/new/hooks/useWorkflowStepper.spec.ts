import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';

import { TInstance, buildInstanceId } from '@/api/hooks/instance/selector/instances.selector';

import {
  DEFAULT_FORM_STATE,
  TWorkflowScheduling,
  WorkflowType,
  useWorkflowStepper,
} from './useWorkflowStepper';

const INSTANCE_MOCK = {
  BASE: { id: buildInstanceId('instanceId', 'regionId') } as TInstance,
};

describe('useWorkflowStepper hook', () => {
  it('initializes with default form state', () => {
    const { result } = renderHook(() => useWorkflowStepper());
    expect(result.current.form).toEqual(DEFAULT_FORM_STATE);
  });

  it('updates type and opens resource step on type submit', () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit(WorkflowType.INSTANCE_BACKUP);
    });
    expect(result.current.form.type).toBe(WorkflowType.INSTANCE_BACKUP);
    expect(result.current.resource.step.isOpen).toBe(true);
  });

  it('resets to default form state except type on type edit', async () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit(WorkflowType.INSTANCE_BACKUP);
      result.current.type.edit();
    });
    await waitFor(() => expect(result.current.form).toEqual(DEFAULT_FORM_STATE));
  });

  it('updates instance and opens scheduling step on resource submit', () => {
    const instance = INSTANCE_MOCK.BASE;
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit(WorkflowType.INSTANCE_BACKUP);
      result.current.resource.update(instance);
      result.current.resource.submit();
    });
    expect(result.current.form.instanceId).toBe(instance.id);
    expect(result.current.naming.step.isOpen).toBe(true);
  });

  it('resets to default form state except type and instance on resource edit', async () => {
    const instance = INSTANCE_MOCK.BASE;
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit(WorkflowType.INSTANCE_BACKUP);
      result.current.resource.update(instance);
      result.current.resource.submit();
      result.current.resource.edit();
    });
    await waitFor(() =>
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: WorkflowType.INSTANCE_BACKUP,
        instanceId: INSTANCE_MOCK.BASE.id,
      }),
    );
  });

  it('updates scheduling and opens naming step on scheduling submit', () => {
    const scheduling = { name: 'scheduling1' } as TWorkflowScheduling;
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit(WorkflowType.INSTANCE_BACKUP);
      result.current.resource.update(INSTANCE_MOCK.BASE);
      result.current.resource.submit();
      result.current.scheduling.submit(scheduling);
    });
    expect(result.current.form.scheduling).toBe(scheduling);
    expect(result.current.naming.step.isOpen).toBe(true);
  });

  it('resets to default form state except type and instance on naming edit', async () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.submit(WorkflowType.INSTANCE_BACKUP);
      result.current.resource.update(INSTANCE_MOCK.BASE);
      result.current.resource.submit();
      result.current.naming.submit();
      result.current.naming.edit();
    });
    await waitFor(() => {
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: WorkflowType.INSTANCE_BACKUP,
        instanceId: INSTANCE_MOCK.BASE.id,
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
