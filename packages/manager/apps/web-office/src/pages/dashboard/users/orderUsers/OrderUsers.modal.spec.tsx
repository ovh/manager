import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ActionTranslation from '@ovh-ux/manager-common-translations/public/translations/actions/Messages_fr_FR.json';
import ModalOrderUsers from './OrderUsers.modal';

import { fireEvent, render, act } from '@/utils/test.provider';
import { postOrderUsers } from '@/data/api/users';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalOrderUsers Component', () => {
  it('should render the submit button', () => {
    const { getByTestId } = render(<ModalOrderUsers />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveAttribute('label', 'validate');
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
    const saveButton = getByTestId('primary-button');

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
