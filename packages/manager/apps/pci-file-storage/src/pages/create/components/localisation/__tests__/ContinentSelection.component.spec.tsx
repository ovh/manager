import React, { PropsWithChildren } from 'react';

import { QueryObserverSuccessResult } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial, FieldValues, useFormContext } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { ContinentSelection } from '@/pages/create/components/localisation/macroRegion/ContinentSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TContinentData } from '@/pages/create/view-model/shareCatalog.view-model';
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
  }: {
    onValueChange: ({ value }: { value: string[] }) => void;
    value: string[];
  }) => (
    <div
      role="combobox"
      aria-label="continent-select"
      data-value={JSON.stringify(value)}
      onClick={() => onValueChange && onValueChange({ value: ['Europe'] })}
    />
  ),
  SelectControl: () => <div />,
  SelectContent: () => <div />,
  Controller: ({ render, name }: FieldValues) => {
    const formContext = useFormContext();
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

describe('ContinentSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle continent selection', async () => {
    const continentOptions: TContinentData[] = [
      { labelKey: 'localisation.continents.options.all', value: 'all' },
      { labelKey: 'localisation.continents.options.Europe', value: 'Europe' },
      { labelKey: 'localisation.continents.options.US', value: 'US' },
    ];

    mockUseShareCatalog.mockReturnValue({
      data: continentOptions,
    } as unknown as QueryObserverSuccessResult<TContinentData>);

    let formValues: DeepPartial<CreateShareFormValues> | undefined;

    renderWithMockedForm(<ContinentSelection />, {
      defaultValues: { continent: 'all' },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    expect(screen.getByRole('combobox')).toBeVisible();
    expect(screen.getByText('create:localisation.continents.label')).toBeVisible();

    await act(async () => {
      await userEvent.click(screen.getByRole('combobox'));
    });

    await waitFor(() => {
      expect(formValues?.continent).toEqual('Europe');
    });
  });
});
