import { waitFor } from '@testing-library/react';
import { render } from '../../utils/test.provider';
import { Clipboard } from './clipboard.component';

const setupSpecTest = async () =>
  waitFor(() => render(<Clipboard value={'Value to copy to clipboard'} />));

describe('Clipboard', () => {
  it('should render value', async () => {
    const { getByTestId } = await setupSpecTest();
    const clipboard = getByTestId('clipboard');
    expect(clipboard).toHaveValue('Value to copy to clipboard');
  });
});
