import { render } from '@testing-library/react';
import { vi } from 'vitest';

import * as ManagerReactComponents from '@ovh-ux/manager-react-components';

import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import ListPage from '@/pages/list/List.page';
import { TClusterPlan, TClusterPlanEnum, TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

type TKubesPaginated = {
  data: { rows: TKube[]; pageCount: number; totalRows: number };
  isLoading: boolean;
  isPending: boolean;
  error: Error;
};

const clusterPlans: TClusterPlan[] = [TClusterPlanEnum.FREE, TClusterPlanEnum.STANDARD];

vi.spyOn(ManagerReactComponents, 'useNotifications').mockImplementation(() => ({
  clearNotifications: vi.fn(),
}));
vi.spyOn(ManagerReactComponents, 'ChangelogButton').mockImplementation(
  vi.fn().mockReturnValue(<div></div>),
);
vi.spyOn(ManagerReactComponents, 'Notifications').mockImplementation(
  vi.fn().mockReturnValue(<div></div>),
);

describe('ListPage', () => {
  it.skip('renders page correctly', () => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue({
      isPending: false,
      data: {
        rows: [{ id: 1, name: 'Kube1' }],
        totalRows: 1,
      },
    } as unknown as TKubesPaginated);
    const { getByText } = render(<ListPage />, { wrapper });
    expect(getByText('pci_project_guides_header_loadbalancer_kube')).toBeVisible();
  });

  it.skip('displays loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue({
      isPending: true,
      data: {
        rows: [{ id: 1, name: 'Kube1' }],
        totalRows: 1,
      },
    } as unknown as TKubesPaginated);
    const { getByTestId } = render(<ListPage />, { wrapper });
    expect(getByTestId('List-spinner')).toBeVisible();
  });

  it('renders datagrid with items when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue({
      isPending: false,
      isLoading: false,
      error: null,
      data: {
        rows: [{ id: 1, name: 'Kube1' }],
        totalRows: 1,
      },
    } as unknown as TKubesPaginated);
    const { getByText } = render(<ListPage />, { wrapper });
    expect(getByText('Kube1')).toBeInTheDocument();
  });

  it.each(clusterPlans)('renders %s cluster plan', (plan) => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue({
      isPending: false,
      data: {
        rows: [{ id: '1', plan } as TKube],
        totalRows: 1,
      },
    } as TKubesPaginated);

    const { getByText } = render(<ListPage />, { wrapper });
    expect(getByText(`kube:kube_service_cluster_plan_${plan}`)).toBeInTheDocument();
  });
});
