import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';

import { TClusterNodePool } from '@/api/data/node-pools';
import * as nodePoolsModule from '@/api/hooks/node-pools';
import * as queryClientModule from '@/queryClient';
import { wrapper } from '@/wrapperRenders';

import Page from './NodePools.page';

const nodePool: TClusterNodePool = {
  id: '1',
  name: 'NodePool1',
  antiAffinity: false,
  availableNodes: 1,
  desiredNodes: 1,
  autoscale: false,
  monthlyBilled: false,
  createdAt: '2021-10-10T10:10:10',
  status: 'READY',
  flavor: 'flavor',
  minNodes: 1,
  maxNodes: 1,
  formattedFlavor: 'formattedFlavor',
};

describe('NodePools', () => {
  it('should show spinner if nodepools are loading', async () => {
    vi.spyOn(nodePoolsModule, 'usePaginatedClusterNodePools').mockReturnValue({
      isPending: true,
      data: undefined,
      isLoading: false,
      error: undefined,
    });

    const { getByTestId } = render(<Page />, {
      wrapper,
    });

    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render datagrid when nodepools are loaded', async () => {
    vi.spyOn(nodePoolsModule, 'usePaginatedClusterNodePools').mockReturnValue({
      isPending: false,
      data: {
        rows: [nodePool],
        totalRows: 1,
        pageCount: 1,
      },
      isLoading: false,
      error: undefined,
    });

    const { getByText } = render(<Page />, {
      wrapper,
    });

    expect(getByText('NodePool1')).toBeInTheDocument();
  });

  it('should reload nodepools on refresh', () => {
    vi.mock('@/queryClient', () => ({
      default: {
        invalidateQueries: vi.fn(),
      },
    }));

    vi.spyOn(nodePoolsModule, 'usePaginatedClusterNodePools').mockReturnValue({
      isPending: false,
      data: {
        rows: [nodePool],
        totalRows: 1,
        pageCount: 1,
      },
      isLoading: false,
      error: undefined,
    });

    const { getByTestId } = render(<Page />, {
      wrapper,
    });

    const refreshButton = getByTestId('refresh-button');

    refreshButton.click();

    expect(queryClientModule.default.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['project', 'project-id', 'kubernetes', 'kube-id', 'nodePools'],
    });
  });
});
