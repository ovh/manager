import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Open a Select component and select the correct option
 * @param triggerId testId of the trigger select
 * @param options labels of the options that should be in the select
 * @param optionToSelect the option to select
 */
export async function handleSelectOption(
  triggerId: string,
  options: string[],
  optionToSelect: string,
) {
  // Open select
  act(() => {
    const trigger = screen.getByTestId(triggerId);
    fireEvent.focus(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter', code: 13 });
  });

  // Check if select has the options
  await waitFor(() => {
    expect(screen.getByTestId(triggerId)).not.toHaveAttribute(
      'data-state',
      'closed',
    );
    options.forEach((optionLabel) => {
      expect(screen.getByText(optionLabel)).toBeInTheDocument();
    });
  });
  // Select the option
  act(() => {
    const optionsElements = screen.getAllByRole('option');
    const elem = optionsElements.find((e) =>
      e.innerHTML.includes(optionToSelect),
    );
    fireEvent.keyDown(elem, { key: 'Enter', code: 13 });
  });
}
