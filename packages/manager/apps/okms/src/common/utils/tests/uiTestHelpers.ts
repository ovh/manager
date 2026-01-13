import { SECRET_VALUE_TOGGLE_TEST_IDS } from '@secret-manager/components/secret-value/secretValueToggle.constants';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

/* GET BY TEST ID */

export const changeOdsInputValueByTestId = async (inputTestId: string, value: string) => {
  // First try to get the input directly
  let input = screen.queryByTestId(inputTestId);

  // If the input is not found, try to find it with a findByTestId
  // This can look silly, but the ODS input renders in a mysterious way
  // and if you use a findByTestId when you need a getByTestId (and reverse), it won't work
  if (!input) {
    input = await screen.findByTestId(inputTestId);
  }

  act(() => {
    fireEvent.change(input, {
      target: { value },
    });
  });

  // Wait for the data input to be updated
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
};

type GetOdsClipboardByValueParams = {
  container: HTMLElement;
  value: string;
};

export const getOdsClipboardByValue = ({ container, value }: GetOdsClipboardByValueParams) => {
  return container.querySelector(`ods-clipboard[value="${value}"]`);
};

/**
 * Clicks on the JSON toggle
 */
export const clickJsonEditorToggle = async (user: UserEvent) => {
  const jsonToggle = screen.getByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle);
  await act(() => user.click(jsonToggle));
};

export const assertTitleVisibility = async (
  title: string,
  type: 'heading-1' | 'heading-2' | 'heading-3',
  timeout?: number,
) => {
  await waitFor(
    () => {
      const titleElement = document.querySelector(`.ods-text[preset="${type}"]`);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent(title);
    },
    { timeout: timeout ?? 3000 },
  );
};

export const assertPageTitleVisibility = async (title: string, timeout?: number) => {
  await assertTitleVisibility(title, 'heading-1', timeout);
};
