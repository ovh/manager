import React from 'react';
import { render } from '@testing-library/react';
import { LogTimestamp } from './LogTimestamp.component';

describe('LogTimestamp test suite', () => {
  it('should render date and time with correct colors', async () => {
    const { getByTestId } = render(
      <LogTimestamp timestamp="2024-12-17T15:07:54.925Z" />,
    );

    const date = getByTestId('logTail-date');
    const time = getByTestId('logTail-time');

    expect(date).toHaveClass('text-yellow-100');
    expect(time).toHaveClass('text-yellow-200');
  });
});
