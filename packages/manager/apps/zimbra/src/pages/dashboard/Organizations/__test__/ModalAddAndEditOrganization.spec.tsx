import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, act, waitFor } from '@/utils/test.provider';
import ModalAddAndEditOrganization from '../ModalAddAndEditOrganization.page';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';
import {
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/api/organization';

describe('Organizations add and edit modal', () => {
  it('if i have not editOrganizationId params', async () => {
    const { findByText } = render(<ModalAddAndEditOrganization />);
    expect(await findByText(commonTranslation.add_organization)).toBeVisible();
  });

  it('if i have editOrganizationId params', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        editOrganizationId: organizationDetailMock.id,
      }),
      vi.fn(),
    ]);

    const { findByText } = render(<ModalAddAndEditOrganization />);
    expect(await findByText(commonTranslation.edit_organization)).toBeVisible();
  });

  it('check validity form', async () => {
    const { getByTestId, queryByTestId } = render(
      <ModalAddAndEditOrganization />,
    );

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name');
    const inputLabel = getByTestId('input-label');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputName.odsChange.emit({ name: 'name', value: '' });
      inputLabel.odsChange.emit({ name: 'label', value: '' });
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');

    act(() => {
      inputName.odsChange.emit({ name: 'name', value: 'Name' });
      inputName.odsChange.emit({ name: 'label', value: 'Label' });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');
    expect(inputLabel).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      inputName.odsChange.emit({
        name: 'label',
        value: 'NoValidLabelWithMore12Digit',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'true');

    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('should add a new organization', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({}),
      vi.fn(),
    ]);
    const { getByTestId, queryByTestId } = render(
      <ModalAddAndEditOrganization />,
    );

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name');
    const inputLabel = getByTestId('input-label');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputName.odsChange.emit({ name: 'name', value: 'Name' });
      inputName.odsChange.emit({ name: 'label', value: 'Label' });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');
    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(button);
    });

    expect(postZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });

  it('should edit an organization', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        editOrganizationId: organizationDetailMock.id,
      }),
      vi.fn(),
    ]);
    const { getByTestId, queryByTestId } = render(
      <ModalAddAndEditOrganization />,
    );

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name');
    const inputLabel = getByTestId('input-label');

    act(() => {
      inputName.odsChange.emit({ name: 'name', value: 'Name' });
      inputName.odsChange.emit({ name: 'label', value: 'Label' });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');
    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(button);
    });

    expect(putZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});
