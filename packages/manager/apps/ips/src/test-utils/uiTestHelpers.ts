import { waitFor, within } from '@testing-library/react';
import { ODS_ICON_NAME, OdsSelect } from '@ovhcloud/ods-components';
import '@testing-library/jest-dom';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';
export const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 30_000,
};

export const getOdsBadgeByLabel = async ({
  container,
  label,
  disabled,
  nth = 0,
}: {
  container: HTMLElement;
  label: string;
  disabled?: boolean;
  nth?: number;
}) => {
  let badge: HTMLElement;
  await waitFor(() => {
    const badgeList = container.querySelectorAll('ods-badge');
    badge = Array.from(badgeList).filter((bdg) =>
      [label].includes(bdg.getAttribute('label')),
    )[nth];
    return disabled
      ? expect(badge).toBeDisabled()
      : expect(badge).not.toBeDisabled();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return badge;
};

export const getLinkByHref = async ({
  container,
  href,
  label,
  disabled,
  nth = 0,
}: {
  container: HTMLElement;
  href: string;
  label?: string;
  disabled?: boolean;
  nth?: number;
}) => {
  let link: HTMLElement;
  await waitFor(() => {
    const linkList = container.querySelectorAll('ods-link');
    link = Array.from(linkList).filter((lnk) =>
      [href].includes(lnk.getAttribute('href')),
    )[nth];
    expect(link).toBeDefined();
    if (label) expect(link).toHaveAttribute('label', label);
    return disabled
      ? expect(link).toBeDisabled()
      : expect(link).not.toBeDisabled();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return link;
};

export const getButtonByIcon = async ({
  container,
  iconName,
  disabled,
  nth = 0,
}: {
  container: HTMLElement;
  iconName: ODS_ICON_NAME;
  disabled?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = container.querySelectorAll(`ods-button[icon="${iconName}"]`)?.[
      nth
    ] as HTMLElement;
    expect(button).toBeDefined();
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const getTooltipByText = async ({
  container,
  text,
  nth = 0,
}: {
  container: HTMLElement;
  text: string;
  nth?: number;
}) => {
  let tooltip: HTMLElement;
  await waitFor(() => {
    tooltip = container.querySelectorAll(`ods-tooltip`)?.[nth] as HTMLElement;
    expect(tooltip).toHaveTextContent(text);
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return tooltip;
};

export const getSelectByPlaceholder = async ({
  container,
  placeholder,
  nth = 0,
}: {
  container: HTMLElement;
  placeholder: string;
  nth?: number;
}) => {
  let select: OdsSelect;
  await waitFor(() => {
    const selectList = Array.from(
      container.querySelectorAll('ods-select'),
    ).filter((el) => el.getAttribute('placeholder') === placeholder);
    select = (selectList?.[nth] as unknown) as OdsSelect;
    expect(select).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return select;
};

export const getButtonByLabel = async ({
  container,
  label,
  disabled,
  nth = 0,
}: {
  container: HTMLElement;
  label: string;
  disabled?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = Array.from(
      container.querySelectorAll(`ods-button[label="${label}"]`),
    )?.[nth] as HTMLElement;
    expect(button).toBeDefined();
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const getOdsCardByContentText = async ({
  container,
  text,
  nth = 0,
}: {
  container: HTMLElement;
  text: string;
  nth?: number;
}) => {
  let card: HTMLElement;
  await waitFor(() => {
    card = Array.from(container.querySelectorAll('ods-card'))?.filter((c) =>
      within(c).queryByText(text),
    )?.[nth] as HTMLElement;
    expect(card).toBeDefined();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return card;
};
