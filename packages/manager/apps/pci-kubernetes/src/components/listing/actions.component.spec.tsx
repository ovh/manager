import { render } from '@testing-library/react';
import ActionsComponent from './actions.component';

import { wrapper } from '@/wrapperRenders';

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
