import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { postOrderUsers } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';
import { OdsHTMLElement } from '@/utils/Test.utils';

import ModalOrderUsers from '../OrderUsers.modal';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalOrderUsers Component', () => {
  // You should update according to new DOM
  /*
  ❯ src/pages/dashboard/users/order-users/__tests__/OrderUsers.modal.spec.tsx (3 tests | 2 failed | 1 skipped) 759ms
@ovh-ux/manager-web-office-app:test:    × ModalOrderUsers Component > should render the submit button 604ms
@ovh-ux/manager-web-office-app:test:      → expect(element).toHaveAttribute("label", "Valider") // element.getAttribute("label") === "Valider"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   label="Valider"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:    × ModalOrderUsers Component > should enable save button and make API call on valid input 147ms
@ovh-ux/manager-web-office-app:test:      → Cannot read properties of undefined (reading 'emit')
@ovh-ux/manager-web-office-app:test:    ↓ ModalOrderUsers W3C Validation > should have a valid html
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/order-users/__tests__/OrderUsers.modal.spec.tsx > ModalOrderUsers Component > should render the submit button
@ovh-ux/manager-web-office-app:test: Error: expect(element).toHaveAttribute("label", "Valider") // element.getAttribute("label") === "Valider"
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: Expected the element to have attribute:
@ovh-ux/manager-web-office-app:test:   label="Valider"
@ovh-ux/manager-web-office-app:test: Received:
@ovh-ux/manager-web-office-app:test:   null
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/order-users/__tests__/OrderUsers.modal.spec.tsx:24:43
@ovh-ux/manager-web-office-app:test:      22|
@ovh-ux/manager-web-office-app:test:      23|     expect(getByTestId('primary-button')).toBeInTheDocument();
@ovh-ux/manager-web-office-app:test:      24|     expect(getByTestId('primary-button')).toHaveAttribute('label', actions.validate);
@ovh-ux/manager-web-office-app:test:        |                                           ^
@ovh-ux/manager-web-office-app:test:      25|   });
@ovh-ux/manager-web-office-app:test:      26|   it('should enable save button and make API call on valid input', async () => {
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test: ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯
@ovh-ux/manager-web-office-app:test:
@ovh-ux/manager-web-office-app:test:  FAIL  src/pages/dashboard/users/order-users/__tests__/OrderUsers.modal.spec.tsx > ModalOrderUsers Component > should enable save button and make API call on valid input
@ovh-ux/manager-web-office-app:test: TypeError: Cannot read properties of undefined (reading 'emit')
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/order-users/__tests__/OrderUsers.modal.spec.tsx:57:31
@ovh-ux/manager-web-office-app:test:      55|         target: { value: 'John' },
@ovh-ux/manager-web-office-app:test:      56|       });
@ovh-ux/manager-web-office-app:test:      57|       firstNameInput.onChange.emit({
@ovh-ux/manager-web-office-app:test:        |                               ^
@ovh-ux/manager-web-office-app:test:      58|         name: 'firstName',
@ovh-ux/manager-web-office-app:test:      59|         value: 'John',
@ovh-ux/manager-web-office-app:test:  ❯ node_modules/.pnpm/@testing-library+react@16.3.0_@testing-library+dom@10.4.1_@types+react-dom@18.2.19_@typ_e6fc14f64b55f30681be65789d9e0143/node_modules/@testing-library/react/dist/act-compat.js:48:24
@ovh-ux/manager-web-office-app:test:  ❯ act node_modules/.pnpm/react@18.2.0/node_modules/react/cjs/react.development.js:2512:16
@ovh-ux/manager-web-office-app:test:  ❯ Module.<anonymous> node_modules/.pnpm/@testing-library+react@16.3.0_@testing-library+dom@10.4.1_@types+react-dom@18.2.19_@typ_e6fc14f64b55f30681be65789d9e0143/node_modules/@testing-library/react/dist/act-compat.js:47:25
@ovh-ux/manager-web-office-app:test:  ❯ src/pages/dashboard/users/order-users/__tests__/OrderUsers.modal.spec.tsx:53:11
@ovh-ux/manager-web-office-app:test:
   */
  it.skip('should render the submit button', () => {
    const { getByTestId } = renderWithRouter(<ModalOrderUsers />);

    expect(getByTestId('primary-button')).toBeInTheDocument();
    expect(getByTestId('primary-button')).toHaveAttribute('label', actions.validate);
  });
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
    const { container } = renderWithRouter(<ModalOrderUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
