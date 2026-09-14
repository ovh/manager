import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { TLocalStorage } from '@/api/hook/useConsumption';
import LocalStorageList from './LocalStorageList.component';

const mockUseInstances = vi.hoisted(() => vi.fn());

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useInstances: mockUseInstances,
  };
});

describe('LocalStorageList', () => {
  const billingLocalStorages: TLocalStorage[] = [
    {
      instanceId: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
      resourceId: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
      reference: 'b3-16.local-disk-gb',
      region: 'EU-SOUTH-MIL',
      deploymentMode: 'REGION-3-AZ',
      quantity: { unit: 'GiBh', value: 720 },
      totalPrice: 3.2,
    },
    {
      instanceId: 'unknown-id',
      resourceId: 'unknown-id',
      reference: 'c3-8.local-disk-gb',
      region: 'GRA11',
      deploymentMode: 'REGION-3-AZ',
      quantity: { unit: 'GiBh', value: 360 },
      totalPrice: 6.4,
    },
  ];

  it('shows the billing reference as the row name', () => {
    mockUseInstances.mockReturnValue({ data: [], isPending: false });

    const { getByText } = render(
      <LocalStorageList localStorages={billingLocalStorages} />,
      { wrapper },
    );

    expect(getByText('b3-16.local-disk-gb')).toBeInTheDocument();
  });

  it('resolves the instance name from the billed resource', () => {
    mockUseInstances.mockReturnValue({
      data: [
        {
          id: 'f15aaf5b-e2c2-4d79-83fa-aa8ac3ac6b33',
          name: 'my-instance-01',
        },
      ],
      isPending: false,
    });

    const { getByText } = render(
      <LocalStorageList localStorages={billingLocalStorages} />,
      { wrapper },
    );

    expect(getByText('my-instance-01')).toBeInTheDocument();
  });

  it('falls back to the resource id when the instance is not found', () => {
    mockUseInstances.mockReturnValue({ data: [], isPending: false });

    const { getByText } = render(
      <LocalStorageList localStorages={billingLocalStorages} />,
      { wrapper },
    );

    expect(getByText('unknown-id')).toBeInTheDocument();
  });

  it('shows the consumption with its billing unit', () => {
    mockUseInstances.mockReturnValue({ data: [], isPending: false });

    const { getByText } = render(
      <LocalStorageList localStorages={billingLocalStorages} />,
      { wrapper },
    );

    expect(getByText('720 GiBh')).toBeInTheDocument();
  });

  it('shows the no-data message when there is no local storage consumption', () => {
    mockUseInstances.mockReturnValue({ data: [], isPending: false });

    const { getByText } = render(<LocalStorageList localStorages={[]} />, {
      wrapper,
    });

    expect(getByText('cpbc_no_consumption_data')).toBeInTheDocument();
  });

  it('shows a spinner while the instances list is loading', () => {
    mockUseInstances.mockReturnValue({ data: undefined, isPending: true });

    const { container } = render(
      <LocalStorageList localStorages={billingLocalStorages} />,
      { wrapper },
    );

    expect(container.querySelector('osds-spinner')).toBeInTheDocument();
  });
});
