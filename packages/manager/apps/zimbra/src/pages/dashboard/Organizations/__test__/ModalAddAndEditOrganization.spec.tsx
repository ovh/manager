import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, act, waitFor } from '@/utils/test.provider';
import ModalAddAndEditOrganization from '../ModalAddAndEditOrganization.page';
import organizationsAddAndEditTranslation from '@/public/translations/organizations/addAndEdit/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';
import {
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/api/organization';

describe('Organizations add and edit modal', () => {
  it('if i have not editOrganizationId params', () => {
    const { getByTestId } = render(<ModalAddAndEditOrganization />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      organizationsAddAndEditTranslation.zimbra_organization_add_modal_title,
    );
  });

  it('if i have editOrganizationId params', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        editOrganizationId: organizationDetailMock.id,
      }),
      vi.fn(),
    ]);

    const { getByTestId } = render(<ModalAddAndEditOrganization />);
    const modal = getByTestId('modal');
    expect(modal).toHaveProperty(
      'headline',
      organizationsAddAndEditTranslation.zimbra_organization_edit_modal_title,
    );
  });

  it('check validity form', async () => {
    const { getByTestId, queryByTestId } = render(
      <ModalAddAndEditOrganization />,
    );

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const input1 = getByTestId('input-name');
    const input2 = getByTestId('input-label');

    expect(getByTestId('confirm-btn')).not.toBeEnabled();

    await act(() => {
      fireEvent.change(input1, { target: { value: '' } });
    });

    expect(input1).toHaveAttribute('color', 'error');
    expect(getByTestId('field-name')).toHaveAttribute(
      'error',
      organizationsAddAndEditTranslation.zimbra_organization_add_form_input_name_error,
    );

    await act(() => {
      fireEvent.change(input1, { target: { value: 'Name' } });
      fireEvent.change(input2, { target: { value: 'Label' } });
    });

    expect(input1).toHaveAttribute('color', 'default');
    expect(input2).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    await act(() => {
      fireEvent.change(input1, { target: { value: 'Name' } });
      fireEvent.change(input2, {
        target: { value: 'NoValidLabelWithMore12Digit' },
      });
    });

    expect(input1).toHaveAttribute('color', 'default');
    expect(input2).toHaveAttribute('color', 'error');
    expect(getByTestId('field-label')).toHaveAttribute(
      'error',
      organizationsAddAndEditTranslation.zimbra_organization_add_form_input_label_error.replace(
        '{{ value }}',
        12,
      ),
    );

    expect(button).not.toBeEnabled();
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
    const input1 = getByTestId('input-name');
    const input2 = getByTestId('input-label');

    expect(button).not.toBeEnabled();

    await act(() => {
      fireEvent.change(input1, { target: { value: 'Name' } });
      fireEvent.change(input2, { target: { value: 'Label' } });
    });

    expect(input1).toHaveAttribute('color', 'default');
    expect(input2).toHaveAttribute('color', 'default');

    expect(button).toBeEnabled();

    await act(() => {
      fireEvent.click(button);
    });

    expect(postZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });

  it('should add a new organization', async () => {
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
    const input1 = getByTestId('input-name');
    const input2 = getByTestId('input-label');

    await act(() => {
      fireEvent.change(input1, { target: { value: 'Name' } });
      fireEvent.change(input2, { target: { value: 'Label' } });
    });

    expect(input1).toHaveAttribute('color', 'default');
    expect(input2).toHaveAttribute('color', 'default');

    expect(button).toBeEnabled();

    await act(() => {
      fireEvent.click(button);
    });

    expect(putZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});
