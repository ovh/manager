import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import ActionsComponent from '@/pages/detail/listeners/list/Actions.component';
import { TLoadBalancerListener } from '@/api/data/load-balancer';

describe('ActionsComponent', () => {
  const listener = {
    id: 'listener-id',
    protocol: 'http',
  } as TLoadBalancerListener;

  it('should render the action menu with correct items', () => {
    render(<ActionsComponent listener={listener} />);

    expect(
      screen.getByText('octavia_load_balancer_listeners_actions_detail'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('octavia_load_balancer_listeners_actions_policies'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('octavia_load_balancer_listeners_actions_delete'),
    ).toBeInTheDocument();
  });

  it('should disable policies management if protocol is not http', () => {
    const listenerWithDifferentProtocol = {
      ...listener,
      protocol: 'tcp',
    } as TLoadBalancerListener;
    render(<ActionsComponent listener={listenerWithDifferentProtocol} />);

    const policiesItem = screen.getByText(
      'octavia_load_balancer_listeners_actions_policies',
    );
    expect(policiesItem.closest('osds-button')).toHaveAttribute(
      'disabled',
      'true',
    );
  });

  it('should enable policies management if protocol is http', () => {
    render(<ActionsComponent listener={listener} />);
    const policiesItem = screen.getByText(
      'octavia_load_balancer_listeners_actions_policies',
    );
    expect(policiesItem.closest('osds-button')).not.toHaveAttribute('disabled');
  });
});
