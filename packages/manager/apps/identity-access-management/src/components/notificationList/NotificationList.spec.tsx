import React from 'react';
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import {
  NotificationList,
  NotificationListProps,
} from './NotificationList.component';

const renderComponent = ({ error, items }: NotificationListProps) => {
  return render(<NotificationList items={items} error={error} />);
};

describe('resourcesDatagrid Component', async () => {
  it('Should display notification with a list of items', async () => {
    const { getByText } = renderComponent({
      items: [
        {
          id: '1',
          label: 'test-1',
        },
        {
          id: '2',
          label: 'test-2',
        },
      ],
      error: 'error',
    });

    expect(getByText('test-1')).toBeInTheDocument();
    expect(getByText('test-2')).toBeInTheDocument();
  });
});
