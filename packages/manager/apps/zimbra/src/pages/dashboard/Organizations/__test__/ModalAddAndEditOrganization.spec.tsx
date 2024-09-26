import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@/utils/test.provider';
import { platformMock } from '@/api/_mock_';
import ModalAddAndEditOrganization from '../ModalAddAndEditOrganization.page';
import organizationsAddAndEditTranslation from '@/public/translations/organizations/addAndEdit/Messages_fr_FR.json';

const { useSearchParamsMock } = vi.hoisted(() => ({
  useSearchParamsMock: vi.fn(() => [new URLSearchParams()]),
}));

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useGenerateUrl: vi.fn(),
    useOrganization: vi.fn(() => ({
      data: null,
      isLoading: false,
    })),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  MemoryRouter: vi.fn(() => <ModalAddAndEditOrganization />),
  useSearchParams: useSearchParamsMock,
}));

vi.mock('@ovh-ux/manager-react-components', () => {
  return {
    useNotifications: vi.fn(() => ({
      addError: () => vi.fn(),
      addSuccess: () => vi.fn(),
    })),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

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
    useSearchParamsMock.mockImplementation(
      vi.fn(() => [
        new URLSearchParams({
          editOrganizationId: '1903b491-4d10-4000-8b70-f474d1abe601',
        }),
      ]),
    );
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
      input1.odsInputBlur.emit({ name: 'name', value: '' });
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
      fireEvent.change(input2, { target: { value: 'Label' } });

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
