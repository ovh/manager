import { describe, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import useDatagridColumn from './useDatagridColumn';
import { tasksMocks } from '@/data/__mocks__';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
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

    const taskCell = columns[0].cell(tasksMocks[0]);
    const startDateCell = columns[2].cell(tasksMocks[0]);
    const finishDateCell = columns[3].cell(tasksMocks[0]);

    expect(taskCell.props.children).toBe(
      `hosting_tab_TASKS_function_${tasksMocks[0].function?.replace('/', '_')}`,
    );
    expect(startDateCell.props.children).toBe(
      formatDate({ date: tasksMocks[0].startDate, format: 'Pp' }),
    );
    expect(finishDateCell?.props?.children).toBe(
      formatDate({ date: tasksMocks[0].doneDate, format: 'Pp' }),
    );
  });
});
