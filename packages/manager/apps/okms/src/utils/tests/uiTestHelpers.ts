import { OdsIcon } from '@ovhcloud/ods-components/react';
import { screen, waitFor, waitForOptions } from '@testing-library/react';

const WAIT_FOR_DEFAULT_OPTIONS = { timeout: 3000 };

/* GET BY LABEL */

type GetOdsButtonParams = {
  container: HTMLElement;
  label?: string;
  altLabel?: string;
  iconName?: React.ComponentProps<typeof OdsIcon>['name'];
  disabled?: boolean;
  isLink?: boolean;
  nth?: number;
} & waitForOptions;

const getOdsButton = async ({
  container,
  label,
  altLabel,
  iconName,
  disabled,
  isLink,
  nth = 0,
  ...options
}: GetOdsButtonParams) => {
  let button: HTMLElement;
  await waitFor(
    () => {
      const htmlTag = isLink ? 'ods-link' : 'ods-button';
      const buttonList = container.querySelectorAll(htmlTag);

      if (iconName) {
        // filter by icon
        button = Array.from(buttonList).filter(
          (btn) => btn.getAttribute('icon') === iconName,
        )[nth];
      } else {
        // filter by label or altLabel
        button = Array.from(buttonList).filter((btn) =>
          [label, altLabel].includes(btn.getAttribute('label')),
        )[nth];
      }

      // If disabled is undefined, we do not do more checks
      if (disabled === undefined) {
        return true;
      }

      if (isLink) {
        return disabled
          ? expect(button).toHaveAttribute('is-disabled', 'true')
          : expect(button).not.toHaveAttribute('is-disabled', 'true');
      }
      return disabled
        ? expect(button).toHaveAttribute('disabled')
        : expect(button).not.toHaveAttribute('disabled');
    },
    { ...WAIT_FOR_DEFAULT_OPTIONS, ...options },
  );
  return button;
};

type GetOdsButtonByLabelParams = Omit<GetOdsButtonParams, 'iconName'> & {
  label: string;
};

export const getOdsButtonByLabel = async ({
  container,
  label,
  altLabel,
  disabled,
  isLink,
  nth = 0,
  ...options
}: GetOdsButtonByLabelParams) => {
  return getOdsButton({
    container,
    label,
    altLabel,
    disabled,
    isLink,
    nth,
    ...options,
  });
};

type GetOdsButtonByIconParams = Omit<GetOdsButtonParams, 'label' | 'altLabel'>;

export const getOdsButtonByIcon = async ({
  container,
  iconName,
  disabled,
  isLink,
  nth = 0,
  ...options
}: GetOdsButtonByIconParams) => {
  return getOdsButton({
    container,
    iconName,
    disabled,
    isLink,
    nth,
    ...options,
  });
};

/* GET BY TEST ID */

type GetOdsLinkByTestIdParams = {
  testId: string;
  disabled?: boolean;
};

export const getOdsLinkByTestId = async ({
  testId,
  disabled,
}: GetOdsLinkByTestIdParams) => {
  let link: HTMLElement;
  await waitFor(() => {
    link = screen.getByTestId(testId);
    expect(link).toBeInTheDocument();

    return disabled
      ? expect(link).toHaveAttribute('is-disabled', 'true')
      : expect(link).not.toHaveAttribute('is-disabled', 'true');
  });

  return link;
};
