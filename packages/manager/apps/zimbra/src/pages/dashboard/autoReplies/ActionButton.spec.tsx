import React from 'react';

import { describe, expect } from 'vitest';

import { ResourceStatus } from '@/data/api';
import { render } from '@/utils/test.provider';

import ActionButtonAutoReply from './ActionButton.component';

describe('AutoReplies datagrid action menu', () => {
  it('renders with 1 button', () => {
    const { getByTestId } = render(
      <ActionButtonAutoReply
        item={{
          id: '1',
          name: 'to@example1.com',
          from: '11/02/2023',
          until: '11/02/2024',
          copyTo: 'copy@example1.com',
          status: ResourceStatus.READY,
        }}
      />,
    );

    const button = getByTestId('delete-auto-reply');
    expect(button).toBeVisible();
  });
});
