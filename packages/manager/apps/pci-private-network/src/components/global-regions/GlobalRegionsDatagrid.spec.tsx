import { describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlobalRegionsDatagrid from '@/components/global-regions/GlobalRegionsDatagrid';
import { TAggregatedNetwork } from '@/api/data/network';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useOvhTracking: () => ({ trackClick: vi.fn() }),
  };
});

describe('GlobalRegionsDatagrid', () => {
  it('should render DataGridNoResults when no networks', () => {
    render(
      <GlobalRegionsDatagrid
        items={[]}
        projectUrl="mocked_projectUrl"
        totalItems={0}
        pageCount={0}
        pagination={{ pageIndex: 0, pageSize: 10 }}
      />,
    );
    expect(
      screen.getByText('common_pagination_no_results'),
    ).toBeInTheDocument();
  });

  it('should render OsdsPagination when networks exist', () => {
    const networks = ([
      { vlanId: 'mocked_vlanId1', name: 'mocked_name1', subnets: [] },
      { vlanId: 'mocked_vlanId2', name: 'mocked_name2', subnets: [] },
    ] as unknown) as TAggregatedNetwork[];

    render(
      <GlobalRegionsDatagrid
        items={networks}
        projectUrl="mocked_projectUrl"
        totalItems={2}
        pageCount={1}
        pagination={{ pageIndex: 0, pageSize: 10 }}
      />,
    );
    expect(screen.getByText('common_pagination_of')).toBeInTheDocument();
    expect(screen.getByText('common_pagination_results')).toBeInTheDocument();
  });

  it('should not render OsdsPagination when no networks', () => {
    render(
      <GlobalRegionsDatagrid
        items={[]}
        projectUrl="mocked_projectUrl"
        totalItems={0}
        pageCount={0}
        pagination={{ pageIndex: 0, pageSize: 10 }}
      />,
    );
    expect(screen.queryByText('common_pagination_of')).not.toBeInTheDocument();
    expect(
      screen.queryByText('common_pagination_results'),
    ).not.toBeInTheDocument();
  });
});
