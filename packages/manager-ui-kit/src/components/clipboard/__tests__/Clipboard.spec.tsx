import { render, screen } from '@testing-library/react';

import { Clipboard } from '@/components';

const renderClipboardComponent = (props = {}) =>
  render(<Clipboard value={'Value to copy to clipboard'} {...props} />);

describe('Clipboard', () => {
  it('should render value', () => {
    renderClipboardComponent();
    expect(screen.getByTestId('clipboard').getElementsByTagName('input')[0]).toHaveValue(
      'Value to copy to clipboard',
    );
  });

  it('should render disabled Clipboard', () => {
    renderClipboardComponent({ disabled: true });
    expect(screen.getByTestId('clipboard').getElementsByTagName('input')[0]).toBeDisabled();
  });

  it('should render loading Clipboard', () => {
    renderClipboardComponent({ loading: true });
    const clipboardEl = screen.getByTestId('clipboard');
    const spinner = clipboardEl.querySelector('[data-ods="spinner"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should render masked Clipboard', () => {
    renderClipboardComponent({ masked: true });
    expect(screen.getByTestId('clipboard').getElementsByTagName('input')[0]).toHaveAttribute(
      'type',
      'password',
    );
  });
});
