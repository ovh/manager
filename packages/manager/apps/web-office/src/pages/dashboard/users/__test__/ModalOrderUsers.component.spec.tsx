import React from 'react';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ModalOrderUsers from '../ModalOrderUsers.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

import { fireEvent, render, act } from '@/utils/test.provider';
import { postOrderUsers } from '@/api/users';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalOrderUsers Component', () => {
  it('should render the submit button', () => {
    const { getByTestId } = render(<ModalOrderUsers />);

    expect(getByTestId('confirm-btn')).toBeInTheDocument();
    expect(getByTestId('confirm-btn')).toHaveAttribute(
      'label',
      commonTranslation.cta_confirm,
    );
  });
  it('should enable save button and make API call on valid input', async () => {
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
    });

    hoistedMock.useContext.mockReturnValue({
      environment: {
        user: {
          ovhSubsidiary: 'FR',
        },
      },
    });

    const { getByTestId } = render(<ModalOrderUsers />);
    const firstNameInput = getByTestId('input-firstName');
    const lastNameInput = getByTestId('input-lastName');
    const loginInput = getByTestId('input-login');
    const domainInput = getByTestId('input-domain');
    const licenceInput = getByTestId('input-licence');
    const saveButton = getByTestId('confirm-btn');

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(loginInput).toBeInTheDocument();
    expect(domainInput).toBeInTheDocument();
    expect(licenceInput).toBeInTheDocument();

    await act(() => {
      fireEvent.change(licenceInput, { target: { value: 'licenceInput' } });
    });
    await act(() => {
      fireEvent.input(firstNameInput, {
        target: { value: 'John' },
      });
      firstNameInput.odsChange.emit({
        name: 'firstName',
        value: 'test@ovhcloud.com',
      });
    });
    await act(() => {
      fireEvent.input(lastNameInput, { target: { value: 'Doe' } });
      lastNameInput.odsChange.emit({ name: 'lastName', value: 'Doe' });
    });
    await act(() => {
      fireEvent.input(loginInput, { target: { value: 'johndoe' } });
      loginInput.odsChange.emit({ name: 'login', value: 'johndoe' });
    });
    await act(() => {
      fireEvent.input(domainInput, {
        target: { value: 'test.office.ovh.com' },
      });
      domainInput.odsChange.emit({
        name: 'domain',
        value: 'test.office.ovh.com',
      });
    });
    await act(() => {
      fireEvent.input(licenceInput, { target: { value: 'officeBusiness' } });
      licenceInput.odsChange.emit({
        name: 'licence',
        value: 'officeBusiness',
      });
    });

    await act(() => {
      fireEvent.click(saveButton);
    });

    expect(postOrderUsers).toHaveBeenCalledOnce();
  });
});
