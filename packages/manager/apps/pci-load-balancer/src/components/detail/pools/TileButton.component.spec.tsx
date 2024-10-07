import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import TileButton from './TileButton.component';

describe('TileButton', () => {
  it('renders button with correct title', () => {
    const { getByText } = render(
      <TileButton title="Test Title" href="#" isDisabled={false} />,
    );
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders button with correct href', () => {
    const { getByTestId } = render(
      <TileButton
        title="Test Title"
        href="https://example.com"
        isDisabled={false}
        dataTestId="tileButton-button"
      />,
    );
    expect(getByTestId('tileButton-button')).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('disables button when isDisabled is true', () => {
    const { getByTestId } = render(
      <TileButton
        title="Test Title"
        href="#"
        isDisabled
        dataTestId="tileButton-button"
      />,
    );
    expect(getByTestId('tileButton-button')).toBeDisabled();
  });

  it('enables button when isDisabled is false', () => {
    const { getByTestId } = render(
      <TileButton
        title="Test Title"
        href="#"
        isDisabled={false}
        dataTestId="tileButton-button"
      />,
    );
    expect(getByTestId('tileButton-button')).not.toBeDisabled();
  });
});
