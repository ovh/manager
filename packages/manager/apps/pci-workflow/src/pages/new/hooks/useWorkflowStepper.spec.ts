import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, it } from 'vitest';

import { TWorkflowSelectedResource, WorkflowType } from '@/api/hooks/workflows';

import { DEFAULT_FORM_STATE, TWorkflowScheduling, useWorkflowStepper } from './useWorkflowStepper';

const selectedResource = {
  id: 'instanceId',
  region: 'regionId',
  label: 'label',
} as TWorkflowSelectedResource;

describe('useWorkflowStepper hook', () => {
  it('initializes with default form state', () => {
    const { result } = renderHook(() => useWorkflowStepper());

    expect(result.current.form).toEqual(DEFAULT_FORM_STATE);
  });

  it('updates type and opens resource step on type update', () => {
    const { result } = renderHook(() => useWorkflowStepper());

    act(() => {
      result.current.type.update(WorkflowType.INSTANCE_BACKUP);
      result.current.type.submit();
    });

    expect(result.current.form.type).toBe(WorkflowType.INSTANCE_BACKUP);
    expect(result.current.resource.step.isOpen).toBe(true);
  });

  it('resets to default form state except type on type edit', async () => {
    const { result } = renderHook(() => useWorkflowStepper());

    act(() => {
      result.current.type.update(WorkflowType.INSTANCE_BACKUP);
      result.current.type.submit();
      result.current.type.edit();
    });

    await waitFor(() => expect(result.current.form).toEqual(DEFAULT_FORM_STATE));
  });

  it('updates instance and opens scheduling step on resource submit', () => {
    const { result } = renderHook(() => useWorkflowStepper());

    act(() => {
      result.current.type.update(WorkflowType.INSTANCE_BACKUP);
      result.current.type.submit();
      result.current.resource.update(selectedResource);
      result.current.resource.submit();
    });

    expect(result.current.form.resource).toEqual(selectedResource);
    expect(result.current.naming.step.isOpen).toBe(true);
  });

  it('resets to default form state except type and instance on resource edit', async () => {
    const { result } = renderHook(() => useWorkflowStepper());

    act(() => {
      result.current.type.update(WorkflowType.INSTANCE_BACKUP);
      result.current.type.submit();
      result.current.resource.update(selectedResource);
      result.current.resource.submit();
      result.current.resource.edit();
    });

    await waitFor(() =>
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: WorkflowType.INSTANCE_BACKUP,
        resource: selectedResource,
      }),
    );
  });

  it('updates scheduling and opens naming step on scheduling submit', () => {
    const scheduling = { name: 'scheduling1' } as TWorkflowScheduling;
    const { result } = renderHook(() => useWorkflowStepper());

    act(() => {
      result.current.type.update(WorkflowType.INSTANCE_BACKUP);
      result.current.type.submit();
      result.current.resource.update(selectedResource);
      result.current.resource.submit();
      result.current.scheduling.submit(scheduling, null);
    });

    expect(result.current.form.scheduling).toBe(scheduling);
    expect(result.current.naming.step.isOpen).toBe(true);
  });

  it('resets to default form state except type and instance on naming edit', async () => {
    const { result } = renderHook(() => useWorkflowStepper());
    act(() => {
      result.current.type.update(WorkflowType.INSTANCE_BACKUP);
      result.current.type.submit();
      result.current.resource.update(selectedResource);
      result.current.resource.submit();
      result.current.naming.submit();
      result.current.naming.edit();
    });
    await waitFor(() => {
      expect(result.current.form).toEqual({
        ...DEFAULT_FORM_STATE,
        type: WorkflowType.INSTANCE_BACKUP,
        resource: selectedResource,
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
