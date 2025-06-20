import { fireEvent, waitFor, within } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import '@testing-library/jest-dom';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';
export const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 30_000,
};

export const getOdsBadgeByLabel = async ({
  container,
  label,
  nth = 0,
  isHidden,
}: {
  container: HTMLElement;
  label: string;
  nth?: number;
  isHidden?: boolean;
}) => {
  let badge: HTMLElement;
  await waitFor(() => {
    const badgeList = container.querySelectorAll('ods-badge');
    badge = Array.from(badgeList).filter((bdg) =>
      [label].includes(bdg.getAttribute('label')),
    )[nth];
    return isHidden
      ? expect(badge).not.toBeDefined()
      : expect(badge).toBeDefined();
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

export const getSelectByName = async ({
  container,
  name,
}: {
  container: HTMLElement;
  name: string;
}) => {
  let select: HTMLOdsSelectElement;
  await waitFor(() => {
    select = container.querySelector(`ods-select[name="${name}"]`);
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
  let card: HTMLOdsCardElement;
  await waitFor(() => {
    card = Array.from(container.querySelectorAll('ods-card'))?.filter((c) =>
      within(c).queryByText(text),
    )?.[nth];
    expect(card).toBeDefined();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return card;
};

export const getComboboxByName = async ({
  container,
  name,
}: {
  container: HTMLElement;
  name: string;
}) => {
  let combobox: HTMLOdsComboboxElement;
  await waitFor(() => {
    combobox = container.querySelector(`ods-combobox[name="${name}"]`);
    expect(combobox).toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return combobox;
};

export const changeTextareaValue = async ({
  container,
  testId,
  value,
}: {
  container: HTMLElement;
  testId: string;
  value: string;
}) => {
  const textarea = container.querySelector(
    `ods-textarea[data-testid="${testId}"]`,
  );
  const event = new CustomEvent('odsChange', {
    detail: { value },
  });
  return waitFor(() => fireEvent(textarea, event), WAIT_FOR_DEFAULT_OPTIONS);
};

export const getTableCellByContentText = async ({
  container,
  text,
  nth = 0,
}: {
  container: HTMLElement;
  text: string;
  nth?: number;
}) => {
  let cell: HTMLTableCellElement;
  await waitFor(() => {
    cell = Array.from(container.querySelectorAll('td'))?.filter((c) =>
      within(c).queryByText(text),
    )?.[nth];
    expect(cell).toBeDefined();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return cell;
};

export const getToggleByName = async ({
  container,
  name,
  nth = 0,
}: {
  container: HTMLElement;
  name: string;
  nth?: number;
}) => {
  let toggle: HTMLOdsToggleElement;
  await waitFor(() => {
    toggle = Array.from(container.querySelectorAll('ods-toggle'))?.filter(
      (el) => el.name === name,
    )?.[nth];
    expect(toggle).toBeDefined();
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return toggle;
};
