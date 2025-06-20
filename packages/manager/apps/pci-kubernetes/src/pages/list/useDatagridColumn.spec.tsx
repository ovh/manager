import { render, renderHook } from '@testing-library/react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from './useDatagridColumn';
import { TClusterOffer, TKube } from '@/types';
import { wrapper } from '@/wrapperRenders';

const test = [
  ['name', 'kube_list_name'],
  ['id', 'kube_list_id'],
  ['offer', 'kube:kube_service_cluster_offer'],
  ['region', 'kube_list_region'],
  ['mode', 'kubernetes_containers_deployment_mode_label'],
  ['attachedTo', 'kube_list_network_attached'],
  ['version', 'kube_list_version'],
  ['status', 'kube:kube_service_cluster_status'],
  ['actions', ''],
];

const columnCount = test.length;

const clusterOffers: TClusterOffer[] = ['free', 'standard'];

describe('useDatagridColumn', () => {
  it.each(test)('should return the correct column for %s', (id, label) => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;

    const column = columns.find((col) => col.id === id);
    expect(column).toBeDefined();
    expect(column.label).toBe(label);
  });

  it(`should return ${columnCount} columns`, () => {
    const { result } = renderHook(() => useDatagridColumn());
    const columns = result.current;

    expect(columns).toHaveLength(columnCount);
  });

  it.each(clusterOffers)(`should display correct cluster offer`, (offer) => {
    const { result } = renderHook(() => useDatagridColumn());

    const fakeStandardOfferKubeData = [{ offer } as TKube];

    const { getByText } = render(
      <Datagrid
        columns={result.current}
        items={fakeStandardOfferKubeData}
        totalItems={fakeStandardOfferKubeData.length}
      />,
      { wrapper },
    );
    expect(
      getByText(`kube:kube_service_cluster_offer_${offer}`),
    ).toBeInTheDocument();
  });
});
