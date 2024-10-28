import { fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Clipboard } from './clipboard.component';
import { regular } from './clipboard.stories';
import translation_messages from './translations/Messages_fr_FR.json';

const setupSpecTest = async () =>
  waitFor(() => render(<Clipboard value={regular.args.value} />));

describe('Clipboard', () => {
  it('should render value', async () => {
    const { getByTestId } = await setupSpecTest();
    const clipboard = getByTestId('clipboard');

    expect(clipboard).toHaveValue(regular.args.value);
  });

  it('should render success popover with translated text on success copy', async () => {
    const { getByTestId } = await setupSpecTest();
    const clipboard = getByTestId('clipboard');

    fireEvent.click(clipboard);

    const successPopover = getByTestId('clipboard-success');

    expect(successPopover).toBeVisible();
    expect(successPopover).toHaveTextContent(
      translation_messages.clipboard_copy_success,
    );
  });

  it('should render error popover with translated text on error copy', async () => {
    const { getByTestId } = await setupSpecTest();
    const clipboard = getByTestId('clipboard');

    const clickHandler = jest.spyOn(clipboard, 'click');
    clipboard.click = () => {
      throw new Error('Mock error on click');
    };

    fireEvent.click(clipboard);

    const errorPopover = getByTestId('clipboard-error');

    expect(errorPopover).toBeVisible();
    expect(errorPopover).toHaveTextContent(
      translation_messages.clipboard_copy_error,
    );

    clickHandler.mockRestore();
  });
});
