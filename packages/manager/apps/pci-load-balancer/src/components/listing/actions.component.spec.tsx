import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ActionsComponent from './Actions.component';
import { TLoadBalancer } from '@/api/data/load-balancer';

describe('ActionsComponent', () => {
  const loadBalancer = {
    id: 'lb1',
    region: 'region1',
  } as TLoadBalancer;

  it('renders action menu with correct items', () => {
    const { getByText } = render(
      <ActionsComponent loadBalancer={loadBalancer} />,
    );
    const deleteLink = getByText('octavia_load_balancer_actions_delete');
    const detailLink = getByText('octavia_load_balancer_actions_detail');

    expect(detailLink).toBeInTheDocument();

    expect(deleteLink).toBeInTheDocument();
  });
});
