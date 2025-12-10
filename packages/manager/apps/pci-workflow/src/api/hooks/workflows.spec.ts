import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ColumnSort } from '@ovh-ux/manager-react-components';

import { deleteWorkflow } from '@/api/data/workflow';
import { wrapper } from '@/wrapperRenders';

import { TWorkflow, sortWorkflows, useDeleteWorkflow } from './workflows';

vi.mock('@/api/data/workflow');

afterEach(() => {
  vi.clearAllMocks();
});

describe('useDeleteWorkflow', () => {
  const onSuccessMock = vi.fn();
  const onErrorMock = vi.fn();

  it('calls onSuccess after successful deletion', async () => {
    vi.mocked(deleteWorkflow).mockResolvedValueOnce(undefined);
    const { result } = renderHook(
      () =>
        useDeleteWorkflow({
          projectId: 'project1',
          workflowId: 'workflow1',
          region: 'region1',
          onSuccess: onSuccessMock,
          onError: onErrorMock,
        }),
      { wrapper },
    );

    act(() => result.current.deleteWorkflow());

    await waitFor(() => expect(onSuccessMock).toHaveBeenCalled());
    expect(onErrorMock).not.toHaveBeenCalled();
  });

  it('calls onError after failed deletion', async () => {
    const error = new Error('Deletion failed');
    vi.mocked(deleteWorkflow).mockRejectedValueOnce(error);
    const { result } = renderHook(
      () =>
        useDeleteWorkflow({
          projectId: 'project1',
          workflowId: 'workflow1',
          region: 'region1',
          onSuccess: onSuccessMock,
          onError: onErrorMock,
        }),
      { wrapper },
    );

    act(() => result.current.deleteWorkflow());

    await waitFor(() => expect(onErrorMock).toHaveBeenCalled());
    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});

describe('sortWorkflows', () => {
  it.each([
    {
      workflows: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
      ] as TWorkflow[],
      sorting: undefined,
      expectedResults: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
      ] as TWorkflow[],
    },
    {
      workflows: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
      ] as TWorkflow[],
      sorting: { id: 'regions', desc: false } as ColumnSort,
      expectedResults: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '3', name: 'bb', region: 'GRA9' },
        { id: '2', name: 'aa', region: 'SBG5' },
      ] as TWorkflow[],
    },
    {
      workflows: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
      ] as TWorkflow[],
      sorting: { id: 'regions', desc: true } as ColumnSort,
      expectedResults: [
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
        { id: '1', name: 'zz', region: 'EU-WEST' },
      ] as TWorkflow[],
    },
    {
      workflows: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
      ] as TWorkflow[],
      sorting: { id: 'name', desc: false } as ColumnSort,
      expectedResults: [
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
        { id: '1', name: 'zz', region: 'EU-WEST' },
      ] as TWorkflow[],
    },
    {
      workflows: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '2', name: 'aa', region: 'SBG5' },
        { id: '3', name: 'bb', region: 'GRA9' },
      ] as TWorkflow[],
      sorting: { id: 'name', desc: true } as ColumnSort,
      expectedResults: [
        { id: '1', name: 'zz', region: 'EU-WEST' },
        { id: '3', name: 'bb', region: 'GRA9' },
        { id: '2', name: 'aa', region: 'SBG5' },
      ] as TWorkflow[],
    },
  ])('should sort workflows with $sorting', ({ workflows, sorting, expectedResults }) => {
    const result = sortWorkflows(workflows, sorting, []);

    expect(result).toEqual(expectedResults);
  });
});
