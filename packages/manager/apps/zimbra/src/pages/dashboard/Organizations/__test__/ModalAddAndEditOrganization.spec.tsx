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

  // @TODO: find why this test is inconsistent
  // sometimes ODS component return attribute empty while it can
  // only be "true" or "false"
  it.skip('check validity form', async () => {
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

    await act(() => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(inputName, {
        target: { value: 'Name' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.change(inputLabel, {
        target: { value: 'Label' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'Label',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.change(inputName, {
        target: { value: '' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: '',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'true');

    await act(() => {
      fireEvent.change(inputLabel, {
        target: { value: 'NotAValidLabelWithMore12Chars' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'NotAValidLabelWithMore12Chars',
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

    await act(() => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(inputName, {
        target: { value: 'Name' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.change(inputLabel, {
        target: { value: 'Label' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'Label',
      });
    });

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

    await act(() => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});

      fireEvent.change(inputName, {
        target: { value: 'Name1' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name1',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.change(inputLabel, {
        target: { value: 'Label1' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'Label1',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(button);
    });

    expect(putZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});
