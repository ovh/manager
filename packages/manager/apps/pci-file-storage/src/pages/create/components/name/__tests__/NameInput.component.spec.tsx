import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeepPartial } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NameInput } from '@/pages/create/components/name/NameInput.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { renderWithMockedForm } from '@/test-helpers/renderWithMockedForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('NameInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render name input field', () => {
    renderWithMockedForm(<NameInput />);

    expect(screen.getByLabelText('create:name.label')).toBeVisible();
    expect(screen.getByText('create:name.info')).toBeVisible();
  });

  it('should display error message when name is required', async () => {
    renderWithMockedForm(<NameInput />, {
      defaultValues: { shareData: { name: 'initial-value' } },
    });

    const input = screen.getByLabelText('create:name.label');
    await userEvent.clear(input);

    await waitFor(() => {
      expect(screen.getByText('create:name.error.required')).toBeVisible();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should display error message when name exceeds max length', async () => {
    const longName = 'a'.repeat(256);
    renderWithMockedForm(<NameInput />, {
      defaultValues: { shareData: { name: 'initial-value' } },
    });

    const input = screen.getByLabelText('create:name.label');
    await userEvent.clear(input);
    await userEvent.type(input, longName);

    await waitFor(() => {
      expect(screen.getByText('create:name.error.max_length')).toBeVisible();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should display error message when name has invalid format', async () => {
    renderWithMockedForm(<NameInput />, {
      defaultValues: { shareData: { name: 'initial-value' } },
    });

    const input = screen.getByLabelText('create:name.label');
    await userEvent.clear(input);
    await userEvent.type(input, 'invalid name with spaces');

    await waitFor(() => {
      expect(screen.getByText('create:name.error.invalid_format')).toBeVisible();
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('should update form value when user types', async () => {
    let formValues: DeepPartial<CreateShareFormValues>;
    renderWithMockedForm(<NameInput />, {
      defaultValues: { shareData: { name: '' } },
      onFormChange: (values) => {
        formValues = values;
      },
    });

    const input = screen.getByLabelText('create:name.label');
    await userEvent.type(input, 'my-share-name');

    await waitFor(() => {
      expect(formValues?.shareData?.name).toBe('my-share-name');
      expect(screen.queryByText('create:name.error.invalid_format')).toBeNull();
      expect(input).not.toHaveAttribute('aria-invalid', 'true');
    });
  });
});
