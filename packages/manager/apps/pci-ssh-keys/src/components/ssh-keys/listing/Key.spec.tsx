import { render } from '@testing-library/react';
import Key from './Key';

describe('Key Component', () => {
  it('renders clipboard component with publicKey', () => {
    const publicKey = 'ssh-rsa AAA... user@example.com';
    const { getByTestId } = render(<Key publicKey={publicKey} />);

    expect(getByTestId('Key-clipboard')).toBeInTheDocument();
  });
});
