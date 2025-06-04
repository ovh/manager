import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import InstanceName from './InstanceName.component';

vi.mock('@/data/api/instance');

vi.mocked(useNotifications).mockReturnValue({
  addError: vi.fn(),
});

describe('Instance Name', () => {
  it('Should not be editable if instance is in Error state', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <InstanceName
          instanceId="fake-id"
          status="ERROR"
          name="fake-instance-name"
        />
      </QueryClientProvider>,
    );

    expect(screen.getByText('fake-instance-name')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-btn')).not.toBeInTheDocument();
  });
});
