import { useParams, useSearchParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { postUsersPassword } from '@/data/api/users/api';
import { renderWithRouter } from '@/utils/Test.provider';
import { OdsHTMLElement } from '@/utils/Test.utils';

import ModalChangePasswordUsers from '../ChangePasswordUsers.modal';

const hoistedMock = vi.hoisted(() => ({
  useContext: vi.fn(),
}));

describe('ModalChangePasswordUsers Component', () => {
  // You should update according to new DOM
  /*
  : <body>
@ovh-ux/manager-web-office-app:test:   <div />
@ovh-ux/manager-web-office-app:test:   <div
@ovh-ux/manager-web-office-app:test:     class="_modal-backdrop_11des_22"
@ovh-ux/manager-web-office-app:test:     data-part="backdrop"
@ovh-ux/manager-web-office-app:test:     data-scope="dialog"
@ovh-ux/manager-web-office-app:test:     data-state="open"
@ovh-ux/manager-web-office-app:test:     dir="ltr"
@ovh-ux/manager-web-office-app:test:     id="dialog::r0::backdrop"
@ovh-ux/manager-web-office-app:test:     style="z-index: calc(var(--ods-theme-overlay-z-index) - 2);"
@ovh-ux/manager-web-office-app:test:   />
@ovh-ux/manager-web-office-app:test:   <div
@ovh-ux/manager-web-office-app:test:     class="_modal-positioner_11des_28"
@ovh-ux/manager-web-office-app:test:     data-part="positioner"
@ovh-ux/manager-web-office-app:test:     data-scope="dialog"
@ovh-ux/manager-web-office-app:test:     dir="ltr"
@ovh-ux/manager-web-office-app:test:     id="dialog::r0::positioner"
@ovh-ux/manager-web-office-app:test:     style="z-index: calc(var(--ods-theme-overlay-z-index) - 1);"
@ovh-ux/manager-web-office-app:test:   >
@ovh-ux/manager-web-office-app:test:     <div
@ovh-ux/manager-web-office-app:test:       aria-describedby=""
@ovh-ux/manager-web-office-app:test:       aria-labelledby=""
@ovh-ux/manager-web-office-app:test:       aria-modal="true"
@ovh-ux/manager-web-office-app:test:       class="_modal-content_11des_33"
@ovh-ux/manager-web-office-app:test:       data-ods="modal-content"
@ovh-ux/manager-web-office-app:test:       data-part="content"
@ovh-ux/manager-web-office-app:test:       data-scope="dialog"
@ovh-ux/manager-web-office-app:test:       data-state="open"
@ovh-ux/manager-web-office-app:test:       dir="ltr"
@ovh-ux/manager-web-office-app:test:       id="dialog::r0::content"
@ovh-ux/manager-web-office-app:test:       role="dialog"
@ovh-ux/manager-web-office-app:test:       tabindex="-1"
@ovh-ux/manager-web-office-app:test:     >
@ovh-ux/manager-web-office-app:test:       <div
@ovh-ux/manager-web-office-app:test:         class="_modal-header_7pkdv_2 _modal-header--information_7pkdv_18"
@ovh-ux/manager-web-office-app:test:       >
@ovh-ux/manager-web-office-app:test:         <button
@ovh-ux/manager-web-office-app:test:           aria-label="Close"
@ovh-ux/manager-web-office-app:test:           class="_button_6crpx_2 _button--neutral_6crpx_259 _button--xs_6crpx_200 _button--ghost_6crpx_327 _modal-header__close_7pkdv_27"
@ovh-ux/manager-web-office-app:test:           data-ods="button"
@ovh-ux/manager-web-office-app:test:           data-part="close-trigger"
@ovh-ux/manager-web-office-app:test:           data-scope="dialog"
@ovh-ux/manager-web-office-app:test:           dir="ltr"
@ovh-ux/manager-web-office-app:test:           id="dialog::r0::close"
@ovh-ux/manager-web-office-app:test:           type="button"
@ovh-ux/manager-web-office-app:test:         >
@ovh-ux/manager-web-office-app:test:           <span
@ovh-ux/manager-web-office-app:test:             class="_icon_10c23_2 _icon--xmark_10c23_562"
@ovh-ux/manager-web-office-app:test:             data-ods="icon"
@ovh-ux/manager-web-office-app:test:             role="presentation"
@ovh-ux/manager-web-office-app:test:           />
@ovh-ux/manager-web-office-app:test:         </button>
@ovh-ux/manager-web-office-app:test:       </div>
@ovh-ux/manager-web-office-app:test:       <div
@ovh-ux/manager-web-office-app:test:         class="_modal-body_17jys_2 text-left"
@ovh-ux/manager-web-office-app:test:         data-ods="modal-body"
@ovh-ux/manager-web-office-app:test:       >
@ovh-ux/manager-web-office-app:test:         <div
@ovh-ux/manager-web-office-app:test:           class="flex items-center mb-4"
@ovh-ux/manager-web-office-app:test:         >
@ovh-ux/manager-web-office-app:test:           <h4
@ovh-ux/manager-web-office-app:test:             class="_text_b5nz7_6 _text--heading-4_b5nz7_38 block mr-3 flex-1"
@ovh-ux/manager-web-office-app:test:             data-ods="text"
@ovh-ux/manager-web-office-app:test:           >
@ovh-ux/manager-web-office-app:test:             Modifier le mot de passe
@ovh-ux/manager-web-office-app:test:           </h4>
@ovh-ux/manager-web-office-app:test:         </div>
@ovh-ux/manager-web-office-app:test:         <div
@ovh-ux/manager-web-office-app:test:           class="flex flex-col text-left"
@ovh-ux/manager-web-office-app:test:         >
@ovh-ux/manager-web-office-app:test:           <form
@ovh-ux/manager-web-office-app:test:             class="flex flex-col"
@ovh-ux/manager-web-office-app:test:           >
@ovh-ux/manager-web-office-app:test:             <p
@ovh-ux/manager-web-office-app:test:               class="_text_b5nz7_6 _text--paragraph_b5nz7_61 mb-4"
@ovh-ux/manager-web-office-app:test:               data-ods="text"
@ovh-ux/manager-web-office-app:test:             >
@ovh-ux/manager-web-office-app:test:               label_mandatory
@ovh-ux/manager-web-office-app:test:             </p>
@ovh-ux/manager-web-office-app:test:             <div
   */
  it.skip('should enable save button and make API call on valid input in manual mode', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
    });

    hoistedMock.useContext.mockReturnValue({
      environment: {
        user: {
          email: 'test@ovhcloud.com',
        },
      },
    });

    const { getByTestId } = renderWithRouter(<ModalChangePasswordUsers />);

    //screen.debug();

    const manualRadio = getByTestId('radio-manual') as OdsHTMLElement;

    const saveButton = getByTestId('primary-button') as OdsHTMLElement;
    await act(() => {
      fireEvent.click(manualRadio);
      manualRadio.onChange.emit({
        value: 'passwordManual',
      });
    });
    const inputPassword = getByTestId('input-password');
    expect(inputPassword).toBeVisible();

    await act(() => {
      fireEvent.change(inputPassword, { target: { value: 'newPas$word123' } });
    });
    expect(saveButton).toHaveAttribute('is-disabled', 'false');

    await act(() => fireEvent.click(saveButton));
    expect(postUsersPassword).toHaveBeenCalledOnce();
  });

  it.skip('should enable save button and make API call on valid input in automatic mode', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        activationEmail: 'activationEmail@activationEmail',
      }),
      vi.fn(),
    ]);
    vi.mocked(useParams).mockReturnValue({
      serviceName: 'test-service',
    });

    hoistedMock.useContext.mockReturnValue({
      environment: {
        user: {
          email: 'test@ovhcloud.com',
        },
      },
    });

    const { getByTestId, getByText } = renderWithRouter(<ModalChangePasswordUsers />);

    const automaticRadioSpan = getByText('dashboard_users_change_password_radio_1').parentElement;
    const emailInput = getByTestId('input-email') as OdsHTMLElement;
    const saveButton = getByTestId('primary-button') as OdsHTMLElement;

    await act(() => fireEvent.click(automaticRadioSpan));

    expect(emailInput).toBeVisible();

    await act(() => {
      fireEvent.input(emailInput, { target: { value: 'test@ovhcloud.com' } });
      emailInput.onChange.emit({ name: 'email', value: 'test@ovhcloud.com' });
    });

    expect(saveButton).toHaveAttribute('is-disabled', 'false');

    await act(() => fireEvent.click(saveButton));
    expect(postUsersPassword).toHaveBeenCalledOnce();
  });
});

describe('ModalChangePasswordUsers W3C Validation', () => {
  // issue with ods on label and input (for / id)
  it.skip('should have a valid html', async () => {
    const { container } = renderWithRouter(<ModalChangePasswordUsers />);
    const html = container.innerHTML;

    await expect(html).toBeValidHtml();
  });
});
