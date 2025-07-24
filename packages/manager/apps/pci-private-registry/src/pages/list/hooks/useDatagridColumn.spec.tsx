import { render, renderHook } from '@testing-library/react';
import { Datagrid } from '@ovh-ux/manager-react-components';
import { vi } from 'vitest';
import { useDatagridColumn } from './useDatagridColumn';
import { wrapper } from '@/wrapperRenders';
import { TRegistry } from '@/api/data/registry';
import { useIAMFeatureAvailability } from '@/hooks/features/useIAMFeatureAvailability';
import { use3AZFeatureAvailability } from '@/hooks/features/use3AZFeatureAvailability';

vi.mock('@/hooks/features/useIAMFeatureAvailability', () => ({
  useIAMFeatureAvailability: vi.fn(),
}));

vi.mock('@/hooks/features/use3AZFeatureAvailability', () => ({
  use3AZFeatureAvailability: vi.fn(),
}));

const mockedUse3AZFeatureAvailability = vi.mocked(use3AZFeatureAvailability);
const mockedUseIAMFeatureAvailability = vi.mocked(useIAMFeatureAvailability);

describe('useDatagridColumn', () => {
  beforeEach(() => {
    mockedUse3AZFeatureAvailability.mockReturnValue({
      is3AZEnabled: false,
      isPending: false,
    });
  });
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
    mockedUse3AZFeatureAvailability.mockReturnValue({
      is3AZEnabled: true,
      isPending: false,
    });
    mockedUseIAMFeatureAvailability.mockReturnValue({
      isIAMEnabled: true,
      isPending: false,
    });
    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    expect(columns).toHaveLength(10);

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

  it('should not display IAM column if IAM feature is disabled', () => {
    mockedUseIAMFeatureAvailability.mockReturnValue({
      isIAMEnabled: false,
      isPending: false,
    });

    const { result } = renderHook(() => useDatagridColumn());

    const columns = result.current;

    const iamColumn = columns.find((col) => col.id === 'iam');
    expect(iamColumn).toBeUndefined();
  });

  describe.each([
    {
      iamEnabled: true,
      expectedLabel: 'private_registry_common_status_ENABLED',
    },
    {
      iamEnabled: false,
      expectedLabel: 'private_registry_common_status_DISABLED',
    },
  ])('IAM status column rendering', ({ iamEnabled, expectedLabel }) => {
    it(`should render IAM status as ${expectedLabel}`, () => {
      mockedUse3AZFeatureAvailability.mockReturnValue({
        is3AZEnabled: false,
        isPending: false,
      });
      mockedUseIAMFeatureAvailability.mockReturnValue({
        isIAMEnabled: true,
        isPending: false,
      });

      const { result } = renderHook(() => useDatagridColumn());

      const registry: TRegistry = { ...mockedPartialRegistry, iamEnabled };
      const items = [registry];

      const { getByTestId } = render(
        <Datagrid columns={result.current} items={items} totalItems={1} />,
        { wrapper },
      );

      expect(
        getByTestId('registryIamAthenticationStatus_chip'),
      ).toHaveTextContent(expectedLabel);
    });
  });
  describe('3AZ Feature - mode column visibility', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockedUse3AZFeatureAvailability.mockReturnValue({
        is3AZEnabled: false,
        isPending: false,
      });
      mockedUseIAMFeatureAvailability.mockReturnValue({
        isIAMEnabled: false,
        isPending: false,
      });
    });

    describe.each([
      {
        is3AZEnabled: true,
        isPending: false,
        expected: true,
        title:
          'should display the "mode" column when 3AZ is enabled and not pending',
      },
      {
        is3AZEnabled: false,
        isPending: false,
        expected: false,
        title: 'should NOT display the "mode" column when 3AZ is disabled',
      },
      {
        is3AZEnabled: true,
        isPending: true,
        expected: false,
        title: 'should NOT display the "mode" column when 3AZ is pending',
      },
    ])('$title', ({ is3AZEnabled, isPending, expected, title }) => {
      it(title, () => {
        mockedUse3AZFeatureAvailability.mockReturnValue({
          is3AZEnabled,
          isPending,
        });

        const { result } = renderHook(() => useDatagridColumn());
        const columns = result.current;

        const modeColumn = columns.find((col) => col.id === 'mode');

        if (expected) {
          expect(modeColumn).toBeDefined();
          expect(modeColumn?.label).toBe(
            'private_registry_containers_deployment_mode_label',
          );
        } else {
          expect(modeColumn).toBeUndefined();
        }
      });
    });
  });
});
