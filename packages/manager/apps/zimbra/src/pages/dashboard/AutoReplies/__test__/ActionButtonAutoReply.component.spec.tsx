import React from 'react';
import { describe, expect } from 'vitest';
import ActionButtonAutoReply from '../ActionButtonAutoReply.component';
import { render } from '@/utils/test.provider';
import { ResourceStatus } from '@/api/api.type';

describe('AutoReplies datagrid action menu', () => {
  it('renders with 1 button', () => {
    const { getByTestId } = render(
      <ActionButtonAutoReply
        autoReplyItem={{
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
