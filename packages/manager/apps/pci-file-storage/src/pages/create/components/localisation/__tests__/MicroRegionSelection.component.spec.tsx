import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial, FieldValues, useFormContext } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { MicroRegionSelection } from '@/pages/create/components/localisation/microRegion/MicroRegionSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TMicroRegionData } from '@/pages/create/view-model/shareCatalog.view-model';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('@/data/hooks/catalog/useShareCatalog');

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
    items: TMicroRegionData[];
  }) => (
    <div
      role="combobox"
      aria-label="micro-region-select"
      data-value={JSON.stringify(value)}
      data-items={JSON.stringify(items)}
      onClick={() => onValueChange && onValueChange({ value: ['GRA2'] })}
    />
  ),
  SelectControl: () => <div />,
  SelectContent: () => <div />,
  Text: ({ children, preset }: PropsWithChildren<{ preset: string }>) => (
    <div data-testid={`text-${preset}`}>{children}</div>
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

const mockUseShareCatalog = vi.mocked(useShareCatalog);

describe('MicroRegionSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render micro region selection', () => {
    const microRegionOptions: TMicroRegionData[] = [
      { label: 'GRA1', value: 'GRA1', disabled: false },
      { label: 'GRA2', value: 'GRA2', disabled: false },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: microRegionOptions,
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

    renderWithMockedForm(<MicroRegionSelection />, {
      defaultValues: { macroRegion: 'GRA' },
    });

    expect(screen.getByRole('combobox')).toBeVisible();
    expect(screen.getByText('create:localisation.microRegion.label')).toBeVisible();
    expect(screen.getByTestId('text-heading-4')).toBeVisible();
  });

  it('should handle micro region selection', async () => {
    const microRegionOptions: TMicroRegionData[] = [
      { label: 'GRA1', value: 'GRA1', disabled: false },
      { label: 'GRA2', value: 'GRA2', disabled: false },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: microRegionOptions,
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

    let formValues: DeepPartial<CreateShareFormValues>;

    renderWithMockedForm(<MicroRegionSelection />, {
      defaultValues: { macroRegion: 'GRA', shareData: { microRegion: 'GRA1' } },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox'));
    });

    await waitFor(() => {
      expect(formValues?.shareData?.microRegion).toEqual('GRA2');
    });
  });

  it.each([
    {
      description: 'when selected micro region is not available',
      selectedMicroRegion: 'INVALID',
      microRegionOptions: [
        { label: 'GRA1', value: 'GRA1', disabled: false },
        { label: 'GRA2', value: 'GRA2', disabled: false },
      ],
      expectedMicroRegion: 'GRA1',
    },
    {
      description: 'when no micro region is selected',
      selectedMicroRegion: '',
      microRegionOptions: [
        { label: 'GRA1', value: 'GRA1', disabled: false },
        { label: 'GRA2', value: 'GRA2', disabled: false },
      ],
      expectedMicroRegion: 'GRA1',
    },
    {
      description: 'when skipping disabled micro regions',
      selectedMicroRegion: 'INVALID',
      microRegionOptions: [
        { label: 'GRA1', value: 'GRA1', disabled: true },
        { label: 'GRA2', value: 'GRA2', disabled: false },
        { label: 'GRA3', value: 'GRA3', disabled: true },
      ],
      expectedMicroRegion: 'GRA2',
    },
  ])(
    'should auto-select first enabled micro region $description',
    async ({ selectedMicroRegion, microRegionOptions, expectedMicroRegion }) => {
      mockUseShareCatalog.mockReturnValue({
        data: microRegionOptions,
      } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

      renderWithMockedForm(<MicroRegionSelection />, {
        defaultValues: { macroRegion: 'GRA', shareData: { microRegion: selectedMicroRegion } },
      });

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveAttribute(
          'data-value',
          `["${expectedMicroRegion}"]`,
        );
      });
    },
  );

  it.each([
    {
      description: 'when there is only one micro region',
      selectedMicroRegion: 'INVALID',
      microRegionOptions: [{ label: 'GRA1', value: 'GRA1', disabled: false }],
    },
    {
      description: 'when selected micro region is still available',
      selectedMicroRegion: 'GRA1',
      microRegionOptions: [
        { label: 'GRA1', value: 'GRA1', disabled: false },
        { label: 'GRA2', value: 'GRA2', disabled: false },
      ],
    },
    {
      description: 'when microRegionOptions is undefined',
      selectedMicroRegion: 'INVALID',
      microRegionOptions: undefined,
    },
    {
      description: 'when microRegionOptions is empty',
      selectedMicroRegion: 'GRA1',
      microRegionOptions: [],
    },
  ])('should not auto-select $description', async ({ selectedMicroRegion, microRegionOptions }) => {
    mockUseShareCatalog.mockReturnValue({
      data: microRegionOptions,
    } as unknown as QueryObserverSuccessResult<TMicroRegionData[]>);

    renderWithMockedForm(<MicroRegionSelection />, {
      defaultValues: { macroRegion: 'GRA', shareData: { microRegion: selectedMicroRegion } },
    });

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-value',
        `["${selectedMicroRegion}"]`,
      );
    });
  });
});
