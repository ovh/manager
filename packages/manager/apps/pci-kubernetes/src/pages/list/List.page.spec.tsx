import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import ListPage from '@/pages/list/List.page';
import * as useKubernetesModule from '@/api/hooks/useKubernetes';
import { wrapper } from '@/wrapperRenders';
import { TKube } from '@/types';

type TKubesPaginated = {
  data: { rows: TKube[]; pageCount: number; totalRows: number };
  isLoading: boolean;
  isPending: boolean;
  error: Error;
};

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
    Notifications: vi.fn().mockReturnValue(<div></div>),
    useNotifications: vi.fn(() => ({
      clearNotifications: vi.fn(),
    })),
    useProjectUrl: vi.fn(),
  };
});

describe('ListPage', () => {
  it.skip('renders page correctly', () => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue(({
      isPending: false,
      data: {
        rows: [{ id: 1, name: 'Kube1' }],
        totalRows: 1,
      },
    } as unknown) as TKubesPaginated);
    const { getByText } = render(<ListPage />, { wrapper });
    expect(
      getByText('pci_project_guides_header_loadbalancer_kube'),
    ).toBeVisible();
  });

  it.skip('displays loading spinner when data is pending', () => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue(({
      isPending: true,
      data: [{ id: 1, name: 'Kube1' }],
    } as unknown) as TKubesPaginated);
    const { getByTestId } = render(<ListPage />, { wrapper });
    expect(getByTestId('List-spinner')).toBeVisible();
  });

  it('renders datagrid with items when data is available', () => {
    vi.spyOn(useKubernetesModule, 'useKubes').mockReturnValue(({
      isPending: false,
      data: {
        rows: [{ id: 1, name: 'Kube1' }],
        totalRows: 1,
      },
    } as unknown) as TKubesPaginated);
    const { getByText } = render(<ListPage />, { wrapper });
    expect(getByText('Kube1')).toBeInTheDocument();
  });
});
