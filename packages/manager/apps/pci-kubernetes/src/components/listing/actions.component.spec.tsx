import { render } from '@testing-library/react';

import { wrapper } from '@/wrapperRenders';

import ActionsComponent from './actions.component';

describe('ActionsComponent', () => {
  const kubeId = 'test-kube-id';

  it('should render the ActionMenu with the correct item', () => {
    const { getByText } = render(<ActionsComponent kubeId={kubeId} />, {
      wrapper,
    });

    const menuItem = getByText('kube_list_cluster_manage');
    expect(menuItem).toBeInTheDocument();
  });
});
