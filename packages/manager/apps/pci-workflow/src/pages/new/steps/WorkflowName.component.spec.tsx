import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { useCatalogPrice, useMe } from '@ovh-ux/manager-react-components';

import { buildInstanceId } from '@/api/hooks/instance/selector/instances.selector';
import { useInstanceSnapshotPricing } from '@/api/hooks/order';

import { WorkflowName } from './WorkflowName.component';

vi.mock('@ovh-ux/manager-react-components');
vi.mock('@/api/hooks/order');

describe('WorkflowName', () => {
  beforeEach(() => {
    vi.mocked(useMe).mockReturnValueOnce({
      me: { ovhSubsidiary: 'foobar-ovh', currency: null },
    });
    vi.mocked(useCatalogPrice).mockReturnValueOnce({
      getTextPrice: () => '',
      getFormattedCatalogPrice: () => '',
      getFormattedHourlyCatalogPrice: () => '',
      getFormattedMonthlyCatalogPrice: () => '',
    });
    vi.mocked(useInstanceSnapshotPricing).mockReturnValueOnce({
      pricing: { price: 0 },
      isPending: true,
    } as ReturnType<typeof useInstanceSnapshotPricing>);
  });

  it('should display spinner while loading', () => {
    const { getByTestId } = render(
      <WorkflowName
        name="foo"
        instanceId={buildInstanceId('instance1', 'region1')}
        step={{ isOpen: true, isChecked: false, isLocked: false }}
        onNameChange={null}
        onSubmit={null}
      />,
    );
    expect(getByTestId('loading-spinner')).toBeDefined();
  });
});
