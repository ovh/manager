import { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial, FieldValues, useFormContext } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSubnets } from '@/data/hooks/network/useSubnets';
import { SubnetSelection } from '@/pages/create/components/network/SubnetSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TSubnetData } from '@/pages/create/view-model/network.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/network/useSubnets');

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: 'test-project-id' }),
}));

vi.mock('@ovhcloud/ods-react', () => ({
  FormField: ({ children }: PropsWithChildren) => <div>{children}</div>,
  FormFieldLabel: ({ children }: PropsWithChildren) => <label>{children}</label>,
  Select: ({
    onValueChange,
    value,
    items,
  }: {
    onValueChange: ({ value }: { value: string[] }) => void;
    value: string[];
    items: TSubnetData[];
  }) => (
    <div
      data-testid="subnet-select"
      data-value={JSON.stringify(value)}
      data-items={JSON.stringify(items)}
      onClick={() => {
        const currentValue = value[0];
        const nextItem = items.find((item) => item.value !== currentValue);
        if (nextItem && onValueChange) onValueChange({ value: [nextItem.value] });
      }}
    />
  ),
  SelectControl: () => <div />,
  SelectContent: () => <div />,
  Spinner: ({ size }: { size: string }) => <div data-testid="spinner" data-size={size} />,
  SPINNER_SIZE: { sm: 'sm' },
  Text: ({ children, preset }: PropsWithChildren<{ preset?: string }>) => (
    <div data-testid={preset ? `text-${preset}` : 'text'}>{children}</div>
  ),
  Controller: ({ render, name }: FieldValues) => {
    const formContext = useFormContext<CreateShareFormValues>();

    const field = {
      value: formContext.watch(name) || null,
      onChange: (value: string) => {
        formContext.setValue(name, value);
      },
    };

    return render({ field });
  },
}));

const mockUseSubnets = vi.mocked(useSubnets);

describe('SubnetSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when no network is selected', () => {
    mockUseSubnets.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TSubnetData[], Error>);

    const { container } = renderWithMockedForm(<SubnetSelection />, {
      defaultValues: { shareData: { privateNetworkId: undefined } },
    });

    expect(container.firstChild).toBeNull();
  });

  it('should render subnet selection when network is selected', () => {
    mockUseSubnets.mockReturnValue({
      data: [{ label: 'Subnet 1', value: 'subnet1' }],
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TSubnetData[], Error>);

    renderWithMockedForm(<SubnetSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7', privateNetworkId: 'net1' } },
    });

    expect(screen.getByTestId('subnet-select')).toBeVisible();
    expect(screen.getByText('create:network.subnet.label')).toBeVisible();
  });

  it('should render empty message when no subnets are available', () => {
    mockUseSubnets.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TSubnetData[], Error>);

    renderWithMockedForm(<SubnetSelection />, {
      defaultValues: { shareData: { privateNetworkId: 'net1' } },
    });

    expect(screen.getByText('create:network.subnet.empty')).toBeVisible();
  });

  it('should handle subnet selection', async () => {
    const subnetOptions: TSubnetData[] = [
      { label: 'Subnet 1', value: 'subnet1' },
      { label: 'Subnet 2', value: 'subnet2' },
    ];

    mockUseSubnets.mockReturnValue({
      data: subnetOptions,
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TSubnetData[], Error>);

    let formValues: DeepPartial<CreateShareFormValues>;

    renderWithMockedForm(<SubnetSelection />, {
      defaultValues: {
        shareData: {
          microRegion: 'GRA7',
          privateNetworkId: 'net1',
          subnetId: 'subnet1',
        },
      },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    await act(async () => {
      await userEvent.click(screen.getByTestId('subnet-select'));
    });

    await waitFor(() => {
      expect(formValues?.shareData?.subnetId).toEqual('subnet2');
    });
  });

  it('should display spinner and auto-select first subnet when subnets become available', async () => {
    const subnetOptions: TSubnetData[] = [
      { label: 'Subnet 1', value: 'subnet1' },
      { label: 'Subnet 2', value: 'subnet2' },
    ];

    mockUseSubnets.mockReturnValue({
      data: [],
      isLoading: true,
    } as unknown as QueryObserverSuccessResult<TSubnetData[], Error>);

    let formValues: DeepPartial<CreateShareFormValues>;

    const { rerender } = renderWithMockedForm(<SubnetSelection />, {
      defaultValues: {
        shareData: {
          microRegion: 'GRA7',
          privateNetworkId: 'net1',
          subnetId: 'otherId',
        },
      },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    expect(screen.getByTestId('spinner')).toBeVisible();

    mockUseSubnets.mockReturnValue({
      data: subnetOptions,
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TSubnetData[], Error>);

    rerender(<SubnetSelection />);

    await waitFor(() => {
      expect(formValues?.shareData?.subnetId).toEqual('subnet1');
    });
  });
});
