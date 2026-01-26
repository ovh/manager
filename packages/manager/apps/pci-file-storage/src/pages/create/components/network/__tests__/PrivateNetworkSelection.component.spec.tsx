import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial, FieldValues, useFormContext } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TPrivateNetworkData } from '@/adapters/network/left/network.data';
import { useNetworks } from '@/data/hooks/network/useNetworks';
import { PrivateNetworkSelection } from '@/pages/create/components/network/PrivateNetworkSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/network/useNetworks');

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
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7' } },
    });

    expect(screen.getByTestId('text-heading-4')).toHaveTextContent('create:network.title');
    expect(screen.getByTestId('text-paragraph')).toHaveTextContent('create:network.description');
  });

  it('should render empty message when no private networks are available', () => {
    mockUseNetworks.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as QueryObserverSuccessResult<TPrivateNetworkData[], Error>);

    renderWithMockedForm(<PrivateNetworkSelection />, {
      defaultValues: { shareData: { microRegion: 'GRA7' } },
    });

    expect(screen.getByText('create:network.empty')).toBeVisible();
  });

  it('should handle network selection', async () => {
    const networkOptions: TPrivateNetworkData[] = [
      { label: 'Network 1', value: 'net1' },
      { label: 'Network 2', value: 'net2' },
    ];

    mockUseNetworks.mockReturnValue({
      data: networkOptions,
      isLoading: false,
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
