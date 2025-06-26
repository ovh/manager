import { waitFor } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { Clipboard } from '../Clipboard.component';

const setupSpecTest = async (props = {}) =>
  waitFor(() =>
    render(<Clipboard value={'Value to copy to clipboard'} {...props} />),
  );

describe('Clipboard', () => {
  it('should render value', async () => {
    const { getByTestId } = await setupSpecTest();
    const clipboard = getByTestId('clipboard');
    expect(clipboard.getElementsByTagName('input')[0]).toHaveValue(
      'Value to copy to clipboard',
    );
  });

  it('should render disabled Clipboard', async () => {
    const { getByTestId } = await setupSpecTest({ disabled: true });
    const clipboard = getByTestId('clipboard');
    expect(clipboard.getElementsByTagName('input')[0]).toBeDisabled();
  });

  it('should render loading Clipboard', async () => {
    const { getByTestId } = await setupSpecTest({ loading: true });
    const clipboard = getByTestId('clipboard');
    expect(clipboard.getElementsByTagName('span')[0]).toHaveRole('progressbar');
  });

  it('should render masked Clipboard', async () => {
    const { getByTestId } = await setupSpecTest({ masked: true });
    const clipboard = getByTestId('clipboard');
    expect(clipboard.getElementsByTagName('input')[0]).toHaveAttribute(
      'type',
      'password',
    );
  });
});
