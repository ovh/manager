import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render } from '@/utils/test.provider';
import ModalAddAndEditOrganization from '../ModalAddAndEditOrganization.page';
import organizationsAddAndEditTranslation from '@/public/translations/organizations/addAndEdit/Messages_fr_FR.json';
import { organizationDetailMock } from '@/api/_mock_';

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

  it('check validity form', () => {
    const { getByTestId } = render(<ModalAddAndEditOrganization />);

    const button = getByTestId('confirm-btn');
    const input1 = getByTestId('input-name');
    const input2 = getByTestId('input-label');

    expect(getByTestId('confirm-btn')).not.toBeEnabled();

    act(() => {
      fireEvent.change(input1, { target: { value: '' } });
      input1.odsValueChange.emit({ name: 'name', value: '' });
    });

    expect(input1).toHaveAttribute('color', 'error');
    expect(getByTestId('field-name')).toHaveAttribute(
      'error',
      organizationsAddAndEditTranslation.zimbra_organization_add_form_input_name_error,
    );

    act(() => {
      fireEvent.change(input1, { target: { value: 'Name' } });
      fireEvent.change(input2, { target: { value: 'Label' } });

      // it seems we have to manually trigger the ods event
      input1.odsValueChange.emit({ name: 'name', value: 'Name' });
      input2.odsValueChange.emit({ name: 'label', value: 'Label' });
    });

    expect(input1).toHaveAttribute('color', 'default');
    expect(input2).toHaveAttribute('color', 'default');
    expect(button).toBeEnabled();

    act(() => {
      fireEvent.change(input1, { target: { value: 'Name' } });
      fireEvent.change(input2, {
        target: { value: 'NoValidLabelWithMore12Digit' },
      });

      // it seems we have to manually trigger the ods event
      input1.odsValueChange.emit({ name: 'name', value: 'Name' });
      input2.odsValueChange.emit({
        name: 'label',
        value: 'NoValidLabelWithMore12Digit',
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
});
