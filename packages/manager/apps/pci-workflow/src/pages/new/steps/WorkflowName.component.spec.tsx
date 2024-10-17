import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { useCatalogPrice, useMe } from '@ovh-ux/manager-react-components';
import { WorkflowName } from './WorkflowName.component';
import { useInstanceSnapshotPricing } from '@/api/hooks/order';

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
      data: { price: 0 },
      isPending: true,
    } as ReturnType<typeof useInstanceSnapshotPricing>);
  });

  it('should display spinner while loading', () => {
    const { getByTestId } = render(
      <WorkflowName
        name="foo"
        region="EU"
        step={{ isOpen: true, isChecked: false, isLocked: false }}
        onNameChange={null}
        onSubmit={null}
        onCancel={null}
      />,
    );
    expect(getByTestId('loading-spinner')).toBeDefined();
  });
});
