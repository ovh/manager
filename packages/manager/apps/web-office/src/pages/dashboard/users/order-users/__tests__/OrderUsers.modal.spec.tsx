/* eslint-disable @typescript-eslint/await-thenable */
import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { postOrderUsers } from '@/data/api/users/api';
import { act, fireEvent, render } from '@/utils/Test.provider';
import { OdsHTMLElement } from '@/utils/Test.utils';

import ModalOrderUsers from '../OrderUsers.modal';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalOrderUsers Component', () => {
  it('should render the submit button', () => {
    const { getByTestId } = render(<ModalOrderUsers />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveAttribute('label', actions.validate);
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
    const firstNameInput = getByTestId('input-firstName') as OdsHTMLElement;
    const lastNameInput = getByTestId('input-lastName') as OdsHTMLElement;
    const loginInput = getByTestId('input-login') as OdsHTMLElement;
    const domainInput = getByTestId('input-domain') as OdsHTMLElement;
    const licenceInput = getByTestId('input-licence') as OdsHTMLElement;
    const saveButton = getByTestId('primary-button') as OdsHTMLElement;

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(loginInput).toBeInTheDocument();
    expect(domainInput).toBeInTheDocument();
    expect(licenceInput).toBeInTheDocument();

    await act(() => {
      fireEvent.input(firstNameInput, {
        target: { value: 'John' },
      });
      firstNameInput.onChange.emit({
        name: 'firstName',
        value: 'John',
      });
    });

    await act(() => {
      fireEvent.input(lastNameInput, { target: { value: 'Doe' } });
      lastNameInput.onChange.emit({ name: 'lastName', value: 'Doe' });
    });

    await act(() => {
      fireEvent.input(loginInput, { target: { value: 'johndoe' } });
      loginInput.onChange.emit({ name: 'login', value: 'johndoe' });
    });

    await act(() => {
      fireEvent.change(licenceInput, {
        target: { value: 'officeBusiness' },
      });
      licenceInput.onChange.emit({
        name: 'licence',
        value: 'officeBusiness',
      });
    });

    expect(saveButton).toHaveAttribute('is-disabled', 'false');

    await act(() => fireEvent.click(saveButton));

    expect(postOrderUsers).toHaveBeenCalledOnce();
  });
});

describe('ModalOrderUsers W3C Validation', () => {
  // issue with ods on ods-select and option child element
  it.skip('should have a valid html', async () => {
    const { container } = render(<ModalOrderUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
