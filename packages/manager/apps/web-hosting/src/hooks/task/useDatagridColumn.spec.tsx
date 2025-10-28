import { ReactElement } from 'react';

import { renderHook } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { useFormatDate } from '@ovh-ux/manager-react-components';

import { tasksMocks } from '@/data/__mocks__';

import useDatagridColumn from './useDatagridColumn';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useFormatDate: () => () => '19/08/2025, 14:39',
  };
});

describe('useDatagridColumn', () => {
  it('should return correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(4);
    expect(columns[0].id).toBe('task');
    expect(columns[1].id).toBe('status');
    expect(columns[2].id).toBe('startDate');
    expect(columns[3].id).toBe('finishDate');
  });

  it('should render correct cells', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;
    const formatDate = useFormatDate();

    type ElementWithStringChildren = ReactElement<{ children: string }>;
    const taskCell = columns[0].cell(tasksMocks[0]) as ElementWithStringChildren;
    const startDateCell = columns[2].cell(tasksMocks[0]) as ElementWithStringChildren;
    const finishDateCell = columns[3].cell(tasksMocks[0]) as ElementWithStringChildren;

    expect(taskCell.props.children).toBe(tasksMocks[0].function);
    expect(startDateCell.props.children).toBe(
      formatDate({ date: tasksMocks[0].startDate, format: 'Pp' }),
    );
    expect(finishDateCell?.props?.children).toBe(
      formatDate({ date: tasksMocks[0].doneDate, format: 'Pp' }),
    );
  });
});
