import React from 'react';

import { describe, expect } from 'vitest';

import { render } from '@/utils/test.provider';

import ActionButtonAlias from './ActionButton.component';

describe('Alias datagrid action button', () => {
  it('should render correctly with enabled button', () => {
    const { getByTestId } = render(
      <ActionButtonAlias item={{ id: '1', alias: 'alias1@test.fr', status: 'READY' }} />,
    );

    const btn = getByTestId('delete-alias');

    expect(btn).toHaveAttribute('is-disabled', 'false');
  });

  it('should render correctly with disabled button', () => {
    const { getByTestId } = render(
      <ActionButtonAlias item={{ id: '2', alias: 'alias2@test.fr', status: 'CREATING' }} />,
    );

    const btn = getByTestId('delete-alias');

    expect(btn).toHaveAttribute('is-disabled', 'true');
  });
});
