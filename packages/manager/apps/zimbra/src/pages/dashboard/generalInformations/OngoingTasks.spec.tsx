import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import { OngoingTasks } from './OngoingTasks.component';

describe('OngoingTasks component', () => {
  it('should display component correctly', () => {
    const { getByTestId } = render(<OngoingTasks />);

    const wrap = getByTestId('ongoingtasks');

    expect(wrap).toBeVisible();
  });
});
