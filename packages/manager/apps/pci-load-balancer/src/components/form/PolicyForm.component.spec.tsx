import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PolicyForm from './PolicyForm.component';
import { TL7Policy } from '@/api/data/l7Policies';
import { TLoadBalancerPool } from '@/api/data/pool';
import { wrapper } from '@/wrapperRenders';
import { TLoadBalancerListener } from '@/api/data/load-balancer';

const mockPolicy = {
  listenerId: 'listener-1',
  position: 1,
  redirectHttpCode: undefined,
  redirectPoolId: undefined,
  redirectPrefix: undefined,
  redirectUrl: undefined,
  name: 'Test Policy',
  action: '',
} as TL7Policy;

const mockPools = [
  { id: 'pool-1', name: 'Pool 1', protocol: 'http' },
  { id: 'pool-2', name: 'Pool 2', protocol: 'https' },
] as TLoadBalancerPool[];

const mockListener = {
  id: 'listener-1',
  protocol: 'http',
} as TLoadBalancerListener;

describe('PolicyForm', () => {
  it('renders the form with initial values', () => {
    const { getByTestId } = render(
      <PolicyForm
        policy={mockPolicy}
        pools={mockPools}
        listener={mockListener}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
      { wrapper },
    );

    expect(getByTestId('policyForm-name_input')).toHaveValue('Test Policy');
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    const { getByTestId } = render(
      <PolicyForm
        policy={mockPolicy}
        pools={mockPools}
        listener={mockListener}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(getByTestId('policyForm-cancel_button'));

    expect(onCancel).toHaveBeenCalled();
  });
});
