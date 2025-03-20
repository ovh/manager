import { act, fireEvent, screen, waitFor } from '@testing-library/react';
/**
 * Open a Data Table action menu and trigger an option
 * @param triggerId testId of the trigger select
 * @param buttonId action in menu to trigger
 */
export async function openButtonInMenu(triggerId: string, buttonId: string) {
  act(() => {
    const trigger = screen.getByTestId(triggerId);
    fireEvent.focus(trigger);
    fireEvent.keyDown(trigger, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
    });
  });
  const actionButton = screen.getByTestId(buttonId);
  await waitFor(() => {
    expect(actionButton).toBeInTheDocument();
  });
  act(() => {
    fireEvent.click(actionButton);
  });
}

export async function handleOpenSelect(triggerId: string) {
  // Open select
  const selectTrigger = screen.getByTestId(triggerId);
  await waitFor(() => {
    expect(selectTrigger).toBeInTheDocument();
  });
  act(() => {
    fireEvent.focus(selectTrigger);
    fireEvent.keyDown(selectTrigger, { key: 'Enter', code: 13 });
  });
  expect(selectTrigger).not.toHaveAttribute('data-state', 'closed');
}
/**
 * Open a Select component and select the correct option
 * @param triggerId testId of the trigger select
 * @param options labels of the options that should be in the select
 * @param optionToSelect the option to select
 */
export async function handleSelectOption(
  triggerId: string,
  optionToSelect: string,
) {
  await handleOpenSelect(triggerId);
  const optionsElements = screen.getAllByRole('option');
  const elem = optionsElements.find((e) =>
    e.innerHTML.includes(optionToSelect),
  );
  fireEvent.keyDown(elem, { key: 'Enter', code: 13 });
}

export async function handleSelectText(
  triggerId: string,
  elementoSelect: string,
) {
  await handleOpenSelect(triggerId);
  const optionToSelect = screen.getByText(elementoSelect);
  fireEvent.keyDown(optionToSelect, { key: 'Enter', code: 13 });
}

export async function handleOpenCombo(triggerId: string) {
  const selectTrigger = screen.getByTestId(triggerId);
  // Open select
  await waitFor(() => {
    expect(selectTrigger).toBeInTheDocument();
  });
  act(() => {
    fireEvent.click(selectTrigger);
  });
  expect(selectTrigger).not.toHaveAttribute('data-state', 'closed');
}

export async function handleSelectComboboxText(
  triggerId: string,
  elementoSelect: string,
) {
  await handleOpenCombo(triggerId);
  const optionToSelect = screen.getByText(elementoSelect);
  fireEvent.click(optionToSelect);
}
