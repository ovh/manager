import { within, waitFor, screen, fireEvent } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';
import '@testing-library/jest-dom';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';

const getOdsComponentByAttribute = <T, A = string>(
  componentTag: string,
  attribute: string,
) => async ({
  container,
  value,
  nth = 0,
}: {
  container: HTMLElement;
  value: A;
  nth?: number;
}): Promise<T> => {
  let component = null as T;
  await waitFor(() => {
    component = Array.from(
      container.querySelectorAll(`${componentTag}[${attribute}="${value}"]`),
    )[nth] as T;
    return expect(component).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return component;
};

export const assertDisabled = async (element: HTMLElement) =>
  waitFor(() => expect(element).toBeDisabled(), WAIT_FOR_DEFAULT_OPTIONS);

export const assertEnabled = async (element: HTMLElement) =>
  waitFor(() => expect(element).toBeEnabled(), WAIT_FOR_DEFAULT_OPTIONS);

export const getBadgeByLabel = getOdsComponentByAttribute<HTMLOdsBadgeElement>(
  'ods-badge',
  'label',
);

export const getLinkByLabel = getOdsComponentByAttribute<HTMLOdsLinkElement>(
  'ods-link',
  'label',
);

export const getButtonByLabel = getOdsComponentByAttribute<
  HTMLOdsButtonElement
>('ods-button', 'label');

export const getButtonByIcon = getOdsComponentByAttribute<
  HTMLOdsButtonElement,
  ODS_ICON_NAME
>('ods-button', 'icon');

export const changeInputValueByLabelText = async ({
  inputLabel,
  value,
  nth = 0,
}: {
  inputLabel: string;
  value: string;
  nth?: number;
}) => {
  const odsForm = screen
    .getAllByText(inputLabel)
    [nth]?.closest('ods-form-field') as HTMLOdsFormFieldElement;
  const odsInput = odsForm.querySelector('ods-input') as HTMLOdsInputElement;
  odsInput.setAttribute('value', value);
  const event = new CustomEvent('odsChange', {
    detail: { value },
  });
  await waitFor(() => fireEvent(odsInput, event));
  return waitFor(
    () => expect(odsInput).toHaveAttribute('value', value),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
};

export const changeSelectValueByLabelText = async ({
  selectLabel,
  value,
}: {
  selectLabel: string;
  value: string;
}) => {
  let odsSelect: HTMLOdsSelectElement;

  await waitFor(() => {
    const odsForm = screen.getByText(selectLabel)?.closest('ods-form-field');
    odsSelect = odsForm?.querySelector('ods-select');
    return expect(odsSelect).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

  odsSelect.setAttribute('value', value);
  const event = new CustomEvent('odsValueChange', {
    detail: { value },
  });

  await waitFor(() => fireEvent(odsSelect, event));
  return odsSelect;
};

export const changeOdsSelectValueByName = async ({
  container,
  name,
  value,
}: {
  container: HTMLElement;
  name: string;
  value: string;
}) => {
  const odsSelect = container.querySelector(
    `ods-select[name="${name}"]`,
  ) as HTMLOdsSelectElement;
  odsSelect.setAttribute('value', value);
  const event = new CustomEvent('odsValueChange', {
    detail: { value },
  });
  await waitFor(() => fireEvent(odsSelect, event));
  return odsSelect;
};

export const assertOsdFormInputInError = async ({
  inputLabel,
  inError = false,
}: {
  inputLabel: string;
  inError?: boolean;
}) =>
  waitFor(() => {
    const odsForm: HTMLElement = screen
      .getByText(inputLabel)
      ?.closest('ods-form-field');
    const odsInput: HTMLElement = odsForm.querySelector('ods-input');
    if (inError) {
      expect(
        ['', 'true'].includes(odsInput.getAttribute('has-error')),
      ).toBeTruthy();
    } else {
      expect(odsInput).toHaveAttribute('has-error', 'false');
    }
    return odsInput;
  }, WAIT_FOR_DEFAULT_OPTIONS);

export const clickOnRadioByName = async ({
  container,
  name,
  value,
}: {
  container: HTMLElement;
  name: string;
  value: string;
}) => {
  let odsRadio: HTMLElement;
  await waitFor(() => {
    const odsRadios: HTMLElement[] = Array.from(
      container.querySelectorAll('ods-radio'),
    );
    odsRadio = odsRadios.find(
      (item) =>
        item.getAttribute('name') === name &&
        item.getAttribute('value') === value,
    );
  });

  if (!odsRadio) return null;

  odsRadio.setAttribute('is-checked', '');
  const event = new CustomEvent('odsChange', { detail: { value } });
  await waitFor(() => fireEvent(odsRadio, event));

  return odsRadio;
};

export const assertModalVisibility = async ({
  container,
  isVisible,
}: {
  container: HTMLElement;
  isVisible: boolean;
}) =>
  waitFor(() => {
    const modal = container.querySelector('ods-modal');
    return isVisible
      ? expect(modal).toBeInTheDocument()
      : expect(modal).not.toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

export const assertModalText = ({
  container,
  text,
}: {
  container: HTMLElement;
  text: string;
}): Promise<void> =>
  waitFor(
    () =>
      expect(
        within(
          container.querySelector('ods-modal') as HTMLOdsModalElement,
        ).getByText(text, {
          exact: false,
        }),
      ).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
