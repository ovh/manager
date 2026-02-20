import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial, FieldValues, useFormContext } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNetworks } from '@/data/hooks/network/useNetworks';
import { PrivateNetworkSelection } from '@/pages/create/components/network/PrivateNetworkSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TPrivateNetworkData } from '@/pages/create/view-model/network.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/network/useNetworks');
vi.mock('@/hooks/usePciAppUrl', () => ({
  PciAppUrlSuffix: { PrivateNetworks: 'private-networks' },
  usePciAppUrl: () => '/pci/projects/test-project-id/private-networks',
}));

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
    items: TPrivateNetworkData[];
  }) => (
    <div
      role="combobox"
      aria-label="private-network-select"
      data-value={JSON.stringify(value)}
      data-items={JSON.stringify(items)}
      onClick={() => onValueChange && onValueChange({ value: ['net2'] })}
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
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
  }: PropsWithChildren<{ onClick?: () => void; 'aria-label'?: string }>) => (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
  Icon: ({ name }: { name: string }) => <span aria-hidden>{name}</span>,
  ICON_NAME: { refresh: 'refresh' },
}));

const mockUseNetworks = vi.mocked(useNetworks);

describe('PrivateNetworkSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render network selection with title and description', () => {
    const networkOptions: TPrivateNetworkData[] = [
      { label: 'Network 1', value: 'net1' },
      { label: 'Network 2', value: 'net2' },
    ];

    mockUseNetworks.mockReturnValue({
      data: networkOptions,
      isLoading: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7' } },
    });

    expect(screen.getByText('create:network.title')).toBeVisible();
    expect(screen.getByText('create:network.description')).toBeVisible();
  });

  it('should render empty message when no private networks are available', () => {
    mockUseNetworks.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7' } },
    });

    expect(screen.getByText('create:network.empty')).toBeVisible();
  });

  it('should display create private network button when user has no networks', () => {
    mockUseNetworks.mockReturnValue({
      data: [],
      isLoading: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7' } },
    });

    const button = screen.getByRole('button', {
      name: 'create:network.createPrivateNetwork',
    });
    expect(button).toBeVisible();
  });

  it('should display create private network button when user has networks', () => {
    const networkOptions: TPrivateNetworkData[] = [
      { label: 'Network 1', value: 'net1' },
      { label: 'Network 2', value: 'net2' },
    ];

    mockUseNetworks.mockReturnValue({
      data: networkOptions,
      isLoading: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7' } },
    });

    expect(
      screen.getByRole('button', { name: 'create:network.createPrivateNetwork' }),
    ).toBeVisible();
  });

  it('should handle network selection', async () => {
    const networkOptions: TPrivateNetworkData[] = [
      { label: 'Network 1', value: 'net1' },
      { label: 'Network 2', value: 'net2' },
    ];

    mockUseNetworks.mockReturnValue({
      data: networkOptions,
      isLoading: false,
      refetch: vi.fn(),
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    let formValues: DeepPartial<CreateShareFormValues>;

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7', privateNetworkId: 'net1' } },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    expect(screen.getByRole('combobox')).toBeVisible();
    expect(screen.getByText('create:network.label')).toBeVisible();

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox'));
    });

    await waitFor(() => {
      expect(formValues?.shareData?.privateNetworkId).toEqual('net2');
    });
  });

  it('should call refetch when reload button is clicked', async () => {
    const networkOptions: TPrivateNetworkData[] = [
      { label: 'Network 1', value: 'net1' },
      { label: 'Network 2', value: 'net2' },
    ];
    const refetch = vi.fn();

    mockUseNetworks.mockReturnValue({
      data: networkOptions,
      isLoading: false,
      refetch,
      isFetching: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7', privateNetworkId: 'net1' } },
    });

    const reloadButton = screen.getByRole('button', {
      name: 'create:network.reloadNetworks',
    });
    await userEvent.click(reloadButton);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('should display spionner and auto-select first network when networks become available', async () => {
    const networkOptions: TPrivateNetworkData[] = [
      { label: 'Network 1', value: 'net1' },
      { label: 'Network 2', value: 'net2' },
    ];

    let isLoading = true;
    let data: TPrivateNetworkData[] = [];

    mockUseNetworks.mockImplementation(
      () =>
        ({
          data,
          isLoading,
          refetch: vi.fn(),
          isFetching: isLoading,
        }) as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>,
    );

    let formValues: DeepPartial<CreateShareFormValues>;

    const { rerender } = renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7', privateNetworkId: 'otherId' } },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    expect(screen.getByTestId('spinner')).toBeVisible();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      isLoading = false;
      data = networkOptions;
    });

    rerender(<PrivateNetworkSelection />);

    await waitFor(() => {
      expect(formValues?.shareData?.privateNetworkId).toEqual('net1');
    });
  });
});
