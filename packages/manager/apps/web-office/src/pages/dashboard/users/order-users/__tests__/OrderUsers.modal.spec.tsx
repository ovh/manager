import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { postOrderUsers } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';

import ModalOrderUsers from '../OrderUsers.modal';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalOrderUsers Component', () => {
  it('should render the submit button', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderUsers />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveTextContent(actions.validate);
  });

  // issue for test new select / combobox ods field
  it.skip('should enable save button and make API call on valid input', async () => {
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

    const { getByTestId } = renderWithRouter(<ModalOrderUsers />);
    const firstNameInput = getByTestId('input-firstName');
    const lastNameInput = getByTestId('input-lastName');
    const loginInput = getByTestId('input-login');
    const domainInput = getByTestId('input-domain');
    const licenceSelect = getByTestId('select-licence');
    const saveButton = getByTestId('primary-button');

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(loginInput).toBeInTheDocument();
    expect(domainInput).toBeInTheDocument();
    expect(licenceSelect).toBeInTheDocument();

    await act(() => {
      fireEvent.input(firstNameInput, {
        target: { value: 'John' },
      });
    });

    await act(() => {
      fireEvent.input(lastNameInput, { target: { value: 'Doe' } });
    });

    await act(() => {
      fireEvent.input(loginInput, { target: { value: 'johndoe' } });
    });

    await act(() => {
      fireEvent.change(licenceSelect, { target: { value: 'officeBusiness' } });
    });

    expect(saveButton).not.toHaveAttribute('disabled');

    await act(() => fireEvent.click(saveButton));

    expect(postOrderUsers).toHaveBeenCalledOnce();
  });
});

describe('ModalOrderUsers W3C Validation', () => {
  it('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalOrderUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
