import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonAlias from '../ActionButtonAlias.component';
import { render } from '@/utils/test.provider';
import { aliasesMock } from '@/api/_mock_';
import { ResourceStatus } from '@/api/api.type';

describe('Alias datagrid action button', () => {
  it('should render correctly with enabled button', () => {
    const { getByTestId } = render(
      <ActionButtonAlias
        aliasItem={{ ...aliasesMock[0], status: ResourceStatus.READY }}
      />,
    );

    const btn = getByTestId('delete-alias');

    expect(btn).toHaveAttribute('is-disabled', 'false');
  });

  it('should render correctly with disabled button', () => {
    const { getByTestId } = render(
      <ActionButtonAlias
        aliasItem={{ ...aliasesMock[0], status: ResourceStatus.CREATING }}
      />,
    );

    const btn = getByTestId('delete-alias');

    expect(btn).toHaveAttribute('is-disabled', 'true');
  });
});
