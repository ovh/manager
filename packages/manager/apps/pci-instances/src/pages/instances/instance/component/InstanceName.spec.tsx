import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  instanceBuilder,
  instanceDtoBuilder,
} from '@/__mocks__/instance/builder';
import InstanceName from './InstanceName.component';
import { TInstance } from '@/types/instance/entity.type';

const fakeInstanceDtoWithError = instanceDtoBuilder([], 'ERROR');
const fakeInstance = instanceBuilder(fakeInstanceDtoWithError, new Map(), {
  label: 'ERROR',
  severity: 'error',
});

vi.mock('@/data/api/instance');

vi.mocked(useNotifications).mockReturnValue({
  addError: vi.fn(),
});

const renderInstanceName = ({ instance }: { instance: TInstance }) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <InstanceName instance={instance} />
    </QueryClientProvider>,
  );

describe('Instance Name', () => {
  it('Should not editable if instance is on Error', () => {
    renderInstanceName({ instance: fakeInstance });

    expect(screen.getByText('fake-instance-name')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-btn')).not.toBeInTheDocument();
  });
});
