import { render, renderHook } from '@testing-library/react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from './useDatagridColumn';
import { wrapper } from '@/wrapperRenders';
import { TRegistry } from '@/api/data/registry';

describe('useDatagridColumn', () => {
  const mockedPartialRegistry: Omit<TRegistry, 'iamEnabled'> = {
    id: 'registryId',
    createdAt: '2024-01-01',
    deliveredAt: '2024-01-02',
    name: 'Test Registry',
    notary_url: 'https://example.com/notary',
    region: 'GRA',
    size: 1024,
    status: 'READY',
    updatedAt: '2024-01-03',
    url: 'https://example.com/registry',
    version: '1.0',
    plan: {
      id: 'plan1',
      name: 'SMALL',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02',
      registryLimits: {
        imageStorage: 100,
        parallelRequest: 10,
      },
      features: {
        vulnerability: true,
      },
      code: 'PLAN_CODE',
    },
  };

  it('should return the correct columns', () => {
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(9);

    const nameColumn = columns.find((col) => col.id === 'name');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.label).toBe('private_registry_name');

    const idColumn = columns.find((col) => col.id === 'id');
    expect(idColumn).toBeDefined();
    expect(idColumn?.label).toBe('private_registry_id');

    const regionColumn = columns.find((col) => col.id === 'region');
    expect(regionColumn).toBeDefined();
    expect(regionColumn?.label).toBe('private_registry_region');

    const attachedToColumn = columns.find((col) => col.id === 'planSize');
    expect(attachedToColumn).toBeDefined();
    expect(attachedToColumn?.label).toBe('private_registry_plan');

    const versionColumn = columns.find((col) => col.id === 'version');
    expect(versionColumn).toBeDefined();
    expect(versionColumn?.label).toBe('private_registry_harbor_version');

    const iamColumn = columns.find((col) => col.id === 'iam');
    expect(iamColumn?.label).toBeDefined();

    const statusColumn = columns.find((col) => col.id === 'status');
    expect(statusColumn).toBeDefined();
    expect(statusColumn?.label).toBe('private_registry_status');

    const consumptionColumn = columns.find((col) => col.id === 'consumption');
    expect(consumptionColumn).toBeDefined();
    expect(consumptionColumn?.label).toBe('private_registry_consumption');

    const actionsColumn = columns.find((col) => col.id === 'actions');
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.label).toBe('');
  });

  it('should display enabled IAM authentication status if registry IAM is enabled', () => {
    const columns = useDatagridColumn();
    const mockedRegistries: TRegistry[] = [
      { ...mockedPartialRegistry, iamEnabled: true },
    ];

    const fakeData = {
      rows: mockedRegistries,
      pageCount: 1,
      totalRows: 1,
    };

    const { getByTestId } = render(
      <Datagrid
        columns={columns}
        items={fakeData.rows}
        totalItems={fakeData.totalRows}
      />,
      { wrapper },
    );

    expect(
      getByTestId('registryIamAthenticationStatus_chip'),
    ).toHaveTextContent('private_registry_common_status_ENABLED');
  });

  it('should display disabled IAM authentication status if registry IAM is disabled', () => {
    const columns = useDatagridColumn();
    const mockedRegistries: TRegistry[] = [
      { ...mockedPartialRegistry, iamEnabled: false },
    ];

    const fakeData = {
      rows: mockedRegistries,
      pageCount: 1,
      totalRows: 1,
    };

    const { getByTestId } = render(
      <Datagrid
        columns={columns}
        items={fakeData.rows}
        totalItems={fakeData.totalRows}
      />,
      { wrapper },
    );

    expect(
      getByTestId('registryIamAthenticationStatus_chip'),
    ).toHaveTextContent('private_registry_common_status_DISABLED');
  });
});
