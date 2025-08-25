import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { mockedInstance } from '@/__mocks__/instance/constants';
import { TaskStatus } from './TaskStatus.component';

describe('Considering the StatusCell component', () => {
  test('Should render component correctly', () => {
    render(
      <TaskStatus
        status={mockedInstance.status}
        taskState={mockedInstance.taskState}
        isLoading={false}
        isPolling={false}
      />,
    );
    const statusCellElement = screen.getByTestId('status-chip');
    expect(statusCellElement).toBeInTheDocument();
  });
});
