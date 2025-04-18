import React from 'react';
import { describe, expect } from 'vitest';
import { OngoingTasks } from './OngoingTasks.component';
import { render } from '@/utils/test.provider';

describe('OngoingTasks component', () => {
  it('should display component correctly', async () => {
    const { getByTestId } = render(<OngoingTasks />);

    const wrap = getByTestId('ongoingtasks');

    expect(wrap).toBeVisible();
  });
});
